import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className = "square"
      onClick = { props.onClick }
      style = { { backgroundColor: props.value ? ( props.isWinCell ? 'yellowgreen' : 'burlywood') : ( props.isActiveCell ? 'antiquewhite' : 'lightgray' ) } }
    >
      { props.value }
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, j) {
    return <Square 
      key = {[i, j]}
      value = {this.props.squares[i][j]} 
      onClick = {() => this.props.onClick(i, j)}
      isWinCell = {this.props.winLine ? this.props.winLine.some(cell => ((cell[0] === i) && (cell[1] === j))) : false}
      isActiveCell = {this.props.gravity ? ( ( (i === (this.props.height - 1)) || this.props.squares[i + 1][j] ) ? true : false ) : true}
    />;
  }
  
  renderRow(i) {
    const cells = [];

    for (let j = 0; j < this.props.width; j++) {
      cells.push(this.renderSquare(i, j));
    }

    return (
      <div className='board-row' key={i}>
        { cells }
      </div>
    )
  }

  render() {
    const rows = [];

    for (let i = 0; i < this.props.height; i++) {
      rows.push(this.renderRow(i));
    }

    return (
      <div>
        { rows }
      </div>
    )
  }
}

function CheckBoxOrder(props) {
  return (
    <div>
      <input 
        type='checkbox' 
        id='order' 
        checked={props.checked}
        onChange={props.onChange}
      >
      </input>
      <label htmlFor='order'>Moves in ascending order?</label>
    </div>
  )
}

function InputNumber (props) {
  return (
    <p>{props.label}: <input
      type = 'number'
      min = {props.min}
      max = {props.max}
      defaultValue = {props.defaultValue}
      onChange = {
        event => { props.onChange({ [props.stateKey]: +event.target.value }); }
      }
    /></p>
  );
}

class Options extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
      hide: false,
      height: 3,
      width: 3,
      winLength: 3,
      gravity: false,
    }
  }

  handleStateChange(...newState) {
    this.setState(Object.assign({}, ...newState));
  }

  render() {
    return(
      <form 
        onSubmit = {
          event => {
            event.preventDefault();
            
            this.props.onSubmit(
              this.state, 
              {
                history: [{
                  squares: Array(this.state.height).fill(Array(this.state.width).fill(null)),
                }]
              }
            );
          }
        }
      >
        <InputNumber
          label = 'Height of the field'
          min = '2'
          max = '50'
          defaultValue = '3'
          onChange = { this.handleStateChange.bind(this) }
          stateKey = 'height'
        />
        <InputNumber
          label = 'Width of the field'
          min = '2'
          max = '50'
          defaultValue = '3'
          onChange = { this.handleStateChange.bind(this) }
          stateKey = 'width'
        />
        <InputNumber
          label = 'Length of line to win'
          min = '2'
          max = {Math.min(this.state.height, this.state.width)}
          defaultValue = '3'
          onChange = { this.handleStateChange.bind(this) }
          stateKey = 'winLength'
        />
        <div className='checkbox-margin'>
          <input 
            type='checkbox' 
            id='gravity' 
            onChange={
              event => {
                this.setState({gravity: event.target.checked});
              }
            }
          >
          </input>
          <label htmlFor='gravity'>Turn on "gravity"?</label>
        </div>
        <input type='submit' value='Confirm' />
      </form>
    )
  }
}

class Game extends React.Component {
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

    if (this.calculateWinner(squares) || squares[i][j] || (this.state.gravity && !((i === (this.state.height - 1)) || squares[i + 1][j]))) {
      return;
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

  handleChange() {
    this.setState({ascendingOrder: !this.state.ascendingOrder});
  }

  handleSubmit(...newState) {
    this.setState(Object.assign({}, ...newState));
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
          let vertical = [[i, j]];
          let horizontal = [[i, j]];
          let diagonalTop = [[i, j]];
          let diagonalBottom = [[i, j]];

          for (let k = 1; k < this.state.winLength; k++) {
            if ((i + k < this.state.height) && (squares[i][j] === squares[i + k][j]))  vertical.push([i + k, j]);
            if ((j + k < this.state.width) && (squares[i][j] === squares[i][j + k])) horizontal.push([i, j + k]);
            if ((i + k < this.state.height) && (j + k < this.state.width) && (squares[i][j] === squares[i + k][j + k])) diagonalBottom.push([i + k, j + k]);
            if ((i - k >= 0) && (j + k <= this.state.width) && (squares[i][j] === squares[i - k][j + k])) diagonalTop.push([i - k, j + k]);
          }

          if (vertical.length === this.state.winLength) {
            return {
              winner: squares[i][j],
              winLine: vertical,
            }
          }
          
          if (horizontal.length === this.state.winLength) {
            return {
              winner: squares[i][j],
              winLine: horizontal,
            }
          }

          if (diagonalBottom.length === this.state.winLength) {
            return {
              winner: squares[i][j],
              winLine: diagonalBottom,
            }
          }

          if (diagonalTop.length === this.state.winLength) {
            return {
              winner: squares[i][j],
              winLine: diagonalTop,
            }
          }
        }
      }
    }

    return null;
  }

  render() {
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
  
        return (
          <li key={move}>
            <button 
              onClick={() => this.jumpTo(move)}
              style={{fontWeight: move === this.state.stepNumber ? 'bold' : 'normal',}}
            >
              {desc}
            </button>
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
  
      this.gameField = (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              width = {this.state.width}
              height = {this.state.height}
              onClick = { (i, j) => this.handleClick(i, j) }
              winLine = {winLine}
              gravity = {this.state.gravity}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <br></br>
            <CheckBoxOrder 
              checked={this.state.ascendingOrder} 
              onChange={ () => this.handleChange() }
            />
            <ol reversed={!this.state.ascendingOrder}>{moves}</ol>
          </div>
        </div>
      );
    }

    return (
      <div className="application">
        {this.gameField}
        <div className='game-options'>
          <Options 
            onSubmit={ this.handleSubmit.bind(this) }
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// ========================================

function deepCloneArray(arr) 
{
  return arr.map(item => Array.isArray(item) ? deepCloneArray(item) : item);
}