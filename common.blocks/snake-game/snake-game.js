import snakeCanvas from "./__canvas/snake-game__canvas.js";


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

	const snakeGame = document.querySelector(".snake-game");

	const gameContainer = {
		bootstrap: new Set(),
		repeatable: new Set(),

		isRunning: false,
		//isBootstrapLoaded: false,

		gameBlock: snakeGame,
		canvasLoadFunc: snakeCanvas,
		gameStatus: {
			isWinned: false,
			gameOvered: false,
		},

		scale: scaleParams,
		repeatTime: refreshTime,

		isLoaded: false,
		isBuilded: false,

		loadCanvas () {
			this.canvasLoadFunc(this);
			this.isLoaded = true;
		},
		buildMap () {
			this.gameBlock.style.width = this.scale.widthInCells * this.scale.cellSize + "px";
			this.gameBlock.style.height = this.scale.heightInCells * this.scale.cellSize + "px";

			if (!this.isLoaded) this.loadCanvas();
			loadFrame(this["bootstrap"]);

			this.isBuilded = true;
		},

		start () {
			if (this.isRunning) return;

			if (!this.isLoaded) this.loadCanvas();
			if (!this.isBuilded) this.buildMap();

			this.isRunning = true;	
			this.timerId = setInterval( _ => {
				if (!this.isRunning) return;

				loadFrame(this["repeatable"]);

				if (this.gameStatus.gameOvered || this.gameStatus.isWinned) {
					this.stop();

					this.gameStatus.isWinned = false;
					this.gameStatus.gameOvered = false;

					const enterHandler = evt => {
						if ( evt.code !== "Enter" ) return;

						this.buildMap();
						document.removeEventListener("keydown", enterHandler);
						document.addEventListener( "keydown", _ => gameContainer.start(), {once: true} );
					};
					document.addEventListener("keydown", enterHandler);
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
	for (let canvasObj of containerSet.keys()) {
		canvasObj["observer"]();
	}
}


export default {
	run: runFunc,
}

