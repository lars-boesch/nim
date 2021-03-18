import React from 'react';
import ReactDOM from 'react-dom';

// game functions

// var board = [[0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1]];

function count(b) {
  var cards = [0,0,0,0];
  for (let i = 0; i < b.length; i++){
    for (let j = 0; j < b[0].length; j++){
      if (b[i][j] === 1){
        cards[i] += 1;
      }
    }
  }
  return cards;
}


function is_even(bin) {
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] % 2 !== 0) {
      return false;
    }
  }
  return true;
}


function toBinary(n) {
    n = Number(n);
    if (n === 0) return '000';
    var r = '';
    var i = 0;
    while (i < 3) {
      if (n === 0) {
        r = '0' + r;
      } else {
        r = ((n&1)?'1':'0') + r;
        n = n >>> 1;
      }
      i++;
    }
    return r;
}


function analyze(cards) {
  var res = [0, 0, 0];
  for (let i = 0; i < cards.length; i++) {
    cards[i] = toBinary(cards[i]);
  }
  for (let j = 0; j < cards[0].length; j++) {
    for (let k = 0; k < cards.length; k++) {
      if (cards[k][j] === '1'){
        res[j]++;
      }
    }
  }
  return [cards, res];
}


function nim(b, row, n) {
  var sum = b[row].reduce(function(a, b){
        return a + b;
    }, 0);
  if (sum >= n){
    var i = 0;
    while (n > 0){
      if (b[row][i] === 1){
        b[row][i] = 0;
        n -= 1;
      }
      i++;
    }
    return b;
  } else {
    throw new Error('too many cards');
  }
}


function check_move(b, i, j) {
  var bcopy = [];
  for (let k = 0; k < b.length; k++) {
    var r = [];
    for (let l = 0; l < b[k].length; l++) {
      r.push(b[k][l]);
    }
    bcopy.push(r);
  }
  bcopy = nim(bcopy, i, j);
  return analyze(count(bcopy))[1];
}


function next_move(b) {
  var res = analyze(count(b));
  if (is_even(res[1])) {
    var row = getRandomInt(0, 3);
    while (res[0][row] === '000'){
      row = getRandomInt(0, 3);
    }
    var s = b[row].reduce(function(a, b){
          return a + b;}, 0);
    if (s === 1) {
      return [row, 1];
    } else {
      var n = getRandomInt(1, s);
    }
    return [row, n];
  } else {
    for (let i = 0; i < b.length; i++) {
      for (let j = 1; j < (b[0].length + 1); j++) {
        try {
          if (is_even(check_move(b, i, j))) {
            return [i, j];
          }
        }
        catch (e) {
          continue;
        }
      }
    }
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



// disp

function Card(props) {
  return (
    <button className="card" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderCard(i, j) {
    return (
      <Card
      value={this.props.board[i][j]}
      onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderCard(0, 0)}
          {this.renderCard(0, 1)}
          {this.renderCard(0, 2)}
          {this.renderCard(0, 3)}
          {this.renderCard(0, 4)}
          {this.renderCard(0, 5)}
          {this.renderCard(0, 6)}
        </div>
        <div className="board-row">
          {this.renderCard(1, 0)}
          {this.renderCard(1, 1)}
          {this.renderCard(1, 2)}
          {this.renderCard(1, 3)}
          {this.renderCard(1, 4)}
          {this.renderCard(1, 5)}
          {this.renderCard(1, 6)}
        </div>
        <div className="board-row">
          {this.renderCard(2, 0)}
          {this.renderCard(2, 1)}
          {this.renderCard(2, 2)}
          {this.renderCard(2, 3)}
          {this.renderCard(2, 4)}
          {this.renderCard(2, 5)}
          {this.renderCard(2, 6)}
        </div>
        <div className="board-row">
          {this.renderCard(3, 0)}
          {this.renderCard(3, 1)}
          {this.renderCard(3, 2)}
          {this.renderCard(3, 3)}
          {this.renderCard(3, 4)}
          {this.renderCard(3, 5)}
          {this.renderCard(3, 6)}
        </div>
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {board: [[0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1]]};
  }

  handleClick(i, j) {
    var boardcopy = this.state.board;
    if (boardcopy[i][j] === 1) {
      boardcopy[i][j] = 0;
      this.setState({board: boardcopy});
      var isAllZero = true;
      for (let i = 0; i < 4;i++) {
        for (let j = 0; j < 7;j++) {
          if (this.state.board[i][j] === 1) {
            isAllZero = false;
          }
        }
      }
      if (isAllZero) {
        this.setState({board: [[0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1]]});
      }
      return;
    }
    return;
  }

  sendState() {
    var nextMove = next_move(this.state.board);
    this.setState({board: nim(this.state.board, nextMove[0], nextMove[1])});
    var isAllZero = true;
    for (let i = 0; i < 4;i++) {
      for (let j = 0; j < 7;j++) {
        if (this.state.board[i][j] === 1) {
          isAllZero = false;
        }
      }
    }
    if (isAllZero) {
      this.setState({board: [[0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1]]});
    return;
    }
  }

  newGame() {
    this.setState({board: [[0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1]]});
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
        <Board
          board={this.state.board}
          onClick={(i, j) => this.handleClick(i, j)}
        />
        <button onClick={() => this.sendState()}>{"Submit"}</button>
        <button onClick={() => this.newGame()}>{"new Game"}</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
