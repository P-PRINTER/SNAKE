export default function (stateObj) {
	if (!stateObj.isBootstrapped)	bootstrapFunc(stateObj);
	else 							doStep(stateObj);

	render(stateObj);
}

function bootstrapFunc (stateObj) {

	const size = 7;
	const body = new Array(size);

	// needing change from array to linked list
	for (let i = 0; i < size; i++) {
		body[i] = [
			Math.floor(stateObj["scaleParams"].widthInCells / 1.5) - size + i,
			Math.floor(stateObj["scaleParams"].heightInCells / 2),
		];
	}

	stateObj["snake"] = new SnakeBody(body);
	stateObj.isBootstrapped = true;

	// event to change direction
	document.addEventListener("keydown", evt => {
		if (!stateObj.isMoved) return;

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

		stateObj.isMoved = false;
		nextDirect && stateObj["snake"].setDirect(nextDirect);
	});
}

function doStep (stateObj) {

	if ( stateObj["snake"].isDead() ) {
		stateObj["gameStatus"].gameOvered = true;
		stateObj.isBootstrapped = false;
	}

	const headX = stateObj["snake"].getHead()[0];
	const headY = stateObj["snake"].getHead()[1];


	const wall = new Array(2);

	if 			(headX === 0) {
		wall[0] = stateObj["snake"].getDirectByDescript("LEFT");
	} else if 	(headX === stateObj["scaleParams"].widthInCells -1) {
		wall[0] = stateObj["snake"].getDirectByDescript("RIGHT");
	}
	if 	(headY === 0) {
		wall[1] = stateObj["snake"].getDirectByDescript("TOP");
	} else if 	(headY === stateObj["scaleParams"].heightInCells -1) {
		wall[1] = stateObj["snake"].getDirectByDescript("BOTTOM");
	}

	stateObj["snake"].move(wall);
	stateObj.isMoved = true;
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
	_direct = this._directs["LEFT"];
	get _unallowedDirect () {
		return this._directAntagonists[this._direct];
	}

	eat () {
		this._growthEnergy++;
	}

	move (wall) {
		if (this._isDead) return;

		for (let side of wall) {
			if (side === this._direct) {
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
		return this._directs[text];
	}
	getDescriptByDirect (symbol) {
		return typeof symbol === "symbol" ? symbol.description: undefined;
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