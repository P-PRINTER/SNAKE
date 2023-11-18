import gameBlock__Render from "./__render/game-block__render.js";
import gameBlock_Snake from "./_snake/game-block_snake.js";


export default {
	run: runFunc,
}


function runFunc () {

	let gameBlocks =  document.querySelectorAll(".game-block");
	gameBlocks.forEach( DomBlock => { loadGameBlock(DomBlock); } );
}

function loadGameBlock (DomBlock) {

	const refreshTime = 120;

	const scaleParams = {
		widthInCells: 15,
		heightInCells: 15,
		cellSize: 40,

		get width () {
			return this.widthInCells * this.cellSize;
		},
		get height () {
			return this.heightInCells * this.cellSize;
		},
	};

	const gameContainer = {

		gameDomBlock: DomBlock,
		get renderControl () {
			if (!this._renderControl) this._renderControl = gameBlock__Render(this);
			return this._renderControl;
		},
		get gameObj () {
			if (!this._gameObj) this._gameObj = new gameBlock_Snake(this.gameStatus);
			return this._gameObj;
		},

		repeatTime: refreshTime,

		isRenderLoaded: false,
		isBuilded: false,

		buildGameBlockSize () {
			this.gameDomBlock.style.width 	= scaleParams["widthInCells"] * scaleParams["cellSize"] + "px";
			this.gameDomBlock.style.height 	= scaleParams["heightInCells"] * scaleParams["cellSize"] + "px";

			this.isBuilded = true;
		},
		
		gameMap: {
			width: scaleParams.widthInCells,
			height: scaleParams.heightInCells,
			layers: {
				main: {
					[Symbol.iterator]: createLayerIteratorFunc(),

					needUpdate: true,

					setItem (item_obj) {
						++this._maxMapId
						item_obj["mapId"] = this._maxMapId;
						return this._items[this._maxMapId] = item_obj;
					},
					getItem (mapId_num) {
						return this._items[localId_num];
					},
					rmItem (mapId_num) {
						delete this._items[localId_num];

						if ( !(mapId_num === this._maxMapId) ) return;
						this._maxMapId = this._items["keys"].at(-1);
					},
					clear () {
						console.log(this._items);
						//this._items = {};
						/*for (let mapId in this._items) {
							delete this._items[mapId];
						}*/
						console.log(this._items);
					},
					forEach (func) {
						for (let item in this._items) {
							func(item);
						}
					},

					_maxMapId: 0,
					_items: {	
						/*
						1: {
							name: "apple",
							pos: [10, 5],
							id: 3,
							mapId: 1,
							color: "red",
							size: [1, 1],
						},
						*/
					},
				},
				back: {
					[Symbol.iterator]: createLayerIteratorFunc(),

					once: true,
					needUpdate: true,

					setItem (item_obj) {
						++this._maxMapId
						itemObj["localId"] = this._maxMapId;
						return this._items[this._maxMapId] = itemObj;
					},
					getItem (mapId_num) {
						return this._items[localId_num];
					},
					rmItem (mapId_num) {
						delete this._items[localId_num];

						if ( !(mapId_num === this._maxMapId) ) return;
						this._maxMapId = this._items["keys"].at(-1);
					},
					forEach (func) {
						for (let item in this._items) {
							func(item);
						}
					},
					_maxMapId: 1,
					_items: {
						1: {
							name: "black_background",
							pos: [0, 0],
							id: "1",
							mapId: 1,
							color: '#000',
							size: ['full', 'full'],
						},
					},
				},
			},
		},

		renderConfig: {
			width: scaleParams["width"],
			height: scaleParams["height"],

			gameContainer: this,
			get cellSize () {
				return this["width"] / gameContainer["gameMap"]["width"];
			},
		},

		startRender (num = 42) {
			this.renderControl.setRepeatTime(num);
			this.renderControl.start(this.gameMap, this.renderConfig);
			this.isRenderLoaded = true;
		},
		stopRender () {
			this.renderControl.stop();
		},


		gameStatus: {
			isWinned: false,
			isGameOvered: false,
			isStopped: false,
			isRunning: false,
		},

		_timerId: undefined,

		start () {
			if (this.isRunning) return;
			this.isRunning = true;

			this._timerId = setInterval( _ => {
				if (!this.isRunning) return;

				this.gameObj.doStep();

				if (this.gameStatus.isWinned) winFunc(this);
				if (this.gameStatus.isGameOvered) gameOverFunc(this);

				if (this.gameStatus.isStopped) {
					reloadGame.call(this);
				}
			}, this.repeatTime );
		},
		stop () {
			this.isRunning = false;
			clearInterval(this._timerId);
		},
		unpause () {
			this.isRunning = true;
		},
		pause () {
			this.isRunning = false;
		},
	};

	gameContainer.buildGameBlockSize();

	gameContainer["gameObj"].init(gameContainer.gameMap);
	gameContainer.startRender();
	document.addEventListener( "keyup", _ => gameContainer.start(), {once: true} );
}


function reloadGame () {
	this.stop();

	if (this.gameStatus.isWinned)		this.gameStatus.isWinned = false;
	if (this.gameStatus.isGameOvered) 	this.gameStatus.isGameOvered = false;
	if (this.gameStatus.isStopped)		this.gameStatus.isStopped = false;

	const enterHandler = evt => {
		if ( evt.code !== "Enter" ) return;

		this.gameDomBlock.classList.add 	("game-block_outline-color_black");
		this.gameDomBlock.classList.remove ("game-block_outline-color_blue");

		this.buildGameBlockSize();
		document.removeEventListener("keydown", enterHandler);
		document.addEventListener( "keydown", _ => this.start(), {once: true} );
	};
	document.addEventListener("keydown", enterHandler);
}

function winFunc (gameContainer) {
	gameContainer.gameDomBlock.classList.remove 	("game-block_outline-color_black");
	gameContainer.gameDomBlock.classList.add 		("game-block_outline-color_blue");
}
function gameOverFunc (gameContainer) {}


function createLayerIteratorFunc () {
	return function iteratorFunc () {
		let itemsArr = Object.values(this._items);
		let curInd = 0;
		let finInd = itemsArr.length -1;

		return {
			next () {
				let result;

				if (curInd <= finInd) {
					result = {done: false, value: itemsArr[curInd++]}
				} else {
					result = {done: true}
				}

				return result;
			}
		};
	};
}