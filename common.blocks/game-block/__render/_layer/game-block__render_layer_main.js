export default function (stateObj) {
	if (!stateObj.isBootstrapped)	bootstrapFunc(stateObj);
	else 							doStep(stateObj);

	render(stateObj);
}

function sendWinSignal (gameStatus) {
	sendStopSignal(gameStatus);
	gameStatus.isWinned = true;
}
function sendGameOverSignal (gameStatus) {
	sendStopSignal(gameStatus);
	gameStatus.gameOvered = true;
}
function sendStopSignal (gameStatus) {
	gameStatus.isStopped = true;
}

function bootstrapFunc (stateObj) {

	const size = 4;
	const body = new Array(size);

	// needing change from array to linked list
	for (let i = 0; i < size; i++) {
		body[i] = [
			Math.floor(stateObj["scaleParams"].widthInCells / 1.5) - size + i,
			Math.floor(stateObj["scaleParams"].heightInCells / 2),
		];
	}

	stateObj["snake"] = new SnakeBody(body);

	const directValue = stateObj["snake"].getDirectByDescript("LEFT");
	stateObj["snake"].setDirect( directValue );

	// event to change direction
	document.addEventListener("keydown", evt => {
		let nextDirect;

		switch (evt.code) {
			case "ArrowUp":
				nextDirect = stateObj["snake"].getDirectByDescript("TOP");
				break;
			case "ArrowLeft":
				nextDirect = stateObj["snake"].getDirectByDescript("LEFT");
				break;
			case "ArrowDown":
				nextDirect = stateObj["snake"].getDirectByDescript("BOTTOM");
				break;
			case "ArrowRight":
				nextDirect = stateObj["snake"].getDirectByDescript("RIGHT");
				break;
		}
		if (nextDirect) stateObj["cache"].direct = nextDirect;
	});

	createApple(stateObj);


	stateObj.isBootstrapped = true;
}


function doStep (stateObj) {

	changeDirect(stateObj);
	stateObj["snake"].isEated() && createApple(stateObj);

	const walls 		= detectWalls(stateObj);
	const appleDirect 	= detectApple(stateObj);

	stateObj["snake"].move(walls, appleDirect);


	if ( stateObj["snake"].getSize() ===
		stateObj["scaleParams"].widthInCells * stateObj["scaleParams"].heightInCells
	) {
		sendWinSignal( stateObj["gameStatus"] );
		stateObj.isBootstrapped = false;
	}

	if ( stateObj["snake"].isDead() ) {
		sendGameOverSignal( stateObj["gameStatus"] )
		stateObj.isBootstrapped = false;
	}
}

function changeDirect (stateObj) {

	const nextDirect = stateObj["cache"].direct;
	stateObj["cache"].direct = undefined;

	nextDirect && stateObj["snake"].setDirect(nextDirect);
}

function detectWalls (stateObj) {
	let walls = [];

	const TOP 		= stateObj["snake"].getDirectByDescript("TOP");
	const LEFT 		= stateObj["snake"].getDirectByDescript("LEFT");
	const BOTTOM 	= stateObj["snake"].getDirectByDescript("BOTTOM");
	const RIGHT		= stateObj["snake"].getDirectByDescript("RIGHT");

	const head = stateObj["snake"].getHead();
	const visibleZone = stateObj["snake"].getVisibleZone();


	if 	(head[0] === 0) {
		walls.push(LEFT);
	}
	if 	(head[1] === 0) {
		walls.push(TOP);
	}
	if 	(head[0] === stateObj["scaleParams"].widthInCells -1) {
		walls.push(RIGHT);
	}
	if 	(head[1] === stateObj["scaleParams"].heightInCells -1) {
		walls.push(BOTTOM);
	}

	for (let side of visibleZone) {

		const sideCoef = stateObj["snake"].getDirectCodeByDirect(side);
		const sideCoords = [
			head[0] + sideCoef[0],
			head[1] + sideCoef[1],
		];

		stateObj["snake"].bodyTraversal( bodyPart => {

			if (bodyPart[0] === sideCoords[0] && bodyPart[1] === sideCoords[1]) {
				walls.push(side);
			}
		} );
	}

	return walls;
}
function detectApple (stateObj) {
	let appleDirect;

	const head = stateObj["snake"].getHead();
	const apple = stateObj["apple"];
	const visibleZone = stateObj["snake"].getVisibleZone();

	for (let side of visibleZone) {

		const sideCoef = stateObj["snake"].getDirectCodeByDirect(side);
		const sideCoords = [
			head[0] + sideCoef[0],
			head[1] + sideCoef[1],
		];


		if (apple[0] === sideCoords[0] && apple[1] === sideCoords[1]) {
			appleDirect = side;
		}
	}

	return appleDirect;
}

function createApple (stateObj) {

	let x,
		y;


	let isFreePlace;
	do {

		isFreePlace = true;

		x = Math.floor(Math.random() * stateObj["scaleParams"].widthInCells);
		y = Math.floor(Math.random() * stateObj["scaleParams"].heightInCells);

		stateObj["snake"].bodyTraversal( bodyPart => {

			if (x === bodyPart[0] && y === bodyPart[1]) {
				isFreePlace = false;
			}
		} );
	} while (!isFreePlace);

	stateObj["apple"] = [x, y];
	stateObj["snake"].setHungry();
}


function render (stateObj) {

	const ctx		= stateObj["context"];
	const cellSize	= stateObj["scaleParams"].cellSize;

	ctx.clearRect(0, 0, stateObj["scaleParams"].width, stateObj["scaleParams"].height);


	const headCoef = 1;
	const bodyCoef = 0.9;
	const headColor = "#09F";
	const bodyColor = "#0F0";
	//const connectiveColor = bodyColor;

	ctx.fillStyle = headColor;
	const headSize = Math.floor(headCoef * cellSize)
	const bodySize = Math.floor(bodyCoef * cellSize);

	const headOffset = Math.floor((cellSize - headSize) / 2);
	const bodyOffset = Math.floor((cellSize - bodySize) / 2);

	const xHead = stateObj["snake"].getHead()[0] * cellSize + headOffset;
	const yHead = stateObj["snake"].getHead()[1] * cellSize + headOffset;
	ctx.fillRect(xHead, yHead, headSize, headSize)

	ctx.fillStyle = bodyColor;
	stateObj["snake"].bodyTraversal( bodyPart => {
		const xBodyPart = bodyPart[0] * cellSize + bodyOffset;
		const yBodyPart = bodyPart[1] * cellSize + bodyOffset;
		ctx.fillRect(xBodyPart, yBodyPart, bodySize, bodySize);

		/*
		ctx.strokeStyle = connectiveColor;
		ctx.beginPath();

		const xLine1 = xBodyPart + Math.floor(bodySize / 2);
		const yLine1 = yBodyPart + Math.floor(bodySize / 2);

		ctx.moveTo(xLine1, yLine1);
		*/
	} );


	if ( stateObj["snake"].isEated() ) return;

	const apple = stateObj["apple"];

	ctx.fillStyle = "#F00";
	ctx.fillRect(apple[0] * cellSize, apple[1] * cellSize, cellSize, cellSize);
}


class SnakeBody {
	constructor (body = undefined) {
		this._body = body;
		this._size = body ? body.length : 0;
	}

	_isDead = false;

	_growthEnergy = 0;
	_headIndex = 0;
	_tailIndex = -1;

	_directs = {
		LEFT	: Symbol("LEFT"),
		TOP		: Symbol("TOP"),
		RIGHT	: Symbol("RIGHT"),
		BOTTOM	: Symbol("BOTTOM"),
	};
	_directCodes = {
		[ this._directs["LEFT"]		]	: [-1, 0],
		[ this._directs["TOP"]		]	: [0, -1],
		[ this._directs["RIGHT"]	]	: [+1, 0],
		[ this._directs["BOTTOM"]	]	: [0, +1],
	};
	_directAntagonists = {
		[ this._directs["LEFT"]		]	: this._directs["RIGHT"],
		[ this._directs["TOP"]		]	: this._directs["BOTTOM"],
		[ this._directs["RIGHT"]	]	: this._directs["LEFT"],
		[ this._directs["BOTTOM"]	]	: this._directs["TOP"],
	};
	_direct = undefined;
	get _unallowedDirect () {
		return this._directAntagonists[this._direct];
	}

	eat () {
		this._growthEnergy++;
		this._isEated = true;
	}
	setHungry() {
		this._isEated = false;
	}
	isEated () {
		return this._isEated;
	}

	move (walls, appleDirect) {
		if (this._isDead) return;

		for (let wall of walls) {
			if (wall === this._direct) {
				this.dead();
				return;
			}
		}

		if (appleDirect === this._direct) {
			this.eat();
		}

		let nextPos = this.getNextHeadCoords();
		this.bodyTraversal( bodyPart => {
			[
				[bodyPart[0], bodyPart[1]],
				[nextPos[0], nextPos[1]]
			] = [
				nextPos.slice(),
				bodyPart.slice()
			];
		} );

		if (this._growthEnergy) {
			this.setTail(nextPos);
			this._growthEnergy--;
		}
	}

	dead () {
		this._isDead = true;
	}
	isDead () {
		return this._isDead;
	}

	getSize() {
		return this._size;
	}

	setDirect (symbol) {
		if ( !this._directCodes[symbol] ) {
			const errMsg = "Uncorrecting direction " + typeof symbol + " as Symbol type: "
				+ (typeof symbol === "symbol" ? symbol.description : symbol);
			throw new Error(errMsg);
		};

		if (this._isDead) return;
		if ( symbol === this._unallowedDirect ) return;

		this._direct = symbol;
	}
	getDirect () {
		return this._direct;
	}
	getDirectDescript () {
		return this._direct.description;
	}
	getDirectByDescript (text) {
		const resultDirect = this._directs[text];
		if ( !resultDirect ) throw new Error("Uncorrecting direction symbol description");

		return resultDirect;
	}
	getDescriptByDirect (symbol) {
		if ( !this._directCodes[symbol] ) throw new Error("Uncorrecting direction symbol");

		return typeof symbol === "symbol" ? symbol.description: undefined;
	}

	getDirectCodeByDirect (symbol) {
		if ( !this._directCodes[symbol] ) throw new Error("Uncorrecting direction symbol");

		return this._directCodes[symbol];
	}

	getVisibleZone() {
		const zone = new Array(3);

		let sideIndex = 0;
		for (let direct of Object.values(this._directs)) {
			if (direct === this._unallowedDirect) continue;

			zone[sideIndex] = direct;
			sideIndex++;
		}

		return zone;
	}

	getHead () {
		return this.getBodyPart(this._headIndex);
	}
	getNextHeadCoords () {
		const curHead = this.getHead();
		const curDirect = this._directCodes[this._direct];

		return [curHead[0] + curDirect[0], curHead[1] + curDirect[1]];
	}

	setTail (bodyPart) {
		if (this._isDeaded) return;

		this.bodyPush(bodyPart);
		this._size++;
		this._tailIndex++;
	}
	getTail () {
		return this.getBodyPart(this._tailIndex);
	}

	getBodyPart (index) {
		return this._body.at(index);
	}
	bodyPush (bodyPart) {
		this._body.push(bodyPart);
	}
	bodyTraversal (func) {
		for (let bodyPart of this._body) {
			func(bodyPart);
		}
	}
}

// segment of Body
class BodyPart {
	// symbol is a direction as Symbol type
	constructor(coords, direct) {
		this._coords = coords;
		this._direct = direct;
	}

	// coords = [x, y]
	setCoords (coords) {
		this._coords = coords;
	}
	// return coords as [x, y]
	getCoords () {
		return this._coords;
	}
}

class LinkedList {}

// segment of LinkedList
class Node {}