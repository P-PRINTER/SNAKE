class Area {

    _width  = null;
    _height = null;

    _area           = [];
    _free_blocks    = {};

    constructor (width, height) {
        if ( typeof(width) != "number" && !Number.isInteger(width) )  throw Error("\"width\" arg of the \"new Area()\" call must be integer.");
        if ( typeof(height) != "number" && !Number.isInteger(height) )  throw Error("\"height\" arg of the \"new Area()\" call must be integer.");
        if (width <= 0) throw Error("\"width\" arg of the \"new Area()\" call must be more than 0.");
        if (height <= 0) throw Error("\"height\" arg of the \"new Area()\" call must be more than 0.");

        this._width     = width;
        this._height    = height;

        for (let row = 0; row < this._height; row++) {
            this._area.push( new Array(this._width) );
            this._free_blocks[row] = [];

            for (let col = 0; col < this._area[row].length; col++) {
                this._area[row][col] = null;
                this._free_blocks[row].push(col);
            }
        }
    }

    checkBlockForFreeness (row, col) {
        if ( typeof(row) != "number" && !Number.isInteger(row) )  throw Error("\"row\" arg of Area.checkBlockForFreeness() must be integer.");
        if ( typeof(col) != "number" && !Number.isInteger(col) )  throw Error("\"col\" arg of Area.checkBlockForFreeness() must be integer.");
        if (row >= this._height || row < 0) throw Error("\"row\" arg of Area.checkBlockForFreeness() has value out the game area.");
        if (col >= this._width || col < 0) throw Error("\"col\" arg of Area.checkBlockForFreeness() has value out the game area.");

        if ( !(row in this._free_blocks) ) return false;
        return this._free_blocks[row].includes(col);
    }

    busyBlock (row, col) {
        if ( typeof(row) != "number" && !Number.isInteger(row) )  throw Error("\"row\" arg of Area.busyBlock() must be integer.");
        if ( typeof(col) != "number" && !Number.isInteger(col) )  throw Error("\"col\" arg of Area.busyBlock() must be integer.");
        if (row >= this._height || row < 0) throw Error("\"row\" arg of Area.busyBlock() has value out the game area.");
        if (col >= this._width || col < 0) throw Error("\"col\" arg of Area.busyBlock() has value out the game area.");

        if ( !this.checkBlockForFreeness(row, col) ) return false;
        delete this._free_blocks[row][col];
        return true;
    }

    freeBlock (row, col) {
        if ( typeof(row) != "number" && !Number.isInteger(row) )  throw Error("\"row\" arg of Area.freeBlock() must be integer.");
        if ( typeof(col) != "number" && !Number.isInteger(col) )  throw Error("\"col\" arg of Area.freeBlock() must be integer.");
        if (row >= this._height || row < 0) throw Error("\"row\" arg of Area.freeBlock() has value out the game area.");
        if (col >= this._width || col < 0) throw Error("\"col\" arg of Area.freeBlock() has value out the game area.");

        if ( this.checkBlockForFreeness(row, col) ) return false;
        this._free_blocks[row].push(col);
        return true;
    }
}