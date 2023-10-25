import snakeCanvas from "./__canvas/snake-game__canvas.js";

function runFunc () {

	const refreshTime = 100;

	const cellSize = 20;

	let widthInCells	= 15;
	let heightInCells	= 15;

	const snakeGame = document.querySelector(".snake-game");
	snakeGame.style.width = widthInCells * cellSize + "px";
	snakeGame.style.height = heightInCells * cellSize + "px";

	snakeCanvas(snakeGame, widthInCells, heightInCells, cellSize);

	const gameContainer = {
		ctx: undefined;
	}

	setInterval( _ => nextFrame(gameContainer), refreshTime );
}

function nextFrame(container) {}

export default {
	run: runFunc,
}

