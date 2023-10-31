export default function (stateObj) {

	const ctx			= stateObj["context"];
	const scaleParams	= stateObj["scaleParams"];

	ctx.fillRect(0, 0, scaleParams.width, scaleParams.height);


	if (!stateObj["developMode"]) return;

	ctx.strokeStyle = "#FFF";
	for (let x = 0; x < stateObj["scaleParams"].widthInCells; x++) {
		const absoluteX = x * stateObj["scaleParams"].cellSize;

		ctx.beginPath();
		ctx.moveTo(absoluteX, 0);
		ctx.lineTo(absoluteX, stateObj["scaleParams"].height);
		ctx.stroke();
	}
	for (let y = 0; y < stateObj["scaleParams"].heightInCells; y++) {
		const absoluteY = y * stateObj["scaleParams"].cellSize;

		ctx.beginPath();
		ctx.moveTo(0, absoluteY);
		ctx.lineTo(stateObj["scaleParams"].width, absoluteY);
		ctx.stroke();
	}
}