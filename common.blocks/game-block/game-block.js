import renderOfGameBlock from "./__render/game-block__render.js";


function runFunc () {

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
		bootstrap: new Set(),
		repeatable: new Set(),

		isRunning: false,
		//isBootstrapLoaded: false,

		gameBlock: document.querySelector(".game-block"),
		renderLoadFunc: renderOfGameBlock,
		gameStatus: {
			isWinned: false,
			gameOvered: false,
			isStopped: false,
		},

		scale: scaleParams,
		repeatTime: refreshTime,

		isLoaded: false,
		isBuilded: false,

		loadRender () {
			this.renderLoadFunc(this);
			this.isLoaded = true;
		},
		buildMap () {
			this.gameBlock.style.width = this.scale.widthInCells * this.scale.cellSize + "px";
			this.gameBlock.style.height = this.scale.heightInCells * this.scale.cellSize + "px";

			if (!this.isLoaded) this.loadRender();
			loadFrame(this["bootstrap"]);

			this.isBuilded = true;
		},

		start () {
			if (this.isRunning) return;

			if (!this.isLoaded) this.loadRender();
			if (!this.isBuilded) this.buildMap();

			this.isRunning = true;	
			this.timerId = setInterval( _ => {
				if (!this.isRunning) return;

				loadFrame(this["repeatable"]);

				if (this.gameStatus.isWinned) winFunc(this);
				if (this.gameStatus.gameOvered) gameOverFunc(this);

				if (this.gameStatus.isStopped) {
					reloadGame.call(this);
				}
			}, this.repeatTime );
		},
		stop () {
			this.isRunning = false;
			clearInterval(this.timerId);
		},

		play () {
			this.isRunning = true;
		},
		pause () {
			this.isRunning = false;
		},
	};

	gameContainer.buildMap();

	document.addEventListener( "keyup", _ => gameContainer.start(), {once: true} );
}


function loadFrame (containerSet) {
	for (let renderObj of containerSet.keys()) {
		renderObj["observer"]();
	}
}

function reloadGame () {
	this.stop();

	if (this.gameStatus.isWinned)	this.gameStatus.isWinned = false;
	if (this.gameStatus.gameOvered) this.gameStatus.gameOvered = false;
	if (this.gameStatus.isStopped)	this.gameStatus.isStopped = false;

	const enterHandler = evt => {
		if ( evt.code !== "Enter" ) return;

		this.gameBlock.classList.add 	("game-block_outline-color_black");
		this.gameBlock.classList.remove ("game-block_outline-color_blue");

		this.buildMap();
		document.removeEventListener("keydown", enterHandler);
		document.addEventListener( "keydown", _ => this.start(), {once: true} );
	};
	document.addEventListener("keydown", enterHandler);
}

function winFunc (gameContainer) {
	gameContainer.gameBlock.classList.remove 	("game-block_outline-color_black");
	gameContainer.gameBlock.classList.add 		("game-block_outline-color_blue");
}
function gameOverFunc (gameContainer) {}


export default {
	run: runFunc,
}

