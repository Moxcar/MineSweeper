import React from 'react';
import Board from './components/Board';

function App() {
  const [state, setState] = React.useState({ size: 8, mines: 10, gameStatus: "waiting...", newSize: 8, newMines: 10 });
  return (
    <div style={{
      display: "grid",
      justifyContent: "center",
      gridGap: "20px"
    }}>
      <div style={{
        display: "grid",
        justifyContent: "center"
      }}>
        <label>Size</label>
        <input type='number' value={state.newSize} min={2} max={20} onChange={(e) => setState({ ...state, newSize: e.target.value })}></input>
        <label>Mines</label>
        <input type='number' value={state.newMines} min={1} max={(state.newSize ** 2) - 1} onChange={(e) => setState({ ...state, newMines: e.target.value })}></input>
        <button type='submit' onClick={(e) => setState({ ...state, gameStatus: "waiting...", size: state.newSize, mines: state.newMines })}>Start/Restart</button>
      </div>

      <Board
        size={state.size}
        mines={state.mines}
        gameStatus={state.gameStatus}
        changeGameStatus={(newStatus) => {
          setState({ ...state, gameStatus: newStatus })
        }}></Board>
      <h1>{"Game status: " + state.gameStatus}</h1>
    </div>
  );
}

export default App;
