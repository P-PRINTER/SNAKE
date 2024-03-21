export class Area {

    static SNAKE    = Symbol();
    static APPLE    = Symbol();
    static WALL     = Symbol();

    static validateItem (item_id) {
        if (item_id != this.SNAKE && item_id != this.APPLE) throw SyntaxError("invalid item ID");
    }

    _width  = null;
    _height = null;
    get size () {return this._width * this._height;}

    _area           = [];
    _free_blocks    = new Map();

    constructor (width, height) {
        if ( typeof(width) != "number" && !Number.isInteger(width) )  throw Error("\"width\" arg of the \"new Area()\" call must be integer.");
        if ( typeof(height) != "number" && !Number.isInteger(height) )  throw Error("\"height\" arg of the \"new Area()\" call must be integer.");
        if (width <= 0) throw Error("\"width\" arg of the \"new Area()\" call must be more than 0.");
        if (height <= 0) throw Error("\"height\" arg of the \"new Area()\" call must be more than 0.");

        this._width     = width;
        this._height    = height;

        for (let row = 0; row < this._height; row++) {
            this._area.push( new Array(this._width) );
            this._free_blocks.set(row, []);

            for (let col = 0; col < this._area[row].length; col++) {
                this._area[row][col] = null;
                this._free_blocks.get(row).push(col);
            }
        }
    }

    generateAppleOnRandomPos () {
        const apple_pos_x   = Math.round( Math.random() * (this._free_blocks.size -1) );
        const apple_pos_y   = Math.round( Math.ramdom() * (this._free_blocks.get(apple_pos_x).length -1) );

        this.setBlock(Area.APPLE, apple_pos_x, apple_pos_y, false);
        return [apple_pos_x, apple_pos_y];
    }

    setBlock (item_id, row, col, needs_validation = true) {
        if (needs_validation) this._validatePos(row, col, "Area.setBlock()");

        try {
            Area.validateItem(item_id);
        } catch (error) {
            switch (error.name) {
                case "SyntaxError":
                    throw SyntaxError('"item_id" arg of Area.setBlock() call is incorrect.');
                default:
                    throw error;
            }
        }
        
        if ( !this.busyBlock(row, col, false) ) return false;
        this._area[row][col] = item_id;

        return true;
    }
    clearBlock (row, col, needs_validation = true) {
        if (needs_validation) this._validatePos(row, col, "Area.clearBlock()");

        if ( !this.freeBlock(row, col, false)  ) return false;
        this._area[row][col] = null;

        return true;
    }
    getBlock (row, col) {
        try {
            this._validatePos(row, col, "Area.getBlock()");
            return this._area[row, col];
        } catch (error) {
            switch (error.name) {
                case "RangeError":
                    return Area.WALL;
                default:
                    throw error;
            }
        }
    }

    busyBlock (row, col, needs_validation = true) {
        if (needs_validation) this._validatePos(row, col, "Area.busyBlock()");

        if ( !this.checkBlockForFreeness(row, col, false) ) return false;
        delete this._free_blocks.get(row)[col];
        return true;
    }

    freeBlock (row, col, needs_validation = true) {
        if (needs_validation) this._validatePos(row, col, "Area.freeBlock()");

        if ( this.checkBlockForFreeness(row, col, false) ) return false;
        this._free_blocks.get(row).push(col);
        return true;
    }

    checkBlockForFreeness (row, col, needs_validation = true) {
        if (needs_validation) this._validatePos(row, col, "Area.checkBlockForFreeness()");

        if ( !(row in this._free_blocks) ) return false;
        return this._free_blocks.get(row).includes(col);
    }

    _validatePos (row, col, func_name) {
        if ( typeof(func_name) != "string" ) throw TypeError('"func_name" arg of Area._validatePos() must be string.');

        if ( !Number.isInteger(row) )  throw TypeError(`"row" arg of ${func_name} must be integer."`);
        if (row >= this._height || row < 0) throw RangeError(`"row" arg of ${func_name} has value that out the game area.`);

        if ( !Number.isInteger(col) )  throw TypeError(`"col" arg of ${func_name} must be integer."`);
        if (col >= this._width || col < 0) throw RangeError(`"col" arg of ${func_name} has value that out the game area.`);
    }
}