// @ts-nocheck

//	You can search my edits using the keyword @kapthang throughout this javascript file
//
// ##############################################################################################
//	start - @kapthang
// ##############################################################################################
//	LOGIC OF AI 1
//
//	AI 1 will scan for all empty spots, then place them into an array, then a random index number
//	of that array is choosen for the AI 1's new move. This does not calculate for win conditions.
//
//
//
//	LOGIC OF AI 2
//
//	AI 2 scans the same empty spots as AI 1 and scan for the win conditions of each of those
//  empty spots in the array, each spot is scanned horizontally, vertically and diagonally (if needed)
//	if the scanning sign is found, a weight of 1 is given, which then are all added up and the 
//	empty spot with the highest weight becomes the AI 2's next move
//		
//	This logic only accounts for the AI 2's winning moves and discard the player's winning moves to
//	simplify the algorithm. It's possible to scan the player's winning move to prevent player from
//	winning with his next move if AI detects it but that may cause a never ending game.
//

// dynamically set URL paths in meta tags
document.querySelector('meta[property="og:url"]').setAttribute('content', location.href)
document.querySelector('meta[property="twitter:url"]').setAttribute('content', location.href)

const ROW = 3;
const COL = 3;

let gameMode;
let lastMovedSpot;
let flag = 1;
let moveCounter = 0


// ##############################################################################################
// start	jQuery functions
// ##############################################################################################

$(document).ready(() => {
	
	// play in PvP mode
	$("button").click((e) => {

		if (e.target.id !== 'pvp' && e.target.id !== 'ai1' && e.target.id !== 'ai2') return

		// set game mode to pvp
		gameMode = e.target.id

		let gameTitle;

		// set game mode title
		switch (gameMode) {
			case 'pvp': gameTitle = 'PvP Mode'; break;
			case 'ai1': gameTitle = 'vs AI Level 1'; 
						$('#secondplayer').text('AI-1'); break;
			case 'ai2': gameTitle = 'vs AI Level 2';
						$('#secondplayer').text('AI-2'); break;
			default: gameTitle = 'PvP Mode';
		}
		$('#gameMode').text(gameTitle)

		$("#menu").toggle();
		$("#thegame").fadeToggle('slow');
	})

	// handle click on spots
	$('input').click((e) => {
		makeMove(e.target.id)
	})

	// reset game
	$('.resetgame').click(() => {
		resetGame()
	})


	// back to menu
	$('.backtomenu').click(() => {
		if (confirmGameExit()) {
			// reset the game
			resetGame()

			$("#thegame").toggle();
			$("#menu").fadeToggle('slow');
		}
	})
})

// ##############################################################################################
// end		jQuery functions
// ##############################################################################################






// ##############################################################################################
// start	Utility functions
// ##############################################################################################

const isOdd = currentSpot => currentSpot % 2 ? true :false

const isEven = currentSpot => currentSpot % 2 ? false :true

const disableSpots = (emptySpots) => { for (let i = 0; i < emptySpots.length; i++) document.getElementById(`b${emptySpots[i]}`).disabled = true }

const enableSpots = () => { for (let i = 1; i <= ROW*COL; i++) document.getElementById(`b${i}`).disabled = false }

const resetSpots = () => { for (let i = 1; i <= ROW*COL; i++) document.getElementById(`b${i}`).value = '' }

const getRandomBox = emptySpots => emptySpots[Math.floor(Math.random() * emptySpots.length)]

const updateTurnDisplay = () => { document.getElementById('print').innerHTML = `Player ${(flag == 1) ? 'X':'0'} Turn` }

const confirmGameExit = () => {
	return confirm('Are you sure you want to exit the current game and go to main menu?')
}

const getAllEmptySpots = () => {
	let emptySpots = [];

	for (let i = 1; i <= 9; i++) {
		if (document.getElementById(`b${i}`).value.length === 0) { 
			emptySpots.push(i)
		}
	}

	return emptySpots
}

const getCenterNumber = () => {

	let sumOdds = 0
	const oddsArray = []

	for (let i = 1; i <= ROW*COL; i++) {
		if (isOdd(i)) { 
			sumOdds++
			oddsArray.push(i)
		}
	}

	return oddsArray[Math.round(sumOdds/2)-1]
}

const announceWin = (sign) => {
	document.getElementById('print').innerHTML = `Player ${sign} won`;
		disableSpots(getAllEmptySpots());
		window.alert(`Player ${sign} won`);
		return
}


const placeSignAt = (spotNumber) => {
	if (moveCounter >= ROW*COL) return
	document.getElementById(spotNumber).value = (flag === 1) ? 'X' : '0'
	document.getElementById(spotNumber).disabled = true;
	flag = (flag === 1) ? 0 : 1
	checkWin()
}

// ##############################################################################################
// end	Utility functions
// ##############################################################################################






// ##############################################################################################
// start	Main functions
// ##############################################################################################

// Function called whenever user tab on any box
const checkWin = () => {

	const lastsign = (flag === 0) ? 'X' : '0'		// reversed because we're looking for previous sign
	

	for (let i = 0; i < 4; i++) {

		const check = [
			{start: 1, inc: 1, next: COL},			// horizontal
			{start: 1, inc: COL, next: 1},			// vertical
			{start: COL, inc: COL - 1, next: 0},	// positive slope diag
			{start: 1, inc: COL + 1, next: 0}		// negative slope diag
		]		
		 
		if (check[i].next > 0) {
			for (let j = 0; j < COL; j++,  check[i].start += check[i].next) {
	
				let winCounter = 0
				if (document.getElementById(`b${check[i].start}`).value === lastsign) winCounter++
				if (document.getElementById(`b${check[i].start + check[i].inc}`).value === lastsign) winCounter++
				if (document.getElementById(`b${check[i].start + check[i].inc * 2}`).value === lastsign) winCounter++
				if (winCounter === 3) announceWin(lastsign)
			}
			continue
		}

		let winCounter = 0
		for (let k = 0; k < COL; k++, check[i].start += check[i].inc) {
			if (document.getElementById(`b${check[i].start}`).value === lastsign) winCounter++
		}
		if (winCounter === 3) announceWin(lastsign)
	}

	if (moveCounter === ROW*COL) {
		document.getElementById('print').innerHTML = "Match Tie";
		disableSpots(getAllEmptySpots());
		window.alert('Match Tie');
		return
	}

	updateTurnDisplay();
}

const resetGame = () => {
	flag = 1
	moveCounter = 0
	gameMode = ''
	resetSpots()
	enableSpots()
	updateTurnDisplay();
}

const makeMove = (spotNumber) => {
	moveCounter++

	if (gameMode === 'pvp') {
		placeSignAt(spotNumber)
		return
	}

	placeSignAt(spotNumber)

	if (flag === 0) ai_makeMove(gameMode)
}

const ai_makeMove = (gameMode) => {

	const boxToMove = (gameMode === 'ai1') ? `b${getRandomBox(getAllEmptySpots())}` : (gameMode === 'ai2') ? `b${getAWinningSpotFor('0', getAllEmptySpots())}`  : null;

	if (boxToMove == null) return
	placeSignAt(boxToMove)
}

//	put a winning box b numbers into an array
const getAWinningSpotFor = (sign, emptySpots) => {
	let winningSpots = [];

	let maxSpot
	let maxSpotIndex

	// check for each empty spot
	for (let i = 0; i < emptySpots.length; i++) {

		const currentSpot = emptySpots[i]

		//	horizontal checks
		const hMax = getHorizontalResult(currentSpot, sign).weight || 0

		//	vertical checks
		const vMax = getVerticalResult(currentSpot, sign).weight || 0

		//	diagonal checks
		const dMax = isOdd(currentSpot) ? getDiagonalResult(currentSpot, sign).weight : 0

		const currentMax = hMax > vMax ? hMax > dMax ? hMax : dMax : vMax > dMax ? vMax : dMax

		if (maxSpot == null) {
			maxSpot = currentMax
			maxSpotIndex = currentSpot
			
		} else if (currentMax > maxSpot) {
			maxSpot = currentMax
			maxSpotIndex = currentSpot
		}
	}

	if (maxSpot === 0) {
		return getRandomBox(getAllEmptySpots())
	}

	return maxSpotIndex
}

const getHorizontalResult = (currentSpot, sign) => {

	let hMax = 0
	let winCounter = 0
	let startSpot

	if (currentSpot % 3 == 1) startSpot = currentSpot
	if (currentSpot % 3 == 2) startSpot = currentSpot - 1
	if (currentSpot % 3 == 0) startSpot = currentSpot - 2
	
	for (let i = 0; i < COL; i++, startSpot++) {
		if (document.getElementById(`b${startSpot}`).value === sign) {
			hMax++
			winCounter++
		}
	}
	
	return winCounter === COL ? {isWin: true, weight: hMax} : {isWin: false, weight: hMax}
}

const getVerticalResult = (currentSpot, sign) => {

	let vMax = 0
	let winCounter = 0
	let startSpot = Number(currentSpot)

	// find starting number
	while (startSpot > ROW) {
		startSpot -= 3
	}
	
	for (let i = 0; i < ROW; i++, startSpot+=ROW) {
		if (document.getElementById(`b${startSpot}`).value === sign) {
			vMax++
			winCounter++
		}
	}
	
	return winCounter === ROW ? {isWin: true, weight: vMax} : {isWin: false, weight: vMax}
}

const getDiagonalResult = (cSpot, sign) => {

	const currentSpot = Number(cSpot)
	

	if (isEven(currentSpot)) return {isWin: false, weight: 0}


	const centerNumber = getCenterNumber()

	console.log(centerNumber)
	
	const forward_diff_factor = ROW+1
	const backward_diff_factor = ROW-1

	let isForwardDiagonal = false
	let isBackwardDiagonal = false
	let dMax = 0

	// FORWARD DOWN_RIGHT CHECK
	if (currentSpot > centerNumber) {
		for (let i = centerNumber+forward_diff_factor; i <= ROW*COL; i+=forward_diff_factor) {
			if (i === currentSpot) isForwardDiagonal = true
		}
	}

	// FORWARD UP_LEFT CHECK
	if (currentSpot <= centerNumber) {
		for (let i = centerNumber-forward_diff_factor; i >= 0; i-=forward_diff_factor) {
			if (i === currentSpot) isForwardDiagonal = true
		}
	}

	if (isForwardDiagonal) {
		let winCounter = 0
		for (let i = 1; i <= ROW*COL; i+=forward_diff_factor) {
			if (document.getElementById(`b${i}`).value == sign) {
				dMax++
				winCounter++
			}
		}
		return winCounter === ROW ? {isWin: true, weight: dMax} : {isWin: false, weight: dMax}
	}


	// BACKWARD DOWN_LEFT CHECK
	if (currentSpot > centerNumber) {
		for (let i = centerNumber+backward_diff_factor; i <= ROW*COL; i+=backward_diff_factor) {
			if (i === currentSpot) isBackwardDiagonal = true
		}
	}

	// BACKWARD UP_RIGHT CHECK
	if (currentSpot < centerNumber) {
		for (let i = centerNumber-backward_diff_factor; i >= 0; i-=backward_diff_factor) {
			if (i === currentSpot) isBackwardDiagonal = true
		}
	}

	if (isBackwardDiagonal) {
		let winCounter = 0
		for (let i = COL; i <= ROW*COL; i+=backward_diff_factor) {
			if (document.getElementById(`b${i}`).value == sign)  {
				dMax++
				winCounter++
			}
		}
		return winCounter === ROW ? {isWin: true, weight: dMax} : {isWin: false, weight: dMax}
	}

	// BOTH DIRECTION CHECK
	if (currentSpot === centerNumber) {
		let winCounter = 0
		let backwardMax = 0
		let fordwardMax = 0
		

		// check backward first
		for (let i = COL; i <= ROW*COL; i+=backward_diff_factor) {
			if (document.getElementById(`b${i}`).value == sign)  {
				backwardMax++
				winCounter++
			}
		}

		if (winCounter === ROW) return {isWin: true, weight: backwardMax}

		// reset winCounter
		winCounter = 0

		// check forward now
		for (let i = 1; i <= ROW*COL; i+=forward_diff_factor) {
			if (document.getElementById(`b${i}`).value == sign) {
				fordwardMax++
				winCounter++
			}
		}

		if (winCounter === ROW) return {isWin: true, weight: fordwardMax}

		const finalMax = backwardMax > fordwardMax ? backwardMax : fordwardMax

		return {isWin: false, weight: finalMax}
	}
}

// ##############################################################################################
// end	Main functions
// ##############################################################################################