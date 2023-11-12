import mainLayerFunc from "./_layer/game-block__render_layer_main.js";
import backLayerFunc from "./_layer/game-block__render_layer_back.js";


const layerObj = {
	"main": mainLayerFunc,
	"back": backLayerFunc,
};

// changed
export default function (graphicBlock) {

	// renamed
	const DomRenders = graphicBlock.querySelectorAll(".game-block__render");
	// renamed and changed
	const renderObjs = DomRenders.map( renderBlock => {
		loadRender(renderBlock, graphicMap, renderConfig);
	} );

	const renderObj = {
		start (graphicMap, renderConfig, repeatTime = 42) {
			if (!this._repeatTime) this._repeatTime = repeatTime;

			this.timerId = setInterval( _ => {
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
			clearInterval(this.timerId);
		},

		setRepeatTime (num) {
			this._repeatTime = num;
			this._isRepeatTimeChanged = true;
		}
	};

	return renderObj;
}

// changed
function loadRender (block, graphicMap, renderConfig) {

	const renderObj = new GameRender(block);
	const mod = block.className.split("_").at(-1);

	renderObj.setRenderFunc		(layerObj[mod]);
	renderObj.setGraphicMap		(graphicMap);
	renderObj.serRenderConfig	(renderConfig);
	renderObj.buildCorrectWindowSize ();

	return renderObj;
}

// deleted renderSorter(modificator)


class GameRender {
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext("2d");
	}

	// deleted observer()
	// deleted renderFunc(stateObj)

	_canvasFunc		= undefined;
	_graphicMap		= undefined;
	_renderConfig	= undefined;

	// added render()
	render () {
		this._canvasFunc(this._graphicMap, this._renderConfig);
	}

	setRenderFunc (func) {
		this._canvasFunc = func;
	}
	// added
	setGraphicMap (obj) {
		this._graphicMap = obj;
	}
	// added
	serRenderConfig	(obj) {
		this._renderConfig = obj;
	}

	// added
	buildCorrectWindowSize () {
		this._canvas["width"]	= this._renderConfig["width"];
		this._canvas["height"]	= this._renderConfig["height"];
	}
	// renamed to setWindowWidth
	setWindowWidth (numValue) {
		this._canvas["width"] = numValue;
	}
	// renamed to setWindowHeight
	setWindowHeight (numValue) {
		this._canvas["height"] = numValue;
	}
	// deleted setCtxScaleParams(obj)
	// deleted setGameStatus(obj)
}
