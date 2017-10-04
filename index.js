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
var mark = [' X ', ' O ']
var gameOver = false
var nextPosition = []

var time = 0
var start

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
      } else if (type === 'lineLength') {
        if (!success || (value < 3)) {
          console.log(errormsg2)
          success = !success
        } else if (!success || (value > rows || value > cols)) {
          console.log(errormsg3)
          success = !success
        }
      } else if (type === 'position_r') {
        if (value <= 0) {
          console.log(errormsg1)
          success = !success
        } else if (value > rows) {
          console.log(errormsg2)
          success = !success
        }
      } else if (type === 'position_c') {
        if (value <= 0) {
          console.log(errormsg1)
          success = !success
        } else if (value > cols) {
          console.log(errormsg2)
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
    if (rows < 10) {
      line += '--- '
    } else {
      if (c === 0) {
        line += '  ---'
      } else {
        line += ' ---'
      }
    }
  }

  console.log(line)
}

function printColHeads () {
  let heads = ''
  if (cols < 10) {
    heads = '  '
  } else {
    heads = '   '
  }

  for (let c = 1; c <= cols; c++) {
    if (c < 10) {
      heads += ' ' + c + '  '
    } else {
      heads += ' ' + c + ' '
    }
  }
  console.log(heads)
}

function printBoard () {
  printColHeads()
  printRowLine()
  let output = ''
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (j === 0) {
        if (rows < 10) {
          output = (i + 1) + '|'
        } else {
          if (i < 9) {
            output = (i + 1) + ' |'
          } else {
            output = (i + 1) + '|'
          }
        }
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
  let timerStarted = false

  while (!gameOver) {
    // start timer if 1-player game
    if (nbrPlayers === 1 && !timerStarted) {
      time = 0
      start = new Date().getTime()
      timerStarted = true
    }
    askPosition()
    updateBoard(turn, nextPosition)
    gameOver = checkWin()
    printBoard()

    if (!gameOver) {
      if (turn === 0) {
        turn = 1
      } else {
        turn = 0
      }
    }
  }
  console.log('******* WINNER: ' + players[turn] + '! ***********' )
  // print elapsed time if 1-player game
  if (nbrPlayers === 1) {
    let now = new Date().getTime()
    let elapsed = Math.floor((now - start) / 1000)
    let seconds = elapsed % 60
    console.log('Time: ' + Math.floor(elapsed / 60) + ' minutes ' + seconds + ' seconds')
    timerStarted = false
  }
}

function askPosition () {
  nextPosition[0] = parseInt(ask('position_r', players[turn] + '(' + mark[turn] + ')' + ': give column number [1 - ' + cols + ']', 'give column number [1 - ' + cols + ']', 'Row number cannot be bigger than ' + cols, '', '^[0-9]+$'))
  nextPosition[1] = parseInt(ask('position_c', players[turn] + '(' + mark[turn] + ')' + ': give row number [1 - ' + rows + ']', 'give number [1 - ' + rows + ']', 'Column number cannot be bigger than ' + cols, '', '^[0-9]+$'))
}
function updateBoard () {
  gameBoard[nextPosition[1] - 1][nextPosition[0] - 1] = mark[turn]

  // OR: let rowToUpdate = gameBoard[nextPosition[1] - 1]
  // rowToUpdate[nextPosition[0] - 1] = mark[turn]
}

function checkWin () {
  let foundLength = 0
  // check only the player who set the last item
  // try to find items on the rigjt side, then below and last diagonally
  for (let i = 0; i < rows; i++) {
    // console.log('i: '+i)
    for (let j = 0; j < cols; j++) {
      // console.log('j: '+j)
      if (gameBoard[i][j] === mark[turn]) {
        foundLength = 1
        // finding items on the right
        for (let w = j + 1; w < cols; w++) {
          if (gameBoard[i][w] === mark[turn]) {
            foundLength++
            if (foundLength >= lineLength) {
              return true
            }
          } else {
            w = cols
            foundLength = 1
          }
        }
        // finding items below
        for (let b = i + 1; b < rows; b++) {
          if (gameBoard[b][j] === mark[turn]) {
            foundLength++
            if (foundLength >= lineLength) {
              return true
            }
          } else {
            b = rows
            foundLength = 1
          }
        }
        // finding item diagonally left below
        let dly = j - 1
        for (let dlx = i + 1; dlx < rows && dly >= 0; dlx++) {
          if (gameBoard[dlx][dly] === mark[turn]) {
            foundLength++
            if (foundLength >= lineLength) {
              return true
            }
            dly--
          } else {
            dlx = rows
            dly = 0
            foundLength = 1
          }
        }

        // finding item diagonally right below
        let dry = j + 1
        for (let drx = i + 1; drx < rows && dry < cols; drx++) {
          if (gameBoard[drx][dry] === mark[turn]) {
            foundLength++
            if (foundLength >= lineLength) {
              return true
            }
            dry++
          } else {
            drx = rows
            dry = cols
            foundLength = 1
          }
        }
      }
    }
  }
  return false
}

main()
