import snakeCanvas from "./__canvas/snake-game__canvas.js";


function runFunc () {

	const refreshTime = 100;

	const cellSize = 20;

	let widthInCells	= 15;
	let heightInCells	= 15;

	const snakeGame = document.querySelector(".snake-game");
	snakeGame.style.width = widthInCells * cellSize + "px";
	snakeGame.style.height = heightInCells * cellSize + "px";


	const gameContainer = {
		bootstrap: new Set(),
		repeatable: new Set(),

		isRunning: false,
		isBootstrapLoaded: false,

		start (repeatTime) {
			this.isRunning = true;
			loadBootstrap.call(this);
			loadRepeatable.call(this, repeatTime);
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

	snakeCanvas(snakeGame, gameContainer, {
		widthInCells: widthInCells,
		heightInCells: heightInCells,
		cellSize: cellSize,
	});

	gameContainer.start(refreshTime);
}

function loadBootstrap () {
	loadFrame(this["bootstrap"]);
}
function loadRepeatable (repeatTime) {
	this.timerId = setInterval( _ => {
		if (!this.isRunning) return;
		//if (!this.isBootstrapLoaded) return;

		loadFrame(this["repeatable"]);
	}, repeatTime );
}

function loadFrame (containerSet) {
	for (let canvasObj of containerSet.keys()) {
		canvasObj["observer"]();
	}
}


export default {
	run: runFunc,
}

