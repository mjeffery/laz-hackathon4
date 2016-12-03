import Level from './Level'

const levelData = [
    {
        name: 'level 1-1',
        tileset: 'assets/img/test-tileset.png',
        tilemap: 'assets/tilemap/test-map.json',
        tilesetName: 'test-tileset',
        layerName: 'Tile Layer 1'
    }
]

class Levels {

    constructor(levelData) {
        this._levels = levelData.map( data => new Level(data) )
    }

    get(index) {
        return this._levels[index];
    }
}

const levels = new Levels(levelData);

export default levels;
