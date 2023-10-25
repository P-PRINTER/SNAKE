import "./_layer/snake-game__canvas_layer_main.js";
import "./_layer/snake-game__canvas_layer_back.js";


export default function snakeCanvas (gameArea, widthInCells = 15, heightInCells = 15, cellSize = 10) {

	const canvases = gameArea.querySelectorAll(".snake-game__canvas");

	for (let canvas of canvases) {

		let width = widthInCells * cellSize;
		let height = heightInCells * cellSize;

		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		ctx.fillRect(width / 4, height / 4, width / 2, height / 2);
	}
}
