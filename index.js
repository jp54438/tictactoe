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

/**
 * Called when game is started. Handles the the game lifecycle.
 */
function main () {
  setupGame()
  setupBoard()
  while (playGame()) {

  }
}

/**
 *  Makes needed setup for the build up game board. Asks the settings from the user  
 */
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
}

// TODO: add player input validation, and align other error messages + update JSDoc
/**
 * Helper function for setting values. Validates the data using RegEx and game board limitations
 * @param {String} type Setting type which is requested 
 * @param {Strig} question, which is asked from the user in command prompt  
 * @param {String} errormsg1, error message which is shown for the user if input value is too small 
 * @param {String} errormsg2, error message which is shown for the user if ijnput value is too big 
 * @param {*} errormsg3 
 * @param {*} reg 
 */
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

/**
 * Helper function to request user next move. Validates the input agaainst game rules and limitations. updates the nextPosition array.
 */
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
      } else if (!isFreePosition(gameBoard, [col, row])) {
        console.log('Position already played')
        success = !success
      }
    }
  } while (!success)

  nextPosition[0] = col
  nextPosition[1] = row
}
/**
 * Helper function for getting user input in game menu situations. 
 * @param {String} question to be asked from the user
 * @param {String} errormsg, error message which is shown for the user if input value is incorrect 
 * @param {String} reg, RegEx string for validating user input 
 */
function ask (question, errormsg, reg) {
  let regex = new RegExp(reg)
  let value = ''
  let success = false
  do {
    value = readlineSync.question(question + ': ')
    success = regex.test(value)
    if (!success) {
      console.log(errormsg)
    }
  } while (!success)

  return value
}

/**
 * Initializes game board array based on game settings. Fills the array cells with empty characters.
 */
function setupBoard () {
  gameBoard.length = 0
  for (let i = 0; i < rows; i++) {
    let data = []
    for (let j = 0; j < cols; j++) {
      data.push(STR_EMPTY)
    }
    gameBoard.push(data)
  }
}

/**
 * Print out separator line for the game board rows
 */
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

/**
 * Print out column head numbers
 */
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

/**
 * Print out game board with current game situation
 */
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

/**
 * Main Game play function.  
 */
function playGame () {
  console.log('######### Game Begins #########')
  // Arvotaan aloittaja
  turn = Math.floor(Math.random() * 2)
  console.log(players[turn] + ' starts')
  printBoard()
  let timerStarted = false
  let isDraw = false

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
    isDraw = !freeCellsInBoard()
    if (isDraw) {
      gameOver = true
    }
    printBoard()

    if (!gameOver) {
      if (turn === 0) {
        turn = 1
      } else {
        turn = 0
      }
    }
  }
  if (!isDraw) {
    console.log('******* WINNER: ' + players[turn] + '! ***********' )
  // print elapsed time if 1-player game
  } else {
    console.log('******* DRAW! ***********')
  }
  if (nbrPlayers === 1) {
    let elapsed = Math.floor((new Date().getTime() - startTime) / 1000)
    let seconds = elapsed % 60
    console.log('Time: ' + Math.floor(elapsed / 60) + ' minutes ' + seconds + ' seconds')
    timerStarted = false
  }
  if (ask('Play again? [Y / N]', 'Incorrect input, please select Y or N', '^[Y]|[N]{1}$') === 'Y') {
    gameOver = false
    setupBoard()
    return true
  } else {
    return false
  }
}

/**
 * Makes random selection for the next move
 */
function makeSelection () {
  let success = false
  do {
    nextPosition[0] = Math.floor(Math.random() * cols) + 1
    nextPosition[1] = Math.floor(Math.random() * rows) + 1
    success = isFreePosition(gameBoard, nextPosition)
  } while (!success)
  console.log('Computer (' + mark[turn] + ') selected: ' + nextPosition[0] + ' ' + nextPosition[1])
}

/**
 * Checks if the @board array includes other than @STR_EMPTY character in given postion. 
 * @return true if @STR_EMPTY is not fund from the given position, otherwise returns false.
 * 
 * @param {Array} board, 2D array 
 * @param {Array} position, Array containing x and y coordinates of the position from where the to check whether it is free or not. 
 */
function isFreePosition (board, position) {
  if (board[position[1] - 1][position[0] - 1] === STR_EMPTY) {
    return true
  } else {
    return false
  }
}

/**
 * Checks if there are free cells in the gameboard. Returns true if there is at least one free cell.
 */
function freeCellsInBoard () {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gameBoard[i][j] === STR_EMPTY) {
        return true
      }
    }
  }
  return false
}

/**
 * Upadtes the game board with the current nextPosition value and sets player mark of the current turn.
 */
function updateBoard () {
  gameBoard[nextPosition[1] - 1][nextPosition[0] - 1] = mark[turn]

  // OR: let rowToUpdate = gameBoard[nextPosition[1] - 1]
  // rowToUpdate[nextPosition[0] - 1] = mark[turn]
}

/**
 * Checks if the player in turn has won the game. Finds the needed line lentgh horizontally, vertically and diagonically.
 * @return true if the needed line lentgh found, otherwise returns false.
 */
function checkWin () {
  let foundLength = 0
  // check only the player who set the last item
  // try to find items on the rigjt side, then below and last diagonally
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
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
          }
        }
        foundLength = 1
        // finding items below
        for (let b = i + 1; b < rows; b++) {
          if (gameBoard[b][j] === mark[turn]) {
            foundLength++
            if (foundLength >= lineLength) {
              return true
            }
          } else {
            b = rows
          }
        }
        foundLength = 1
        // finding item diagonally left below
        let dly = j - 1
        for (let dlx = i + 1; dlx < rows && dly >= 0; dlx++) {
          if (gameBoard[dlx][dly] === mark[turn]) {
            foundLength++
            if (foundLength >= lineLength) {
              return true
            }
          } else {
            dlx = rows
            dly = -1
          }
          dly--
        }
        foundLength = 1
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
          }
        }
        foundLength = 1
      }
    }
  }
  return false
}

/**
 * Starts the game by calling Main function
 */
main()
