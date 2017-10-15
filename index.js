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
var nextPosition = []
var startTime
var computer = false
var computerAI = 0
var highScores

const STR_COMPUTER = 'computer'
const STR_EMPTY = '   '
const STR_INCORRECT = 'incorrect input'
const INT_EASY = 0
const INT_MEDIUM = 1
const INT_HARD = 2
/**
 * Called when game is started. Handles the the game lifecycle.
 */
function main () {
  mainMenu()
}

/**
 * TBD: Print out high scores
*/
function showHighScore () {
  console.log('----- To be done: High Score table ------')
  for (let item in highScores) {
    console.log('Time: ' + highScores[item].time, highScores[item].size, highScores[item].name)
  }
}

/**
 * TBD: Adds new high score to @highScores if the parameter values is new high score
 * @param {number} time, time taken to win the game 
 * @param {String} size, size of the gameboeard (width x height), for example '5 x 5'   
 * @param {String} name, name of the player 
 * 
 * @return true, if new high score was added, otherwise returns false.
 */
function addHighScore (time, size, name) {
  return true
}
/**
 * Shows main menu of the game. Strats the corresponding activity based on user's input.
 */
function mainMenu () {
  let quit = false
  do {
    let value = ask('Select:\n [S] Start New Game \n [H] High Score\n [Q] Quit\n', '', '^[S]|[s]|[H]|[h]|[Q]|[q]{1}$')
    if (value === 'S' || value === 's') {
      setupGame()
      setupBoard()
      while (playGame()) {
      }
    } else if (value === 'H' || value === 'h') {
      showHighScore()
    } else if (value === 'Q' || value === 'q') {
      quit = true
      console.log('Good bye!')
    }
  } while (!quit)
}

/**
 *  Makes needed setup for the build up game board. Asks the settings from the user.
 */
function setupGame () {
  rows = parseInt(askSettings('Give number of game board rows [3 or more]', '3', '', '', 'Amount of rows must be at least 3', '', '^[0-9]{1,}$'))
  cols = parseInt(askSettings('Give number of game board columns  [3 or more]', '3', '', '', 'Amount of columns must be at least 3', '', '^[0-9]{1,}$'))
  lineLength = parseInt(askSettings('Give number of items needed to win the game [3 or more]', '3', [cols.toString(), rows.toString()], '', 'Winning line length cannot be shorter than 3', 'Winning line cannot be longer than rows or columns', '^[0-9]{1,}$'))
  nbrPlayers = parseInt(askSettings('How many players [1 or 2]?', '1', '2', 'Select 1 or 2', '', '', '^[1-2]{1}$'))
  players[0] = askSettings('Name of the Player 1 [alphabets only]', 'Name must contain alphabets only', '1', '', '', '', '^[A-z]{1,}$')
  if (nbrPlayers === 2) {
    players[1] = askSettings('Name of the Player 2 [alphabets only]', 'Name must contain alphabets only', '1', '', '', '', '^[A-z]{1,}$')
    computer = false
  } else {
    players[1] = STR_COMPUTER
    computer = true
    computerAI = parseInt(askSettings('Computer AI level [0 - 2]?', '0', '2', '', 'Please select value 0, 1, or 2', '', '^[0-2]{1}$'))
  }
}

/**
 * Helper function for setting values. Validates the data using RegEx and game board limitations. 
 * @param {String} A question, which is asked from the user in command prompt.  
 * @param {String} Optional minimum value, for additional validation after RegEx (reg argument) check.
 * @param {Array} Optional array of maximum values, for additional validation after RegEx (reg argument) check.
 * @param {String} errormsg1, error message which is shown for the user if input is incorrect format. Default value: @STR_INCORRECT. 
 * @param {String} errormsg2, error message which is shown for the user if input value is too small (min atribute needed). Default value: @STR_INCORRECT.
 * @param {String} errormsg3, error message which is shown for the user if input value is too big (max atribute(s) needed). Default value: @STR_INCORRECT. 
 * @param {String} reg, RegEx string for validating user input.
 * 
 * @return User input as String.
 */
function askSettings (question, min, max, errormsg1, errormsg2, errormsg3, reg) {
  let regex = new RegExp(reg)
  let value = ''
  let success = false
  let msg1 = errormsg1
  let msg2 = errormsg2
  let msg3 = errormsg3

  if (msg1.length === 0) {
    msg1 = STR_INCORRECT
  }
  if (msg2.length === 0) {
    msg2 = STR_INCORRECT
  }

  if (msg3.length === 0) {
    msg3 = STR_INCORRECT
  }

  do {
    value = readlineSync.question(question + ': ')
    success = regex.test(value)
    if (!success) {
      console.log(msg1)
    } else {
      // Checking that value is not smaller than min
      if (parseInt(value) < parseInt(min)) {
        console.log(msg2)
        success = false
      } else {
        for (let item in max) {
          if (parseInt(value) > parseInt(max[item])) {
            console.log(msg3)
            success = false
            break
          }
        }
      }
    }
  } while (!success)

  return value
}

/**
 * Helper function to request user next move. Validates the input against game rules and limitations. Updates the nextPosition array.
 */
function askPosition () {
  let question = players[turn] + ' (' + mark[turn] + ')' + ': give next position [column number (0 - ' + (cols - 1) + ')  row number (0 - ' + (rows - 1) + ')], for example: 2 3)'
  let regex = new RegExp('^[0-9]+ [0-9]+$')
  let value = ''
  let success = false
  let col
  let row
  do {
    value = readlineSync.question(question + ': ')
    success = regex.test(value)
    if (!success) {
      console.log(STR_INCORRECT)
    } else {
      col = value.split(' ')[0]
      row = value.split(' ')[1]
      if (col < 0 || row < 0) {
        console.log('Value must be 0 or bigger')
        success = !success
      } else if (col > cols - 1) {
        console.log('Column value cannot be bigger than ' + (cols - 1))
        success = !success
      } else if (row > rows - 1) {
        console.log('Row value cannot be bigger than ' + (rows - 1))
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
 * Helper function for getting user input in game menu. 
 * @param {String} question to be asked from the user.
 * @param {String} errormsg, error message which is shown for the user if input value is incorrect. Defaul value @STR_INCORRECT.
 * @param {String} reg, RegEx string for validating user input.
 */
function ask (question, errormsg, reg) {
  let regex = new RegExp(reg)
  let value = ''
  let success = false
  if (errormsg.length === 0) {
    errormsg = STR_INCORRECT
  }

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
 * Print out separator line for the game board rows.
 */
function printRowLine () {
  let line = '  '
  for (let c = 0; c < cols; c++) {
    if (rows <= 10) {
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
  if (cols <= 10) {
    heads = '  '
  } else {
    heads = '   '
  }

  for (let c = 0; c < cols; c++) {
    if (c <= 10) {
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
        if (rows <= 10) {
          output = i + '|'
        } else {
          if (i < 10) {
            output = i + ' |'
          } else {
            output = i + '|'
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
  let gameOver = false
  let timerStarted = false
  let isDraw = false
  console.log(`###############################
######### Game Begins #########
###############################`)
  // Random the first turn
  turn = Math.floor(Math.random() * 2)
  console.log(players[turn] + ' (' + mark[turn] + ') starts')
  printBoard()

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
    console.log(players[turn] + ' (' + mark[turn] + ') played: ' + nextPosition[0] + ' ' + nextPosition[1])
    updateBoard(turn, nextPosition)

    gameOver = checkLineLenght(lineLength, 0, 0, mark[turn])[0][0]
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
    console.log('******* WINNER: ' + players[turn] + '! ***********')
  } else {
    console.log('******* DRAW! ***********')
  }
  if (nbrPlayers === 1) {
    let elapsed = Math.floor((new Date().getTime() - startTime) / 1000)
    let seconds = elapsed % 60
    console.log('Time: ' + Math.floor(elapsed / 60) + ' minutes ' + seconds + ' seconds')
    if (computer && players[turn] !== STR_COMPUTER) {
      let isNewHighScore = addHighScore(elapsed, rows + 'x' + cols, players[turn])

      if (isNewHighScore) {
        console.log('New high Score!')
      }
    }
    timerStarted = false
  }
  let newGame = ask('Play again? [Y / N]', 'Incorrect input, please select Y or N', '^[Y]|[y]|[N]|[n]{1}$')
  if (newGame === 'Y' || newGame === 'y') {
    setupBoard()
    return true
  } else {
    return false
  }
}

/**
 * Makes selection for the computer based on the computerAI level.
 */
function makeSelection () {
  if (computerAI === INT_EASY) {
    randomNextPosition()
  } else if (computerAI === INT_MEDIUM) {
    let nextPos = [false]
    for (let findLength = lineLength - 1; findLength > 1 && nextPos[0] === false; findLength--) {
      nextPos = playBasedOnPlayer(findLength)
    }
    if (nextPos[0] === true) {
      playNext(nextPos[1], nextPos[2])
    } else {
      randomNextPosition()
    }
  } else if (computerAI === INT_HARD) { // INT_HARD
    let nextPos = [false]
    for (let findLength = lineLength - 1; findLength > 0 && nextPos[0] === false; findLength--) {
      nextPos = playBasedOnPlayer(findLength)
    }
    if (nextPos[0] === true) {
      playNext(nextPos[1], nextPos[2])
    } else {
      randomNextPosition()
    }
  } else {
    randomNextPosition()
  }
}

/**
 * Upadtes nextPosition Array by the values that should be played next
 * @param {String} posR is row in the game board 
 * @param {String} posC is column in the gameboard  
 */
function playNext (posR, posC) {
  nextPosition[0] = posC
  nextPosition[1] = posR
}

/**
 * Randomizes next position in the game board 
 */
function randomNextPosition () {
  let success = false
  do {
    nextPosition[0] = Math.floor(Math.random() * cols)
    nextPosition[1] = Math.floor(Math.random() * rows)
    success = isFreePosition(gameBoard, nextPosition)
  } while (!success)
}

/**
 * Helper function for the computer turn to find next position to play.
 * @param {Number} neededLength is minimum length of player's marks adjacent in the gameboard  
 */
function playBasedOnPlayer (neededLength) {
  let startX = 0
  let startY = 0
  let playerMark

  if (turn === 1) {
    playerMark = mark[0]
  } else {  
    playerMark = mark[1]
  }
  let positions = checkLineLenght(neededLength, startX, startY, playerMark)

  for (let pos in positions) {
    if (positions[pos][0] === true) {
      let beginning = isBeginningfree(positions[pos])
      if (beginning[0]) {
        return beginning
      }
      let end = isEndFree(positions[pos], neededLength)
      if (end[0]) {
        return end
      }
    }
  }

  return [false, -1, -1, '']
}

/**
 * Helper function to check is it possible to play mark to a place which is before the @pos
 * @param {Array} pos, the position from where to check.
 *
 * @return array including information where to play before the @pos location. 
 * Format is: [(boolean)true/false, (String) row position, (String) column position, (String) direction to play] , e.g. [true, '2', '3', 'b'].
 * If not possible to play, returns array [false, -1, -1, ''].
 */
function isBeginningfree (pos) {
  let positionToCheck = [0, 0]
  let retPos = pos
  if (pos[3] === 'r') {
    positionToCheck[0] = pos[2] - 1
    positionToCheck[1] = pos[1]
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2] - 1
      retPos[1] = pos[1]
      return retPos
    }
  } else if (pos[3] === 'b') {
    positionToCheck[0] = pos[2]
    positionToCheck[1] = pos[1] - 1
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2]
      retPos[1] = pos[1] - 1
      return retPos
    }
  } else if (pos[3] === 'dl') {
    positionToCheck[0] = pos[2] + 1
    positionToCheck[1] = pos[1] - 1
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2] + 1
      retPos[1] = pos[1] - 1
      return retPos
    }
  } else if (pos[3] === 'dr') {
    positionToCheck[0] = pos[2] - 1
    positionToCheck[1] = pos[1] - 1
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2] - 1
      retPos[1] = pos[1] - 1
      return retPos
    }
  }
  return [false, -1, -1, '']
}

/**
* Helper function to check is it possible to play mark to a place which is at the end of the played marks adjacent.
* @param {Array} pos, the position from where to check.
* @param {Number} lineL, the length of the line which is searched for.
* @return array including information where to play. 
* Format is: [(boolean)true/false, (String) row position, (String) column position, (String) direction to play: r/b/dl/dr] , e.g. [true, '2', '3', 'b'].
* If not possible to play, returns array [false, -1, -1, ''].
*/
function isEndFree (pos, lineL) {
  let positionToCheck = [0, 0]
  let retPos = pos
  if (pos[3] === 'r') {
    positionToCheck[0] = pos[2] + lineL
    positionToCheck[1] = pos[1]
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2] + lineL
      retPos[1] = pos[1]
      return retPos
    }
  } else if (pos[3] === 'b') {
    positionToCheck[0] = pos[2]
    positionToCheck[1] = pos[1] + lineL
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2]
      retPos[1] = pos[1] + lineL
      return retPos
    }
  } else if (pos[3] === 'dl') {
    positionToCheck[0] = pos[2] - lineL
    positionToCheck[1] = pos[1] + lineL
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2] - lineL
      retPos[1] = pos[1] + lineL
      return retPos
    }
  } else if (pos[3] === 'dr') {
    positionToCheck[0] = pos[2] + lineL
    positionToCheck[1] = pos[1] + lineL
    if (isFreePosition(gameBoard, positionToCheck)) {
      retPos[2] = pos[2] + lineL
      retPos[1] = pos[1] + lineL
      return retPos
    }
  }

  retPos = [false, -1, -1, '']
  return retPos
}

/**
 * Checks if the @board array includes other than @STR_EMPTY character in given postion. 
 * @return true if @STR_EMPTY is not fund from the given position, otherwise returns false.
 * 
 * @param {Array} board, 2D array 
 * @param {Array} position, Array containing x and y coordinates of the position from where the to check whether it is free or not. 
 */
function isFreePosition (board, position) {
  if (position[0] < 0 || position[1] < 0 || position[0] > cols - 1 || position[1] > rows - 1) {
    return false
  }

  if (board[position[1]][position[0]] === STR_EMPTY) {
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
  gameBoard[nextPosition[1]][nextPosition[0]] = mark[turn]
}

/**
 * searches lineLen length of adjacent marks in line in the game board. Finds the needed line lentgh horizontally, vertically and diagonically.
 * @param {Number} lineLen, the lenght of the adjacent marks to find
 * @param {Number} game board column from where to start searching
 * @param {Number} game board row from where to start searching
 * @param {String} playMark, a string which is searched 
 * @return an array of information of all found lines.
 * Format of one item in the return array is: 
 * [(boolean)true/false, (String) row position, (String) column position, (String) direction to play: r/b/dl/dr] , e.g. [true, '2', '3', 'b']
 * r = to right direction
 * b = to bottom direction
 * dl = diagonal left bottom direction
 * dr = diagonal right bottom direction
 * If no lines found, returns array including item [false, -1, -1, ''].
 */
function checkLineLenght (lineLen, startJ, startI, playMark) {
  let foundLength = 0
  let returnArray = []
  // check only the player who set the last item
  // try to find items on the right side, then below and last diagonally
  for (let i = startI; i < rows; i++) {
    for (let j = startJ; j < cols; j++) {
      if (gameBoard[i][j] === playMark) {
        foundLength = 1
        if (lineLen === 1) {
          returnArray.push([true, i, j, 'r'])
        } else {
          // finding items on the right
          for (let r = j + 1; r < cols; r++) {
            if (gameBoard[i][r] === playMark) {
              foundLength++
              if (foundLength >= lineLen) {
                returnArray.push([true, i, j, 'r'])
              }
            } else {
              r = cols
            }
          }
          foundLength = 1
          // finding items below
          for (let b = i + 1; b < rows; b++) {
            if (gameBoard[b][j] === playMark) {
              foundLength++
              if (foundLength >= lineLen) {
                returnArray.push([true, i, j, 'b'])
              }
            } else {
              b = rows
            }
          }
          foundLength = 1
          // finding item diagonally left below
          let dly = j - 1
          for (let dlx = i + 1; dlx < rows && dly >= 0; dlx++) {
            if (gameBoard[dlx][dly] === playMark) {
              foundLength++
              if (foundLength >= lineLen) {
                returnArray.push([true, i, j, 'dl'])
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
            if (gameBoard[drx][dry] === playMark) {
              foundLength++
              if (foundLength >= lineLen) {
                returnArray.push([true, i, j, 'dr'])
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
  }
  if (returnArray.length === 0) {
    returnArray.push([false, -1, -1, ''])
  }
  return returnArray
}

/**
 * Starts the game by calling Main function
 */
main()
