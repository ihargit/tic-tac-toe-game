import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={`square ${props.isWinner ? 'square--winner' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinner={this.props.winSquares.includes(i) ? true : false}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={`square ${i}`}
      />
    );
  }

  createCells = () => {
    let rows = [];
    for (let i = 0; i < 3; i ++) {
      let cells = [];
        for (let n = 0; n < 3; n++) {
          cells.push(this.renderSquare(3 * i + n));
        }
      rows.push(<div className="board-row" key={`row ${i}`}>{cells}</div>);
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.createCells()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
          squares: Array(9).fill(null),
          currentRow: null,
          currentColumn: null
        }],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true,
    }
  }

  calculateRowCol(i) {
    const row = Math.floor(i / 3);
    const col = i - row * 3;
    return { row: row, col: col}
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const currentRowColumn = this.calculateRowCol(i);
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentRow: currentRowColumn.row,
        currentColumn: currentRowColumn.col
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseHistoryList() {
    this.setState({
      isDescending: !this.state.isDescending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move} (col: ${step.currentColumn}, row: ${step.currentRow})` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = `Winner: ${winner.player}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.reverseHistoryList()}>{`Sort list in ${this.state.isDescending ? 'descending' : 'ascending'} order`}</button>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

