export default function (stateObj) {
	if (!stateObj.isBootstrapped)	bootstrapFunc(stateObj);
	else 							doStep(stateObj);

	render(stateObj);
}

function bootstrapFunc (stateObj) {

	const size = 6;
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


	stateObj.isBootstrapped = true;
}

function doStep (stateObj) {

	changeDirect(stateObj);

	const walls = detectWalls(stateObj);

	stateObj["snake"].move(walls);
	stateObj.isMoved = true;

	if ( stateObj["snake"].isDead() ) {
		stateObj["gameStatus"].gameOvered = true;
		stateObj.isBootstrapped = false;
	}
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
		stateObj["snake"].bodyTraversal( bodyPart => {

			const sideCoef = stateObj["snake"].getDirectCodeByDirect(side);
			const sideCoords = [
				stateObj["snake"].getHead()[0] + sideCoef[0],
				stateObj["snake"].getHead()[1] + sideCoef[1],
			];

			if (bodyPart[0] === sideCoords[0] && bodyPart[1] === sideCoords[1]) {
				walls.push(side);
			}
		} );
	}

	return walls;
}

function changeDirect (stateObj) {
	if (!stateObj.isMoved) return;
	stateObj.isMoved = false;

	const nextDirect = stateObj["cache"].direct;
	nextDirect && stateObj["snake"].setDirect(nextDirect);
	stateObj["cache"].direct = undefined;
}


function render (stateObj) {


	const ctx = stateObj["context"];
	const cellSize = stateObj["scaleParams"].cellSize;

	ctx.clearRect(0, 0, stateObj["scaleParams"].width, stateObj["scaleParams"].height);
	ctx.fillStyle = "#00FF00";

	stateObj["snake"].bodyTraversal( bodyPart => {
		const xPos = bodyPart[0] * cellSize;
		const yPos = bodyPart[1] * cellSize;
		ctx.fillRect(xPos, yPos, cellSize, cellSize);
	} );
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
	}

	move (walls) {
		if (this._isDead) return;

		for (let wall of walls) {
			if (wall === this._direct) {
				this.dead();
				return;
			}
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

	setDirect (symbol) {
		if ( !this._directCodes[symbol] ) throw new Error("Uncorrect direction symbol");

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