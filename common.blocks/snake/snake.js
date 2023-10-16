import Snake from "../../lib/snake/Snake.js";

function runFunc() {
	const snakeCanvas = document.querySelector(".snake");

	let width = 150;
	let height = 150;

	const snake = new Snake(width, height);
	snake.run(snakeCanvas);
}

export default {
	run: runFunc,
}
