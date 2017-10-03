// index.js
var readlineSync = require('readline-sync')
var rows = 3
var cols = 3
var lineLength = 3
var gameBoard = []

function main () {
  setupGame()
}

function setupGame () {
  rows = ask('row', 'Give number of game board rows [3 or more]', 'Amount of rows must be at least 3"', '', '', '^[0-9]{1,}$')
  console.log(rows)
  cols = ask('col', 'Give number of game board columns  [3 or more]', 'Amount of columns must be at least 3"', '', '', '^[0-9]{1,}$')
  console.log(cols)
  lineLength = ask(lineLength, 'Give number of items need to win the game [3 or more]', 'Winning line length must be at least 3"', 'Winning line length cannot be shorter than 3', 'Winning line cannot be longer than rows or columns.', '^[0-9]{1,}$')
  console.log(lineLength)
  setupBoard()
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
      if (type === 'row' || type === cols) {
        if (!success || value < 3) {
          console.log(errormsg1)
          success = !success
        }
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
/*  console.log('alusta taulukko')
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      gameBoard[i][j].push('_')
    }
  }
*/
  for (let i = 0; i < rows; i++) {
    let data = []
    for (let j = 0; j < cols; j++) {
      data.push('_')
    }
    gameBoard.push(data)
  }
  console.log('tulosta taulukko: for-silmukka')
  let output = ''
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      output += gameBoard[i][j] + ' '
    }
    console.log(output)
    output = ''
  }

  /*  for (let i = 0; i < rows; i++) {
//    let data = []
    for (let j = 0; j < cols; j++) {
//      data.push('_')

    }
    gameBoard.push(data)
  }
  for (let x = 0; x < gameBoard; x++) {
    for (let item in gameBoard) {
      console.log(gameBoard[item])
    }
  }
*/
}

main()
