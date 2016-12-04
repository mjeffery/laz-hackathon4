import { Tilemap } from 'phaser'

let anonymousLevelNumber = 1;

export default class Level {

    constructor(data) {
        this._name = data.name || `Level ${anonymousLevelNumber++}`;
        this._tilesetUrl = data.tileset;
        this._tilemapUrl = data.tilemap;
        this._tilesetName = data.tilesetName;
        this._layerName = data.layerName || 'Tile Layer 1';
        this._objectLayerName = data.objectLayerName || 'Object Layer 1';
    }

    get name() { return this._name }
    get tilesetUrl() { return this._tilesetUrl }
    get tilemapUrl() { return this._tilemapUrl }
    get tilesetName() { return this._tilesetName }
    get layerName() { return this._layerName }
    get objectLayerName() { return this._objectLayerName }
    get tileset() { return `${this.name} tileset` }
    get tilemap() { return `${this.name} tilemap` }

    preload(load) {
        load.image(this.tileset, this.tilesetUrl);
        load.tilemap(this.tilemap, this.tilemapUrl, null, Tilemap.TILED_JSON);
    }
}

