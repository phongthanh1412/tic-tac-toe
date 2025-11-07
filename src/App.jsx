import { useState } from 'react'
import './App.css'

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button 
      className={`square ${isWinningSquare ? 'winning-square' : ''} ${value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  // Use two loops to create the board
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const isWinningSquare = winningLine && winningLine.includes(index);
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <div className="board">{boardRows}</div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, squareIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), { 
      squares: nextSquares, 
      location: squareIndex 
    }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setIsAscending(!isAscending);
  }

  function resetGame() {
    setHistory([{ squares: Array(9).fill(null), location: null }]);
    setCurrentMove(0);
  }

  const winner = calculateWinner(currentSquares);
  const winningLine = winner ? winner.line : null;

  const moves = history.map((step, move) => {
    let description;
    let location = '';
    
    if (step.location !== null) {
      const row = Math.floor(step.location / 3) + 1;
      const col = (step.location % 3) + 1;
      location = ` (${row}, ${col})`;
    }

    if (move > 0) {
      description = 'Go to move #' + move + location;
    } else {
      description = 'Go to game start';
    }

    // For current move, show text instead of button
    if (move === currentMove) {
      return (
        <li key={move}>
          <span className="current-move">You are at move #{move}{location}</span>
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Sort moves based on isAscending
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <h1 className="game-title">
        Tic Tac Toe In <span className="react-text">React</span>
      </h1>
      <div className="game-container">
        <div className="left-section">
          <div className="controls-container">
            <div className="status-box">
              {winner ? (
                <span className="winner-text">Winner: {winner.player}</span>
              ) : currentSquares.every(square => square !== null) ? (
                <span className="draw-text">It's a draw!</span>
              ) : (
                <span>Next player: <strong>{xIsNext ? 'X' : 'O'}</strong></span>
              )}
            </div>
            <button className="reset-button" onClick={resetGame}>
              Reset
            </button>
          </div>
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
          </div>
        </div>
        <div className="game-info">
          <button className="sort-button" onClick={toggleSort}>
            Sort: {isAscending ? '↓ Descending' : '↑ Ascending'}
          </button>
          <ol reversed={!isAscending}>{sortedMoves}</ol>
        </div>
      </div>
    </div>
  );
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
      return { player: squares[a], line: lines[i] };
    }
  }
  return null;
}
