import React from 'react';
import Board from './board.js';
import Options from './options.js';
import Info from './info.js';
import { deepCloneArray, setNewStates } from './functions.js';
import '../css/index.css';

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: true,
    };
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = deepCloneArray(current.squares.slice());

    if ( this.calculateWinner(squares) || squares[i][j] || ( this.state.gravity && !(i === this.state.height - 1 || squares[i + 1][j]) ) ) {
      return null;
    }

    squares[i][j] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        location: {
          row: i + 1, 
          column: j + 1,
        }
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleToggleOrder() {
    this.setState(state => ({ascendingOrder: !state.ascendingOrder}));
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  calculateWinner(squares) {
    for (let i = 0; i < (this.state.height); i++) {
      for (let j = 0; j < (this.state.width); j++) {
        if (squares[i][j]) {
          const lines = {
            vertical: [[i, j]],
            horizontal: [[i, j]],
            diagonalTop: [[i, j]],
            diagonalBottom: [[i, j]],
          };

          const height = this.state.height;
          const width = this.state.width;

          for (let k = 1; k < this.state.winLength; k++) {
            if (i + k < height && squares[i][j] === squares[i + k][j]) lines.vertical.push([i + k, j]);
            if (j + k < width && squares[i][j] === squares[i][j + k]) lines.horizontal.push([i, j + k]);
            if (i + k < height && j + k < width && squares[i][j] === squares[i + k][j + k]) lines.diagonalBottom.push([i + k, j + k]);
            if (i - k >= 0 && j + k <= width && squares[i][j] === squares[i - k][j + k]) lines.diagonalTop.push([i - k, j + k]);
          }

          for (const direction in lines) {
            if (lines[direction].length === this.state.winLength) {
              return {
                winner: squares[i][j],
                winLine: lines[direction],
              }
            }
          }
        }
      }
    }

    return null;
  }

  render() {
    let gameField = null;

    if (!this.state.hide) {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winInfo = this.calculateWinner(current.squares);
      const winner = winInfo?.winner;
      const winLine = winInfo?.winLine;
  
      let moves = history.map((step, move) => {
        const desc = move ?
          `Go to move #${move} (col: ${step.location.column}, row: ${step.location.row})` :
          'Go to game start';

        const moveStateClass = move === this.state.stepNumber ? 'move--active' : null;
  
        return (
          <li key = {move}>
            <button 
              className = {moveStateClass}
              onClick = {this.jumpTo.bind(this, move)}
            >{desc}</button>
          </li>
        )
      });
  
      if (!this.state.ascendingOrder) {
        moves.reverse();
      }
  
      let status;
      let boardIsNotFull = false;
  
      current.squares.forEach(row => {if (row.includes(null)) boardIsNotFull = true;});
  
      if (winner) {
        status = `Winner: ${winner}`;
      } else if (boardIsNotFull) {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      } else {
        status = "It's a draw!";
      }
  
      gameField = (
        <div className="game">
          <Board 
            squares = {current.squares}
            width = {this.state.width}
            height = {this.state.height}
            onSquareClick = { this.handleClick.bind(this) }
            winLine = {winLine}
            gravity = {this.state.gravity}
          />
          <Info
            status = {status}
            ascendingOrder = { this.state.ascendingOrder }
            onCheckBoxChange = { this.handleToggleOrder.bind(this) }
            moves = {moves}
          />
        </div>
      );
    }

    return (
      <div className = "game-container">
        {gameField}
        <Options 
          onSubmit = { setNewStates.bind(this) }
        />
      </div>
    );
  }
}