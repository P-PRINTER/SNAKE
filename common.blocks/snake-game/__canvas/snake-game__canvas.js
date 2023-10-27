import mainLayerFunc from "./_layer/snake-game__canvas_layer_main.js";
import backLayerFunc from "./_layer/snake-game__canvas_layer_back.js";


const layerObj = {
	"main": mainLayerFunc,
	"back": backLayerFunc,
};

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


		const mod = canvas.className.split("_").at(-1);

		const canvasObj = new GameCanvas(canvas);
		canvasObj.setCanvasFunc( layerObj[mod] );

		const setTypeArr = canvasSorter(mod);
		for (let aSetType of setTypeArr) {
			container[aSetType].add(canvasObj);
		}
	}
}

function canvasSorter (modificator) {
	const arrResult = [];

	if (modificator === "main") {
		arrResult.push["bootstrap"];
		arrResult.push["repeatable"];
	} else if (modificator === "back") {
		arrResult.push["bootstrap"];
	}

	return arrResult;
}

class GameCanvas {
	constructor(canvas) {
		this._gameState = {
			ctx: canvas.getContext("2d"),
		};
	}

	observer () {
		this.canvasFunc(this._gameState);
	}

	setCanvasFunc (func) {
		this.canvasFunc = func;
	}

	canvasFunc () {}
}
