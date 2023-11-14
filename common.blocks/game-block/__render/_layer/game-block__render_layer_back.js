export default function renderFrame (context, graphicMap, renderConfig) {
	const mod = "back";
	const layer = graphicMap.layers[mod];

	if (!layer["needUpdate"]) return;
	if (layer["once"]) layer["needUpdate"] = false;

	draw(context, graphicMap, renderConfig, mod);
}

function draw (context, graphicMap, renderConfig, mod) {

	for (let item of graphicMap.layers[mod]) {

		const itemWidth		= item["size"][0] === 'full'
			? renderConfig["width"]
			: item["size"][0] * renderConfig.cellSize;
		const itemHeight	= item["size"][1] === 'full'
			? renderConfig["height"]
			: item["size"][1] * renderConfig.cellSize;
		const posX			= item["pos"][0];
		const posY			= item["pos"][1];

		context.fillStyle = item["color"];
		context.fillRect(posX, posY, itemWidth, itemHeight);
	}
}