export default function (stateObj) {

	const ctx = stateObj.context;
	const scaleParams = stateObj.scaleParams;

	ctx.fillRect(0, 0, scaleParams.width, scaleParams.height);
}