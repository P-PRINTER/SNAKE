import mainLayerFunc from "./_layer/game-block__render_layer_main.js";
import backLayerFunc from "./_layer/game-block__render_layer_back.js";


export default function (graphicBlock) {
	console.log("render");
	const DomRenders = graphicBlock.querySelectorAll(".game-block__render");
	const renderObjs = DomRenders.map( renderBlock => {
		loadRender(renderBlock, graphicMap, renderConfig);
	} );

	const renderObj = {
		start (graphicMap, renderConfig, repeatTime) {

			this._timerId = setInterval( _ => {
				if (this._isRepeatTimeChanged) {
					this._isRepeatTimeChanged = false;

					this.stop();
					this.start(graphicMap, renderConfig);

					return;
				}

				renderObjs.forEach( renderObj => {
					renderObj.render();
				} );
			} , this._repeatTime);
		},
		stop () {
			clearInterval(this._timerId);
		},

		setRepeatTime (num) {
			this._repeatTime = num;
			this._isRepeatTimeChanged = true;
		}
	};

	return renderObj;
}

const layerObj = {
	"main": mainLayerFunc,
	"back": backLayerFunc,
};

function loadRender (block, graphicMap, renderConfig) {

	const renderObj = new GameRender(block);
	const mod = block.className.split("_").at(-1);

	renderObj.setRenderFunc		(layerObj[mod]);
	renderObj.setGraphicMap		(graphicMap);
	renderObj.serRenderConfig	(renderConfig);
	renderObj.buildCorrectWindowSize ();

	return renderObj;
}


class GameRender {
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext("2d");
	}

	_canvasFunc		= undefined;
	_graphicMap		= undefined;
	_renderConfig	= undefined;

	render () {
		this._canvasFunc(this._graphicMap, this._renderConfig);
	}

	setRenderFunc (func) {
		this._canvasFunc = func;
	}
	setGraphicMap (obj) {
		this._graphicMap = obj;
	}
	serRenderConfig	(obj) {
		this._renderConfig = obj;
	}

	buildCorrectWindowSize () {
		this._canvas["width"]	= this._renderConfig["width"];
		this._canvas["height"]	= this._renderConfig["height"];
	}
	setWindowWidth (numValue) {
		this._canvas["width"] = numValue;
	}
	setWindowHeight (numValue) {
		this._canvas["height"] = numValue;
	}
}
