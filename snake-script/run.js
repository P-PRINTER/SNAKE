import { Game } from "./game";
import { Snake } from "./snake";

export class Main {

    constructor () {
        throw Error('"new Main()" is an invalid construction, Main is a static class.');
    }

    static _snake = null;

    static init (snake) {
        if ( !(snake instanceof Snake) ) throw Error('"snake" arg of Main-obj init must have Snake type.');

        snake.setActor( Game.getActor() );
        this._snake = snake;
        Controller.init();
        Game.init();
        Game.subscribe(snake);
    }

    static replaceSnake (snake) {
        if ( !(snake instanceof Snake) ) throw Error('"snake" arg of Main-obj init must have Snake type.');

        Game.describe(this._snake);
        snake.setActor( this._snake.getActor() );
        this._snake = snake;
        Game.subscribe(this._snake);
    }
}