// index.js
var readlineSync = require('readline-sync')
var rows = 3
var cols = 3
var lineLength = 3
var gameBoard = []
var players = [2]
var nbrPlayers = 1
var turn = 1
var turnCount = 0
var mark = ' X '
var gameOver = false
var nextPosition = []

function main () {
  setupGame()
}

function setupGame () {
  rows = parseInt(ask('row', 'Give number of game board rows [3 or more]', 'Amount of rows must be at least 3"', '', '', '^[0-9]{1,}$'))
  console.log(rows)
  cols = parseInt(ask('col', 'Give number of game board columns  [3 or more]', 'Amount of columns must be at least 3"', '', '', '^[0-9]{1,}$'))
  console.log(cols)
  lineLength = parseInt(ask('lineLength', 'Give number of items need to win the game [3 or more]', 'Winning line length must be at least 3"', 'Winning line length cannot be shorter than 3', 'Winning line cannot be longer than rows or columns.', '^[0-9]{1,}$'))
  nbrPlayers = parseInt(ask('nbrPlayers', 'How many players [1 or 2]?', 'Select 1 or 2', '', '', '^[1-2]{1}$'))
  players[0] = ask('player1', 'Name of the Player 1', 'Name must contain alphabets only', '', '', '^[A-z]{2,}$')
  if (nbrPlayers === 2) {
    players[1] = ask('player2', 'Name of the Player 2', 'Name must contain alphabets only', '', '', '^[A-z]{2,}$')
  } else players[1] = 'computer'
  setupBoard()
  playGame()
}

function ask (type, question, errormsg1, errormsg2, errormsg3, reg) {
  var regex = new RegExp(reg)
  var value = ''
  var success = false
  do {
    value = readlineSync.question(question + ': ')
    success = regex.test(value)
    if (!success) {
      console.log('incorrect input')
    } else {
      // Checking that amount of rows and cols are correct
      if (type === 'row' || type === cols) {
        if (!success || value < 3) {
          console.log(errormsg1)
          success = !success
        }
      // checking that winning line length is correct
      } else if (type === lineLength) {
        if (!success || (value < 3)) {
          console.log(errormsg2)
          success = !success
        } else if (!success || (value > rows || value > cols)) {
          console.log(errormsg3)
          success = !success
        }
      }
    }
  } while (!success)

  return value
}

function setupBoard () {
  for (let i = 0; i < rows; i++) {
    let data = []
    for (let j = 0; j < cols; j++) {
      data.push('   ')
    }
    gameBoard.push(data)
  }
}

function printRowLine () {
  let line = '  '
  for (let c = 1; c <= cols; c++) {
    line += '--- '
  }
  console.log(line)
}

function printColHeads () {
  let heads = '  '
  for (let c = 1; c <= cols; c++) {
    heads += ' ' + c + '  '
  }
  console.log(heads)
}

function printBoard () {
  console.log('tulosta taulukko: for-silmukka')
  printColHeads()
  printRowLine()
  let output = '1 |'
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (j === 0) {
        output = (i + 1) + '|'
      }
      output += gameBoard[i][j] + '|'
    }
    console.log(output)
    printRowLine()
  }
}

function playGame () {
  console.log('######### Game Begins #########')
  // Arvotaan aloittaja
  turn = Math.floor(Math.random() * 2)
  console.log(turn)
  if (turn === 0) {
    console.log(players[0] + ' starts')
  } else { // if (turn === 1)
    console.log(players[1] + ' starts')
  }
  printBoard()

  while (!gameOver) {
    turnCount++
    askPosition()
    updateBoard(turn, nextPosition)
    if (turn === 0) {
      turn = 1
    } else {
      turn = 0
    }
    gameOver = checkWin()
    printBoard()
  }
}

function askPosition () {
  nextPosition[0] = parseInt(ask('position', players[turn] + ': give column number [0 - ' + cols + ']', '', '', '', '^[0-9]{1}$'))
  nextPosition[1] = parseInt(ask('position', players[turn] + ': give row number [0 - ' + rows + ']', '', '', '', '^[0-9]{1}$'))
}
function updateBoard () {
  if (turn === 0) {
    mark = ' X '
  } else {
    mark = ' 0 '
  } 
  let rowToUpdate = gameBoard[nextPosition[1] - 1]
  rowToUpdate[nextPosition[0] - 1] = mark
}

function checkWin () {
  return false
}
main()
