import gameBlock from "./common.blocks/game-block/game-block.js"


let codeBlocks = [
	gameBlock,
];

runBlocks(codeBlocks);


function runBlocks(blockArr) {
	for (let block of blockArr) {
		block.run();
	}
}