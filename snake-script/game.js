import * as utils from "./utils.js";
import {Actor} from "./actor.js";
import {Area} from "./area.js";

export class Game {

    constructor () {
        throw Error('"new Game()" is an invalid construction, Game is a static class.');
    }

    static APPLE_SPAWN_EVT  = Symbol();
    static EAT_APPLE_EVT    = Symbol();
    static SNAKE_SPAWN_EVT  = Symbol();
    static SNAKE_DEATH_EVT  = Symbol();
    static MOVE_EVT         = Symbol();
    static RUN_EVT          = Symbol();
    static END_EVT          = Symbol();
    static WIN_EVT          = Symbol();
    static GAME_OVER_EVT    = Symbol();
    static PAUSE_EVT        = Symbol();
    static PLAY_EVT         = Symbol();

    static _subs            = new Set();
    static _evt_pending     = [];

    static _actor       = null;
    static _head_pos    = [10, 10];
    static _is_running  = false;
    static _is_paused   = false;

    static init (width, height, x, y) {
        this._area  = new Area(width, height);
        this.spawn(x, y);
        this.generateApple();
    }

    static async run () {
        this._is_running = true;
        this._evt_pending.push(Game.RUN_EVT);

        while (this._is_running) {
            this.updateSubs();
            await utils.delay(50);
            if (this._is_paused) continue;
            this.iteration();
        }
    }

    static pause () {
        this._is_paused = true;
        this._evt_pending.push(Game.PAUSE_EVT);
    }
    static play () {
        this._is_paused = false;
        this._evt_pending.push(Game.PLAY_EVT);
    }

    static iteration () {
        this._actor.move();
        this._evt_pending.push(Game.MOVE_EVT);
        const move_result = this.checkForFinal();

        switch (move_result) {
            case 1:
                this.win();
                break;
            case -1:
                this.gameOver();
                break;
        }
    }

    static getActor () {
        return this._actor;
    }

    static useItem (row, col) {
        const block = this._area.getBlock(row, col);

        switch (block) {
            case Area.APPLE:
                this.eatApple(row, col);
                return Actor.EAT;
            case Area.WALL:
            case Area.SNAKE:
                this.killSnake();
                return Actor.DEAD;
        }
    }
    
    static spawn (row, col, body = null) {
        this._actor     = new Actor(this, body);
        this._head_pos  = [row, col];

        this._actor.forEach(this._head_pos, (x, y) => {
            this._area.setBlock(x, y);
        });
        this._evt_pending.push(Game.SNAKE_SPAWN_EVT);
    }
    static killSnake () {
        this._evt_pending.push(Game.SNAKE_DEATH_EVT);
    }
    static generateApple () {
        this._area.generateAppleOnRandomPos();
        this._evt_pending.push(Game.APPLE_SPAWN_EVT);
    }
    static eatApple (row, col) {
        if (this._area.getBlock(row, col) != Area.APPLE) throw Error("The apple isn't exist at that place.");

        this._area.clearBlock(row, block);
        this._evt_pending(this.EAT_APPLE_EVT);
    }

    static win () {
        this.end();
        this._evt_pending.push(Game.WIN_EVT);
    }
    static gameOver () {
        this.end();
        this._evt_pending.push(Game.GAME_OVER_EVT);
    }
    static end () {
        this._is_running = false;
        this._evt_pending.push(Game.END_EVT);
    }

    static checkForFinal () {
        if ( this._area.size == this._actor.length ) return 1;
        if ( !this._actor.getAliveness() ) {
            this._evt_pending.push(Game.SNAKE_DEATH_EVT);
            return -1
        };
        return 0;
    }

    static getBlockInFrontOfHead () {
        return [...this._head_pos];
    }

    static subscribe (obj) {
        this._subs.push(obj);
    }
    static updateSubs () {
        for (let sub of this._subs.values()) {
            for (let evt of this._evt_pending) {
                sub.update(evt);
            }
        }

        this._evt_pending = [];
    }
}