import {Area} from "./area.js";
import {Game} from "./game.js";

class Actor {

    static FORWARD  = Symbol();
    static LEFT     = Symbol();
    static BOTTOM   = Symbol();
    static RIGHT    = Symbol();

    static validateDirection (direct) {
        if (
            direct != this.FORWARD  &&
            direct != this.LEFT     &&
            direct != this.BOTTOM   &&
            direct != this.RIGHT
        ) {
            throw SyntaxError("direct is incorrect");
        }
    }

    _game       = null;
    _body       = [];
    _direct     = null;
    _is_alive   = false;
    
    get length () {return this._body.length;}

    constructor (game_obj, direct = Actor.LEFT) {
        if ( !(game_obj instanceof Game) ) throw TypeError('"game_obj" arg of the "new Actor()" init must have Game type.');
        this._game          = game_obj;
        this._is_alive      = true;
        
        try {
            this._direct    = direct;
        } catch (error) {
            switch (error.name) {
                case "SyntaxError":
                    throw SyntaxError('"direct" arg of the "new Actor" init is incorrect.');
                default:
                    throw error;
            }
        }
    }

    dead () {
        this._is_alive  = false;
    }

    move () {
        if (!this._is_alive) return;

        let grow            = false;
        const front_block   = this.see();

        switch (front_block) {
            case Area.APPLE:
                grow = true;
                break;
            case Area.WALL:
            case Area.SNAKE:
                this.dead();
                return;
        }

        let offset  = [0, 0];

        switch (this._direct) {
            case Actor.FORWARD:
                offset[0]   = -1;
                break;
            case Actor.RIGHT:
                offset[1]   = 1;
                break;
            case Actor.BOTTOM:
                offset[0]   = 1;
                break;
            case Actor.LEFT:
                offset[1]   = -1;
                break;
        }

        const new_head_pos  = [this._body[0][0] + offset[0], this._body[0][1] + offset[1]];
        this._body.unshift(new_head_pos);
        
        if (grow) return;
        this._body.pop();
    }

    see () {
        return this._game.getBlockInFrontOfHead();
    }

    setDirection (direct) {
        try {
            this._direct    = direct;
        } catch (error) {
            switch (error.name) {
                case "SyntaxError":
                    throw SyntaxError('"direct" arg of the Actor.setDirection() call is incorrect.');
                default:
                    throw error;
            }
        }
    }

    getDirection () {
        return this._direct;
    }

    forEach (start_pos, func) {
        if ( !Array.isArray(start_pos) ) throw TypeError('"start_pos" arg of the Actor.reduce() must be array.');
        if ( start_pos.length != 2 ) throw SyntaxError('"start_pos" arg of the Actor.reduce() must have 2 elements like array.');

        let absolute_x  = start_pos[x];
        let absolute_y  = start_pos[y];

        this._body.reduce( (accumulator, block, index, body) => {
            const cur_x     = block[0];
            const cur_y     = block[1];
            const prev_x    = body[index -1][0];
            const prev_y    = body[index -1][1];

            const x_offset  = prev_x - cur_x;
            const y_offset  = prev_y - cur_y;

            absolute_x += x_offset;
            absolute_y += y_offset;

            func(absolute_x, absolute_y);
        } );
    }
}