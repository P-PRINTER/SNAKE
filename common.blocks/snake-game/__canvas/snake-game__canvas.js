import mainLayerFunc from "./_layer/snake-game__canvas_layer_main.js";
import backLayerFunc from "./_layer/snake-game__canvas_layer_back.js";


const layerObj = {
	"main": mainLayerFunc,
	"back": backLayerFunc,
};

export default function (container) {

	const canvases = container.gameBlock.querySelectorAll(".snake-game__canvas");

	for (let canvas of canvases) {

		const mod = canvas.className.split("_").at(-1);

		const canvasObj = new GameCanvas(canvas);
		canvasObj.setCanvasFunc		( layerObj [mod]			);
		canvasObj.setCtxScaleParams	( container["scale"]		);
		canvasObj.setGameStatus		( container["gameStatus"]	);

		canvasObj.setWidth(container["scale"].width);
		canvasObj.setHeight(container["scale"].height);

		const typeOfSetArr = canvasSorter(mod);
		for (let aSetType of typeOfSetArr) {
			container[aSetType].add(canvasObj);
		}
	}
}

function canvasSorter (modificator) {
	const arrResult = [];

	if (modificator === "main") {
		arrResult.push("bootstrap");
		arrResult.push("repeatable");
	} else if (modificator === "back") {
		arrResult.push("bootstrap");
	}

	return arrResult;
}

class GameCanvas {
	constructor(canvas) {
		this._canvas = canvas;
		this._stateObj = {
			context: canvas.getContext("2d"),
			isBootstrapped: false,
			isAlive: true,
			cache: {},
			gameStatus: {},
			developMode: false,
		};
	}

	observer () {
		this.canvasFunc(this._stateObj);
	}

	canvasFunc (stateObj) {}
	setCanvasFunc (func) {
		this.canvasFunc = func;
	}

	setWidth (numValue) {
		this._canvas["width"] = numValue;
	}
	setHeight (numValue) {
		this._canvas["height"] = numValue;
	}
	setCtxScaleParams(obj) {
		this._stateObj["scaleParams"] = obj;
	}
	setGameStatus(obj) {
		this._stateObj["gameStatus"] = obj;
	}
}
