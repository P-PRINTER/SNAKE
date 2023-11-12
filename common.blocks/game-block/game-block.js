import gameBlock__Render from "./__render/game-block__render.js";


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
		// changed
		renderControl: gameBlock__Render(this.gameDomBlock),

		repeatTime: refreshTime,

		isRenderLoaded: false,
		isBuilded: false,

		buildGameBlockSize () {
			this.gameDomBlock.style.width 	= this.scale.widthInCells * this.scale.cellSize + "px";
			this.gameDomBlock.style.height 	= this.scale.heightInCells * this.scale.cellSize + "px";

			this.isBuilded = true;
		},
		
		gameMap: {
			width: scaleParams.widthInCells,
			height: scaleParams.heightInCells,
			layers: {
				main: {
					/*0: {
						0: {
							name: "snake",
							id: "1",
							localId: "0",
							color: "red",
							size: ["all", "all"],
						},
					},*/
				},
				back: {},
			},
		},

		renderConfig: {
			width: scaleParams["width"],
			height: scaleParams["height"],
			get cellSize () {
				return this["width"] / gameMap["width"];
			},
		},

		startRender (num) {
			this.renderControl.setRepeatTime(num);
			this.renderControl.start(this.gameMap, this.renderConfig);
			this.isRenderLoaded = true;
		},
		// fixed
		stopRender () {
			this.renderControl.stop();
		},


		gameStatus: {
			isWinned: false,
			isGameOvered: false,
			isStopped: false,
			isRunning: false,
		},

		timerId: undefined;

		start () {
			if (this.isRunning) return;

			if (!this.isLoaded) this.loadRender();
			if (!this.isBuilded) this.buildGameBlockSize();

			this.isRunning = true;	
			this.timerId = setInterval( _ => {
				if (!this.isRunning) return;

				loadFrame(this["repeatable"]);

				if (this.gameStatus.isWinned) winFunc(this);
				if (this.gameStatus.isGameOvered) gameOverFunc(this);

				if (this.gameStatus.isStopped) {
					reloadGame.call(this);
				}
			}, this.repeatTime );
		},
		stop () {
			this.isRunning = false;
			clearInterval(this.timerId);
		},
		unpause () {
			this.isRunning = true;
		},
		pause () {
			this.isRunning = false;
		},
	};

	gameContainer.buildGameBlockSize();

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


export default {
	run: runFunc,
}

