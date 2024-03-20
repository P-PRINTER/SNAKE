class Area {

    _width  = null;
    _height = null;

    _area           = [];
    _free_blocks    = [];

    constructor (width, height) {
        this._width     = width;
        this._height    = height;

        for (let row = 0; row < this._height; row++) {
            this._area.push( new Array(this._width) );

            for (let col = 0; col < this._area[row].length; col++) {
                this._area[row][col] = null;
                this._free_blocks.push(row);
                this._free_blocks.push(col);
            }
        }
    }
}