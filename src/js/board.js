import '../css/board.css';

export default function Board({squares, width, height, onSquareClick, winLine, gravity}) {
  function Square({onClick, value, isWinCell, isActiveCell}) {
    const cellStateClass = value ? (isWinCell ? 'square--win' : 'square--placed') : (isActiveCell ? 'square--active' : 'square--inactive');
  
    return (
      <button
        className = {`square ${cellStateClass}`}
        onClick = { onClick }
      >
        { value }
      </button>
    )
  }

  function checkWinCell(i ,j) {
    if (winLine) 
      {
        return winLine.some(
          cell => (cell[0] === i && cell[1] === j)
        );
      };
    return false;
  }

  function checkActiveCell(i, j) {
    if (gravity) {
      return (i === height - 1 || squares[i + 1][j]);
    }
    return true;
  }

  function renderSquare(i, j) {
    return (
      <Square 
        key = {width * i + j}
        value = {squares[i][j]} 
        onClick = {() => onSquareClick(i, j)}
        isWinCell = {checkWinCell(i ,j)}
        isActiveCell = {checkActiveCell(i, j)}
      />
    );
  }
  
  function renderRow(i) {
    const cells = [];

    for (let j = 0; j < width; j++) {
      cells.push(renderSquare(i, j));
    }

    return (
      <div className = 'board__row' key = {i}>
        { cells }
      </div>
    );
  }

  const rows = [];

  for (let i = 0; i < height; i++) {
    rows.push(renderRow(i));
  }

  return (
    <div className = 'board'>
      { rows }
    </div>
  );
}