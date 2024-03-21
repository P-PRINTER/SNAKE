export class Controller {

    static _up      = null;
    static _right   = null;
    static _down    = null;
    static _left    = null;

    constructor () {
        throw Error('"new Controller()" is an invalid construction, Controller is a static class.');
    }

    static init () {

        document.addEventListener("keydown", evt => {
            evt.preventDefault();

            switch (evt.code) {
                case "KeyW":
                case "ArrowUp":
                    this.up();
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.right();
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.down();
                    break;
                case "KeyA":
                case "ArrowLeft":
                    this.left();
                    break;
            }
        });
    }

    static up () {
        if (this._up !== null)      this._up();
    }
    static right () {
        if (this._right !== null)   this._right();
    }
    static down () {
        if (this._down !== null)    this._down();
    }
    static left () {
        if (this._left !== null)    this._left();
    }

    static setUpAction (action) {
        this._up    = action;
    }
    static setRightAction (action) {
        this._right = action;
    }
    static setDownAction (action) {
        this._down  = action;
    }
    static setLeftAction (action) {
        this._left  = action;
    }
}