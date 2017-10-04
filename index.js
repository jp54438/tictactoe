// index.js
var readlineSync = require('readline-sync')
var rows = 3
var cols = 3
var lineLength = 3
var gameBoard = []
var players = [2]
var nbrPlayers = 1
var turn = 1
const mark = [' X ', ' O ']
var gameOver = false
var nextPosition = []
var startTime
var computer = false
const STR_COMPUTER = 'computer'
const STR_EMPTY = '   '

function main () {
  setupGame()
}

function setupGame () {
  rows = parseInt(askSettings('row', 'Give number of game board rows [3 or more]', 'Amount of rows must be at least 3"', '', '', '^[0-9]{1,}$'))
  console.log(rows)
  cols = parseInt(askSettings('col', 'Give number of game board columns  [3 or more]', 'Amount of columns must be at least 3"', '', '', '^[0-9]{1,}$'))
  console.log(cols)
  lineLength = parseInt(askSettings('lineLength', 'Give number of items need to win the game [3 or more]', 'Winning line length must be at least 3"', 'Winning line length cannot be shorter than 3', 'Winning line cannot be longer than rows or columns.', '^[0-9]{1,}$'))
  nbrPlayers = parseInt(askSettings('nbrPlayers', 'How many players [1 or 2]?', 'Select 1 or 2', '', '', '^[1-2]{1}$'))
  players[0] = askSettings('player1', 'Name of the Player 1 [min. 2 chars]', 'Name must contain alphabets only', '', '', '^[A-z]{2,}$')
  if (nbrPlayers === 2) {
    players[1] = askSettings('player2', 'Name of the Player 2 [min. 2 chars]', 'Name must contain alphabets only', '', '', '^[A-z]{2,}$')
  } else {
    players[1] = STR_COMPUTER
    computer = true
  }
  setupBoard()
  playGame()
}

function askSettings (type, question, errormsg1, errormsg2, errormsg3, reg) {
  let regex = new RegExp(reg)
  let value = ''
  let success = false
  do {
    value = readlineSync.question(question + ': ')
    success = regex.test(value)
    if (!success) {
      console.log('incorrect input')
    } else {
      // Checking that amount of rows and cols are correct
      if (type === 'row' || type === 'col') {
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
      }
    }
  } while (!success)

  return value
}

function askPosition () {
  let question = players[turn] + ' (' + mark[turn] + ')' + ': give next position [column number (1 - ' + cols + ')  row number (1 - ' + rows + ')], for example: 2 3)'
  let regex = new RegExp('^[0-9]+ [0-9]+$')
  let value = ''
  let success = false
  let col
  let row
  do {
    value = readlineSync.question(question + ': ')
    success = regex.test(value)
    if (!success) {
      console.log('incorrect input')
    } else {
      col = value.split(' ')[0]
      row = value.split(' ')[1]
      if (col <= 0 || row <= 0) {
        console.log('Value must be bigger than 0')
        success = !success
      } else if (col > cols) {
        console.log('Column value cannot be bigger than amount of columns' )
        success = !success
      } else if (row > rows) {
        console.log('Row value cannot be bigger than amount of rows' )
        success = !success
      } else if (!isFreePosition(gameBoard, [row, col])) {
        console.log('Position already played')
        success = !success
      }
    }
  } while (!success)

  nextPosition[0] = col
  nextPosition[1] = row
}

function setupBoard () {
  for (let i = 0; i < rows; i++) {
    let data = []
    for (let j = 0; j < cols; j++) {
      data.push(STR_EMPTY)
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
  console.log(players[turn] + ' starts')
  printBoard()
  let timerStarted = false

  while (!gameOver) {
    // start timer if 1-player game
    if (nbrPlayers === 1 && !timerStarted) {
      startTime = new Date().getTime()
      timerStarted = true
    }
    if (computer && players[turn] === STR_COMPUTER) {
      makeSelection()
    } else {
      askPosition()
    }
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
    let elapsed = Math.floor((new Date().getTime() - startTime) / 1000)
    let seconds = elapsed % 60
    console.log('Time: ' + Math.floor(elapsed / 60) + ' minutes ' + seconds + ' seconds')
    timerStarted = false
  }
}

function makeSelection () {
  let success = false
  do {
    nextPosition[0] = Math.floor(Math.random() * cols) + 1
    nextPosition[1] = Math.floor(Math.random() * rows) + 1
    success = isFreePosition(gameBoard, nextPosition)
  } while (!success)
  console.log('Computer selected: ' + nextPosition[0] + ' ' + nextPosition[1])
}

function isFreePosition (board, position) {
  if (board[position[1] - 1][position[0] - 1] === STR_EMPTY) {
    return true
  } else {
    return false
  }
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
