import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button 
    className="square" 
    onClick={props.onClick}
    style = {props.winningSquare ? {backgroundColor:'cyan'} : null }>
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  
  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare = {winningSquare}
      />
    );
  };
  
  renderRow(i){
    let square = [];
    for(let j = 0; j < 3;j++){
      square = square.concat([(this.renderSquare(i*3 + j))]);
    }
    return (
    <div className = "board-row">
      {square}
    </div> 
    );
  }
  render() {
    let rows = [];
    for(let i = 0;i < 3;i++){
      rows = rows.concat([this.renderRow(i)]);
    }
    return (
      <div>
      {rows}
      </div>
    );
  };
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        allLocations: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ASCisNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        allLocations: i,
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

  Sort(){
    const {history, ASCisNext} = this.state;
    this.setState({
      history: history.reverse(),
      ASCisNext: !ASCisNext,
    });
    return;
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + calculateLocation(step.allLocations) :
        'Go to game start';
      return (
        <li key = {move}>
          <button 
          onClick={() => this.jumpTo(move)}
          style = {this.state.stepNumber === move ? {fontWeight : 'bold'} : {fontWeight: 'normal'}}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.namewinner;
    } else if(!checkNULL(current.squares)){
      alert("The match is draw !!!");
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let sort = this.state.ASCisNext ? 'ASC' : 'DES';
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner = {winner && winner.winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className = "game-info">
        <div>Sort</div>
        <button onClick = {() => this.Sort()}>{sort}</button>
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
      return {
        namewinner: squares[a],
        winnerSquares: lines[i]
      };
    }
  }
  return null;
}
function calculateLocation(i){
  return `(${parseInt(i/3)},${parseInt(i%3)})`;
}
function checkNULL(square){
  return square.includes(null);
}
