export default function (stateObj) {
	if (!stateObj.isBootstraped)	bootstrapFunc(stateObj);
	else 							doStep(stateObj);

	render(stateObj);
}

function bootstrapFunc (stateObj) {
	stateObj["snake"] = {};

	stateObj["snake"].directions = {
		LEFT: Symbol(),
		TOP: Symbol(),
		RIGHT: Symbol(),
		BOTTOM: Symbol(),
	};

	stateObj["snake"].curDirection = stateObj["snake"].directions.LEFT;

	stateObj["snake"].size = 3;
	stateObj["snake"].body = new Array( stateObj["snake"].size );

	// needing change from array to linked list
	for (let i = 0; i < stateObj["snake"].size; i++) {
		stateObj["snake"].body[i] = [
			Math.floor(stateObj["scaleParams"].widthInCells / 2) - stateObj["snake"].size + i,
			Math.floor(stateObj["scaleParams"].heightInCells / 2),
		];
	}

	stateObj.isBootstraped = true;
}

function doStep (stateObj) {}

function render (stateObj) {
	const ctx = stateObj.context;
	ctx.fillStyle = "#00FF00";
	ctx.fillRect(50, 50, 100, 100);
}