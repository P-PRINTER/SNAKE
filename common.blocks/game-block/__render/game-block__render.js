import mainLayerFunc from "./_layer/game-block__render_layer_main.js";
import backLayerFunc from "./_layer/game-block__render_layer_back.js";


export default function (container_obj) {

	const block 		= container_obj["gameDomBlock"];
	const graphicMap 	= container_obj["gameMap"];
	const renderConfig 	= container_obj["renderConfig"];
	
	const DomRenders = block.querySelectorAll(".game-block__render");
	const renderObjs = Array.from(DomRenders).map( renderBlock => {
		return loadRender(renderBlock, graphicMap, renderConfig);
	} );

	const renderContainer = {
		start (graphicMap, renderConfig, repeatTime) {
			
			this._timerId = setInterval( _ => {

				renderObjs.forEach( renderObj => {
					renderObj.render();
				} );

				if (this._isRepeatTimeChanged) {
					this._isRepeatTimeChanged = false;

					this.stop();
					this.start(graphicMap, renderConfig);
					return;
				}
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

	return renderContainer;
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
	renderObj.setRenderConfig	(renderConfig);
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
		this._canvasFunc(this._context, this._graphicMap, this._renderConfig);
	}

	setRenderFunc (func) {
		this._canvasFunc = func;
	}
	setGraphicMap (obj) {
		this._graphicMap = obj;
	}
	setRenderConfig	(obj) {
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
