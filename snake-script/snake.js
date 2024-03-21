import { Actor } from "./actor.js";
import { Controller } from "./controller.js";
import { Game } from "./game.js";

class Snake {

    _actor = null;

    constructor (actor, game) {
        if ( !(actor instanceof Actor) ) throw TypeError('"actor" arg of the Snake-obj init must have Actor type.');

        this._actor = actor;
    }

    replaceActor (actor) {
        if ( !(actor instanceof Actor) ) throw TypeError('"actor" arg of the Snake.replaceActor() init must have Actor type.');

        this._actor = actor;
    }
    clearActor () {
        this._actor = null;
    }

    // redefine in children
    update (evt) {}
}

class Player extends Snake {

    update (evt) {

        if (evt == Game.MOVE_EVT) this._actor.setDirection( Controller.getCode() );
    }
}

export {Snake, Player}