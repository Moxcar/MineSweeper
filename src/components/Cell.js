function Cell(props) {
    let getText = () => {
        if (props.isFlagged) return <span>&#128681;</span>
        if (!props.active) return ""
        if (props.state === 0) return ""
        return props.state === -1 ? <span>&#128163;</span> : props.state
    }

    return <div
        style={{ ...cellStyle, backgroundColor: props.active ? "#999" : "#DDD", }}
        onClick={props.onCellClick}
        onContextMenu={props.onContextCellMenu}>
        {getText()}
    </div>;
}

const cellStyle = {
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: "pointer"
}
export default Cell