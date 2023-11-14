export default function draw (context, graphicMap, renderConfig) {
	const layer = graphicMap.layers["back"];

	if (layer["blockUpdate"]) return;
	if (layer["once"]) layer["blockUpdate"] = true;

	context.clearRect(0, 0, renderConfig["width"], renderConfig["height"]);

	for (let item of layer) {
		
		const itemWidth		= item["size"][0] === 'full' ? renderConfig["width"] : item["size"][0] * renderConfig.cellSize;
		const itemHeight	= item["size"][1] === 'full' ? renderConfig["height"] : item["size"][1] * renderConfig.cellSize;
		const posX			= item["pos"][0];
		const posY			= item["pos"][1];

		context.fillStyle = item["color"];
		context.fillRect(posX, posY, itemWidth, itemHeight);
	}
}