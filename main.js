import snakeGame from "./common.blocks/snake-game/snake-game.js"


let codeBlocks = [
	snakeGame,
];

runBlocks(codeBlocks);


function runBlocks(blockArr) {
	for (let block of blockArr) {
		block.run();
	}
}