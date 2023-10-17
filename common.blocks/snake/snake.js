import Snake from "../../lib/snake/Snake.js";

function runFunc () {
	const snakeCanvas = document.querySelector(".snake");

	const cellSize = 40;

	let widthInCells	= 15;
	let heightInCells	= 15;

	const snake = new Snake(widthInCells, heightInCells);
	snake.setCellSize(cellSize);
	snake.run(snakeCanvas);
}

export default {
	run: runFunc,
}
