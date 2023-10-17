import Game from "../canvas-game/Game.js";

export default class Snake extends Game {
	constructor (width, height) {
		super(width, height);
	}

	_cellSize = 30;
	setCellSize (size) {
		this._cellSize = size;
		this._widthInPixels = this._width * size;
		this._heightInPixels = this._height * size;
	}

	run (canvas) {
		canvas.width = this._widthInPixels;
		canvas.height = this._heightInPixels;

		this.draw( canvas.getContext("2d") );
	}

	draw (context) {
		context.fillRect(0, 0, this._widthInPixels, this._heightInPixels);

		for (let col = 0; col < this._width; col += 2) {
			let currentCol = col;
			for (let row = 0; row < this._height; row++) {
				context.clearRect(
					currentCol * this._cellSize,
					row * this._cellSize,
					this._cellSize,
					this._cellSize
				);
				currentCol++;
			}
		}

		for (let row = 0; row < this._height; row += 2) {
			let currentRow = row;
			for (let col = 0; col < this._width; col ++) {
				context.clearRect(
					col * this._cellSize,
					currentRow * this._cellSize,
					this._cellSize,
					this._cellSize
				);
				currentRow++;
			}
		}
	}
}