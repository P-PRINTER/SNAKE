import snakeCanvas from "./__canvas/snake-game__canvas.js";

function runFunc () {

	const cellSize = 40;

	let widthInCells	= 15;
	let heightInCells	= 15;

	const snakeGame = document.querySelector(".snake-game");
	snakeGame.style.width = widthInCells * cellSize + "px";

	snakeCanvas(snakeGame, cellSize, widthInCells, heightInCells)
}

export default {
	run: runFunc,
}

