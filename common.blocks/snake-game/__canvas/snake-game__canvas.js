import mainLayerFunc from "./_layer/snake-game__canvas_layer_main.js";
import backLayerFunc from "./_layer/snake-game__canvas_layer_back.js";


export default function (gameBlock, container, {
	widthInCells = 15,
	heightInCells = 15,
	cellSize = 10,
} = {}) {

	const canvases = gameBlock.querySelectorAll(".snake-game__canvas");

	for (let canvas of canvases) {

		let width = widthInCells * cellSize;
		let height = heightInCells * cellSize;

		canvas.width = width;
		canvas.height = height;

		
	}
}

class GameCanvas {
	constructor(canvas, canvasFunc) {
		const this.gameState = {
			ctx: canvas.getContext("2d");
			canvasFunc: canvasFunc,
		};
	}

	observer () {
		this.gameState["canvasFunc"]();
	}
}
