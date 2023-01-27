import "./App.css";
import React from "react";
import "./index.css";

function Square(props) {
  return (
    /* props.onClick doesn't need to have parentheses because it's a prop with the function as a value.
      Not an actual function. */
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardSquares = [];
    for(let i = 0; i < 3; i++){
      let tempRow = [];
      for(let j = 0; j < 3; j++){
        tempRow.push(<span key={((i * 3) + j)}>{this.renderSquare((i * 3) + j)}</span>);
      }
      boardSquares.push(
        <div className="board-row" key={i}>{tempRow}</div>
      )
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: "",
        },
      ],
      stepNumber: 0, //Current selected Step
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    let tempLocation = "";
    switch (i) {
      case 0:
        tempLocation = "(1, 3)";
        break;
      case 1:
        tempLocation = "(2, 3)";
        break;
      case 2:
        tempLocation = "(3, 3)";
        break;
      case 3:
        tempLocation = "(1, 2)";
        break;
      case 4:
        tempLocation = "(2, 2)";
        break;
      case 5:
        tempLocation = "(3, 2)";
        break;
      case 6:
        tempLocation = "(1, 1)";
        break;
      case 7:
        tempLocation = "(1, 2)";
        break;
      case 8:
        tempLocation = "(1, 3)";
        break;
      default:
        break;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        /* Here, basically adding to the end of history (history += {squares: squares}) */
        {
          squares: squares,
          location: tempLocation,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    /* Notice: making use of this section to change data before returning in the return statement */
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      const moveLoc = move ? step.location : "";

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? "bolded-text" : ""}
          >
            {desc} {moveLoc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
