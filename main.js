import snake from "./common.blocks/snake/snake.js"


let codeBlocks = [
	snake,
];

runBlocks(codeBlocks);


function runBlocks(blockArr) {
	for (let block of blockArr) {
		block.run();
	}
}