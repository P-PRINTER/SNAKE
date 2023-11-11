export default function (stateObj) {

	render(stateObj);
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