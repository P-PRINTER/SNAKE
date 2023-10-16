import Game from "../canvas-game/Game.js";

export default class Snake extends Game {
	constructor (width, height) {
		super(width, height);
	}

	run (canvas) {
		this._context = canvas.getContext("2d");
		this.draw(this._context);
	}

	draw (context) {
	}
}