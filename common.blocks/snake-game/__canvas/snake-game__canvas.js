import Snake from "../../../lib/snake/Snake.js";

export default function snakeCanvas (gameArea, cellSize, widthInCells = 15, heightInCells = 15) {
	const canvas = gameArea.querySelector(".snake-game__canvas");

	const snake = new Snake(widthInCells, heightInCells);
	snake.setCellSize(cellSize);
	snake.run(canvas);
}
