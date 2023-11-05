import mainLayerFunc from "./_layer/game-block__render_layer_main.js";
import backLayerFunc from "./_layer/game-block__render_layer_back.js";


const layerObj = {
	"main": mainLayerFunc,
	"back": backLayerFunc,
};

export default function (container) {

	const renders = container.gameBlock.querySelectorAll(".game-block__render");

	for (let render of renders) {

		const mod = render.className.split("_").at(-1);

		const renderObj = new GameRender(render);
		renderObj.setRenderFunc		( layerObj [mod]			);
		renderObj.setCtxScaleParams	( container["scale"]		);
		renderObj.setGameStatus		( container["gameStatus"]	);

		renderObj.setWidth(container["scale"].width);
		renderObj.setHeight(container["scale"].height);

		const typeOfSetArr = renderSorter(mod);
		for (let aSetType of typeOfSetArr) {
			container[aSetType].add(renderObj);
		}
	}
}

function renderSorter (modificator) {
	const arrResult = [];

	if (modificator === "main") {
		arrResult.push("bootstrap");
		arrResult.push("repeatable");
	} else if (modificator === "back") {
		arrResult.push("bootstrap");
	}

	return arrResult;
}

class GameRender {
	constructor(canvas) {
		this._canvas = canvas;
		this._stateObj = {
			context: canvas.getContext("2d"),
			isBootstrapped: false,
			cache: {},
			gameStatus: {},
			developMode: false,
		};
	}

	observer () {
		this.canvasFunc(this._stateObj);
	}

	renderFunc (stateObj) {}
	setRenderFunc (func) {
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
