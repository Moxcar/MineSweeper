import React from "react";
import Cell from "./Cell";

let checkIfWin = (data, size, mines) => {
    return data.reduce((acc, item) => {
        return acc + item.reduce((acc2, cell) => {
            if (cell.active) return acc2 + 1
            else return acc2
        }, 0)
    }, 0) === (size * size) - mines
}

const activeCluster = (x, y, data, size) => {
    let adjacentCells = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, 1], [-1, -1]]
    let queue = [[x, y]]
    while (queue.length !== 0) {
        let actualCell = queue.pop()
        data[actualCell[0]][actualCell[1]] = { ...data[actualCell[0]][actualCell[1]], active: true, isFlagged: false }
        if (data[actualCell[0]][actualCell[1]].state !== 0) continue
        adjacentCells.forEach((adjacentCell) => {
            let newX = actualCell[0] + adjacentCell[0]
            let newY = actualCell[1] + adjacentCell[1]
            if (size <= newX || newX < 0 || size <= newY || newY < 0) return
            if (data[newX][newY].active) return
            queue.push([newX, newY])
        })
    }
    return data
}

let revealBombs = (data) => {
    return data.map(item => {
        return item.map(cell => {
            return { ...cell, active: (cell.state === -1 ? true : cell.active) }
        })
    })
}

let flagAllBombs = (data) => {
    return data.map(item => {
        return item.map(cell => {
            return { ...cell, isFlagged: (cell.state === -1 ? true : cell.isFlagged) }
        })
    })
}

function Board({ size, mines, changeGameStatus, gameStatus }) {
    const [myCells, setCells] = React.useState([])
    let setMyCells = (val) => {
        setCells(val)
    }
    React.useEffect(() => {
        if(gameStatus !== "waiting...") return 
        //Create an array with the cells
        let cells = new Array(size * size).fill(null).map(() => { return { state: 0, active: false, isFlagged: false } });
        //Put some mines in random spots
        for (let i = 0; i < mines; i++) {
            cells[i].state = -1
        }
        cells.sort(() => 0.5 - Math.random())
        //Transform the array to a matrix
        cells = cells.reduce((acc, i) => {
            if (acc[acc.length - 1].length >= size) {
                acc.push([]);
            }
            acc[acc.length - 1].push(i);
            return acc;
        }, [[]]);
        //Calculate cells nums
        let adjacentCells = [[0, 1], [0, -1], [1, 0], [1, 1], [1, -1], [-1, 0], [-1, 1], [-1, -1]]
        cells.forEach((row, i1) => {
            row.forEach((cell, i2) => {
                if (cell.state === -1) {
                    for (let [x, y] of adjacentCells) {
                        let newX = i1 + x
                        let newY = i2 + y
                        if (size <= newX || newX < 0) continue
                        if (size <= newY || newY < 0) continue
                        let actualCell = cells[newX][newY];
                        if (actualCell.state !== -1) {
                            actualCell.state++;
                        }
                    }
                }
            })
        })
        changeGameStatus("in game")
        setMyCells(cells)
    }, [size, mines, gameStatus]);

    //Handle cell click event
    const onCellClick = (x, y) => {
        if (gameStatus !== "in game") return
        if (myCells[x][y].active || myCells[x][y].isFlagged) return;
        if (myCells[x][y].state === -1) {
            setMyCells(revealBombs(myCells))
            changeGameStatus("Game Over ☠")
            return
        }
        let updatedCells = [...myCells];
        updatedCells[x][y] = { ...updatedCells[x][y], active: true };
        if (updatedCells[x][y].state === 0) {
            updatedCells = activeCluster(x, y, updatedCells, size)
        }
        setMyCells(updatedCells);
        if (checkIfWin(updatedCells, size, mines)) {
            setMyCells(flagAllBombs(updatedCells, size))
            changeGameStatus("You WIN 😎")
        }
    };

    //Handle cell right click event
    const onContextCellMenu = (e, x, y) => {
        e.preventDefault()
        if (gameStatus !== "in game") return
        if (myCells[x][y].active) return
        let updatedCells = [...myCells]
        if (myCells[x][y].isFlagged) updatedCells[x][y] = { ...updatedCells[x][y], isFlagged: false }
        else updatedCells[x][y] = { ...updatedCells[x][y], isFlagged: true }
        setMyCells(updatedCells)
    }

    //Transform data into Cells components
    let renderCells = (data) => {
        return data.map((row, index) => {
            return row.map((cell, i) => {
                return <Cell
                    key={index + "-" + i}
                    state={cell.state}
                    active={cell.active}
                    isFlagged={cell.isFlagged}
                    onCellClick={() => onCellClick(index, i)}
                    onContextCellMenu={(e) => onContextCellMenu(e, index, i)} />
            })

        })
    }

    return (
        <div style={{
            display: "grid", gridTemplateColumns: "repeat(" + size + ", 30px) ", gridGap: 2, justifyContent: "center"
        }}>
            {renderCells(myCells)}
        </div>
    )
}

export default Board