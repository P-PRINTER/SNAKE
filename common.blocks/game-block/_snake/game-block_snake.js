export default class SnakeGame {
	construnctor (gameStatus_obj) {
		this._gameStatus = gameStatus_obj;
	}

	_snake = undefined;
	_gameMap = undefined;
	_lastKeydown = undefined;
	_directObj = new Directs_2d();

	buildGameMap () {
		const main = this._gameMap.layers["main"];
		main.clear();

		let isHeadBuilded = false;
		this._snake.forEach( bodyPart => {
			let mapPart;
			if (!isHeadBuilded) {
				mapPart = takeHeadTemplate();
				mapPart.setPos( ...this._snake.getHead() );

				main.setItem(mapPart);
				isHeadBuilded = true;
				return;
			}

			mapPart = takeBodyPartTemplate();
			mapPart.setPos(...bodyPart);

			main.setItem(mapPart);
		} );

		const apple = takeAppleTemplate();
		apple.setPos( ...this.getApplePos() );

		main.setItem(apple);
	}
	detectWallOnPos (pos_arr) {
		let result_bool = false;

		if 	(pos_arr[0] === 0) {
			result_bool = true;
		}
		else if (pos_arr[0] === this._gameMap["width"] -1) {
			result_bool = true;
		}
		if 	(pos_arr[1] === 0) {
			result_bool = true;
		}
		else if (pos_arr[1] === this._gameMap["height"] -1) {
			result_bool = true;
		}

		return result_bool;
	}
	detectAppleOnPos (pos_arr) {
		result_bool = false;

		if (pos_arr[0] === this._apple[0] && pos_arr[1] === this._apple[1]) {
			result_bool = true;
		}

		return result_bool;
	}

	init (gameMap_obj) {
		this._gameMap = gameMap_obj;

		const size = 4;
		const bodyArr = new Array(size);

		// needing change from array to linked list
		for (let i = 0; i < size; i++) {
			bodyArr[i] = [
				Math.floor(this._gameMap["width"] / 1.5) - size + i,
				Math.floor(this._gameMap["height"] / 2),
			];
		}

		const directValue = this._directObj.getDirectByDescript("LEFT");

		this._snake = new SnakeBody(bodyArr);
		this._snake.setDirectObj(this._directObj);
		this._snake.setDirect(directValue);

		// event to change direction
		document.addEventListener("keydown", evt => {
			let nextDirect;

			switch (evt.code) {
				case "ArrowUp":
					nextDirect = this._directObj.getDirectByDescript("TOP");
					break;
				case "ArrowLeft":
					nextDirect = this._directObj.getDirectByDescript("LEFT");
					break;
				case "ArrowDown":
					nextDirect = this._directObj.getDirectByDescript("BOTTOM");
					break;
				case "ArrowRight":
					nextDirect = this._directObj.getDirectByDescript("RIGHT");
					break;
			}
			if (nextDirect) this._lastKeydown = nextDirect;
		});

		this.createApple();

		this.buildGameMap();
	}

	doStep () {
		changeDirect.call(this);

		this._snake.checkHungry() && this.createApple();

		const headPos = this._snake.getHead();
		const visionSides = this._snake.getVisionSides();
		const itemList = this._snake.getKnownItems();

		const availableItems = [];
		for (let side of visionSides) {
			const pos = new Array(2);
			pos[0] = headPos[0] + this._directObj.getCode(side)[0];
			pos[1] = headPos[1] + this._directObj.getCode(side)[1];

			if ( this.detectAppleOnPos(pos) ) {
				availableItems.push( itemList["FOOD"] );
			} else if ( this.detectWallOnPos(pos) ) {
				availableItems.push( itemList["WALL"] );
			}
		}

		this._snake.setItemsInSight(availableItems);
		this._snake.move();


		if ( this._snake.getSize() ===
			this._gameMap["width"] * this._gameMap["height"]
		) {
			this.sendWinSignal();
		}
		if ( this._snake.checkDeath() ) {
			this.sendGameOverSignal();
		}

		this.buildGameMap();
	}

	_apple = undefined;
	createApple () {

		let x,
			y;


		let isFreePlace;
		do {

			isFreePlace = true;

			x = Math.floor(Math.random() * this._gameMap["width"]);
			y = Math.floor(Math.random() * this._gameMap["height"]);

			this._snake.forEach( bodyPart => {

				if (x === bodyPart[0] && y === bodyPart[1]) {
					isFreePlace = false;
				}
			} );
		} while (!isFreePlace);

		this._apple = [x, y];
		this._snake.makeHungry();
	}
	getApplePos () {
		return [...this._apple];
	}

	sendWinSignal () {
		this.sendStopSignal();
		this._gameStatus.isWinned = true;
	}
	sendGameOverSignal () {
		this.sendStopSignal();
		this._gameStatus.gameOvered = true;
	}
	sendStopSignal () {
		this._gameStatus.isStopped = true;
	}
}
function changeDirect () {

	const nextDirect = this._lastKeydown;
	this._lastKeydown = undefined;

	nextDirect && this._snake.setDirect(nextDirect);
}

function takeAppleTemplate () {
	const resultTemplate = new ItemTemplate();
	resultTemplate.setName("apple");
	resultTemplate.setId(10);
	resultTemplate.setColor("#F00")
	resultTemplate.setSize(1, 1);

	return resultTemplate;
}
function takeHeadTemplate () {
	const resultTemplate = new ItemTemplate();
	resultTemplate.setName("snake-head");
	resultTemplate.setId(1);
	resultTemplate.setColor("#00F")
	resultTemplate.setSize(1, 1);

	return resultTemplate;
}
function takeBodyPartTemplate () {
	const resultTemplate = new ItemTemplate();
	resultTemplate.setName("snake-body");
	resultTemplate.setId(2);
	resultTemplate.setColor("#0F0")
	resultTemplate.setSize(1, 1);

	return resultTemplate;
}

class ItemTemplate {
	_name = "";
	_id = null;
	_color = "";
	_size = [null, null];
	_pos = [null, null];

	_isTrash = false;
	checkTrash () {
		return this._isTrash;
	}
	makeTrash () {
		this._isTrash = true;
	}

	get name () {
		return this._name;
	}
	get id () {
		return this._id;
	}
	get color () {
		return this._color;
	}
	get size () {
		return this._size;
	}
	get pos () {
		return this._pos;
	}

	setId (num) {
		this._id = num;
		return true;
	}
	getId () {
		return this._id;
	}

	setName (str) {
		this._name = str;
		return true;
	}
	getName () {
		return this["name"];
	}

	setColor (color_str) {
		this._color = color_str;
		return true;
	}
	getColor () {
		return this["color"];
	}

	setSize (x_num, y_num) {
		this._size = [x_num, y_num];
		return true;
	}
	getSize () {
		return [...this["size"]];
	}

	setPos (x_num, y_num) {
		this._pos = [x_num, y_num];
		return true;
	}
	getPos () {
		return [...this["pos"]];;
	}
}

/*
function render () {

	const ctx		= stateObj["context"];
	const cellSize	= this._gameMap.cellSize;

	ctx.clearRect(0, 0, this._gameMap["width"], this._gameMap["height"]);


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
	stateObj["snake"].forEach( bodyPart => {
		const xBodyPart = bodyPart[0] * cellSize + bodyOffset;
		const yBodyPart = bodyPart[1] * cellSize + bodyOffset;
		ctx.fillRect(xBodyPart, yBodyPart, bodySize, bodySize);

		ctx.strokeStyle = connectiveColor;
		ctx.beginPath();

		const xLine1 = xBodyPart + Math.floor(bodySize / 2);
		const yLine1 = yBodyPart + Math.floor(bodySize / 2);

		ctx.moveTo(xLine1, yLine1);
	} );


	if ( stateObj["snake"].isEated() ) return;

	const apple = stateObj["apple"];

	ctx.fillStyle = "#F00";
	ctx.fillRect(apple[0] * cellSize, apple[1] * cellSize, cellSize, cellSize);
}
*/

class Directs_2d {
	constructor() {
	}

	_directs = {
		LEFT	: Symbol("LEFT"),
		TOP		: Symbol("TOP"),
		RIGHT	: Symbol("RIGHT"),
		BOTTOM	: Symbol("BOTTOM"),
	};
	_codes = {
		[ this._directs["LEFT"]		]	: [-1, 0],
		[ this._directs["TOP"]		]	: [0, -1],
		[ this._directs["RIGHT"]	]	: [+1, 0],
		[ this._directs["BOTTOM"]	]	: [0, +1],
	};
	_antagonists = {
		[ this._directs["LEFT"]		]	: this._directs["RIGHT"],
		[ this._directs["TOP"]		]	: this._directs["BOTTOM"],
		[ this._directs["RIGHT"]		]	: this._directs["LEFT"],
		[ this._directs["BOTTOM"]	]	: this._directs["TOP"],
	};

	getDirects () {
		return {...this._directs};
	}
	getDirectByDescript (text) {
		const resultDirect = this._directs[text];
		if ( !resultDirect ) {
			throw new Error(`Uncorrecting direction symbol description: ${resultDirect}`);
		}

		return resultDirect;
	}
	hasDirect (symbol) {
		let result_bool;

		if (this._antagonists[symbol])	result_bool = true;
		else 							result_bool = false;

		return result_bool;
	}
	getDescript (symbol) {
		if ( !this.hasDirect(symbol) ) throw new Error("Uncorrecting direction symbol");

		return symbol.description;
	}
	getCode (symbol) {
		if ( !this.hasDirect(symbol) ) throw new Error("Uncorrecting direction symbol");

		return this._codes[symbol];
	}
	getAntagonist (symbol) {
		if ( !this.hasDirect(symbol) ) throw new Error("Uncorrecting direction symbol");

		return this._antagonists[symbol];
	}

	forEach (func) {
		for (let direct in this._directs) {
			func(this._directs[direct], direct, {...this._directs});
		}
	}
}

class SnakeBody {
	constructor (body) {
		this._body = body;
		this._size = body ? body.length : 0;
	}

	_isDead = false;

	_growthEnergy = 0;
	_headIndex = 0;
	_tailIndex = -1;

	getSize() {
		return this._size;
	}

	_directObj = undefined;
	_curDirect = undefined;
	get _unallowedDirect () {
		return this._directObj.getAntagonist(this._curDirect);
	}
	
	getAvailableSidesByDirect = function func (symbol) {

		if (!func.cache)		func.cache = {}; 
		if (func.cache[symbol]) return func.cache[symbol];

		const resultArr = [];
		const antagonist = this._directObj.getAntagonist(symbol);

		this._directObj.forEach( direct => {
			(symbol !== antagonist) && resultArr.push(direct);
		} );

		func.cache[symbol] = resultArr;
		return [...resultArr];
	}

	setDirectObj(obj) {
		this._directObj = obj;
	}
	setDirect = function func (symbol) {
		if ( !this._directObj.hasDirect(symbol) ) {
			const errMsg = "Uncorrecting direction "
				+ typeof symbol
				+ " entered like Symbol type: "
				+ (typeof symbol === "symbol" ? symbol.description : symbol);
			throw new Error(errMsg);
		};

		if ( this.checkDeath() ) return;
		if ( func.isNotFirstRun && symbol === this._unallowedDirect ) return;

		if (!func.isNotFirstRun) func.isNotFirstRun = true;

		this._curDirect = symbol;
	}
	getCurDirect () {
		return this._curDirect;
	}
	getCurDirectDescript () {
		return this._curDirect.description;
	}

	_isHungry = true;
	eat (foodSymbol) {
		if ( foodSymbol !== getKnownItems()["FOOD"] ) return false;

		this._growthEnergy++;
		this._isHungry = false;
		return true;
	}
	makeHungry () {
		this._isHungry = true;
	}
	checkHungry () {
		return this._isHungry;
	}
	tryToGrowUp (bodyPart_arr) {
		if ( this.checkDeath() ) return;

		if (this._growthEnergy) {
			this.increaseTail(bodyPart_arr);
			this._growthEnergy--;
		}
	}

	_isDead = false;
	die () {
		this._isDead = true;
	}
	checkDeath () {
		return this._isDead;
	}

	move () {
		if (this._isDead) return;

		/*
		for (let wall of walls) {
			if (wall === this._curDirect) {
				this.dead();
				return;
			}
		}
		*/

		/*
		if (appleDirect === this._curDirect) {
			this.eat();
		}
		*/

		const nextPosItem = this._visionZone[this.curDirect];
		const foodSymbol = this.getKnownItems()["FOOD"];
		const wallSymbol = this.getKnownItems()["WALL"];
		
		switch (nextPosItem) {
			case foodSymbol:
				this.eat(foodSymbol);
				break;
			case wallSymbol:
				this.die();
				break;
		};

		const bodyPartNextPos = this.getNextHeadPos();
		this.forEach( bodyPart => {
			//console.log(bodyPartNextPos);
			[
				[bodyPartNextPos[0], bodyPartNextPos[1]],
				[bodyPart[0], bodyPart[1]],
			] = [
				[bodyPart[0], bodyPart[1]],
				[bodyPartNextPos[0], bodyPartNextPos[1]],
			];
		} );

		this.tryToGrowUp(bodyPartNextPos);
	}

	detectWalls () {
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
		if 	(head[0] === this._gameMap["width"] -1) {
			walls.push(RIGHT);
		}
		if 	(head[1] === this._gameMap["height"] -1) {
			walls.push(BOTTOM);
		}

		for (let side of visibleZone) {

			const sideCoef = stateObj["snake"].getDirectCodeByDirect(side);
			const sideCoords = [
				head[0] + sideCoef[0],
				head[1] + sideCoef[1],
			];

			stateObj["snake"].forEach( bodyPart => {

				if (bodyPart[0] === sideCoords[0] && bodyPart[1] === sideCoords[1]) {
					walls.push(side);
				}
			} );
		}

		return walls;
	}
	detectApple () {
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

	getKnownItems = function func () {
		if (func.insideContainer) return {...func.insideContainer};

		func.insideContainer = {
			"FOOD": Symbol("FOOD"),
			"WALL": Symbol("WALL"),
		};
		return {...func.insideContainer};
	};

	get _visionZone () {
		const sideArr = this.getAvailableSidesByDirect(this._curDirect);
		const result = {
			[ sideArr[0] ]: undefined,
			[ sideArr[1] ]: undefined,
			[ sideArr[2] ]: undefined,
		};

		return result;
	}
	setItemsInSight (arr) {
		let i = 0;
		for ( let key in Object.keys(this._visionZone) ) {
			this._visionZone[key] = arr[i++];
		}
	}
	getVisionSides () {
		return [ ...Object.keys(this._visionZone) ];
	}

	getNextHeadPos () {
		const curHead = this.getHead();
		const curDirect = this._directObj.getCode(this._curDirect);

		return [curHead[0] + curDirect[0], curHead[1] + curDirect[1]];
	}
	getHead () {
		return this.getBodyPart(this._headIndex);
	}

	increaseTail (bodyPart) {
		if (this._isDead) return;

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
	forEach (func) {
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
		this._curDirect = direct;
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