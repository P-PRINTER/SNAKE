export class Controller {

    static UP       = Symbol();
    static RIGHT    = Symbol();
    static DOWN     = Symbol();
    static LEFT     = Symbol();

    static _code = Controller.LEFT;

    constructor () {
        throw Error('"new Controller()" is an invalid construction, Controller is a static class.');
    }

    static init () {

        document.addEventListener("keydown", evt => {
            evt.preventDefault();

            switch (evt.code) {
                case "KeyW":
                case "ArrowUp":
                    this._code = this.UP;
                    break;
                case "KeyD":
                case "ArrowRight":
                    this._code = this.RIGHT;
                    break;
                case "KeyS":
                case "ArrowDown":
                    this._code = this.DOWN;
                    break;
                case "KeyA":
                case "ArrowLeft":
                    this._code = this.LEFT;
                    break;
            }
        });
    }

    static getCode () {
        return this._code;
    }
}