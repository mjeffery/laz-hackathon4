import { Tilemap, Physics, Point, Signal } from 'phaser'

import Collectible from './Collectible'
import Cannon from './Cannon'
import { testMask } from './utils'

import levels from './levels'
import * as Layers from './layers'

const Tiles = {
    EMPTY: 1,
    SOLID: 2,
    LAVA: 4,
    START: 5,
    EXIT: 6
}

class WorldEvents {

    constructor(game) {
        Object.assign(this, {
            onTouchLava: new Signal(),
            onTouchExit: new Signal(),
            onTouchCollectible: new Signal()
        })
    } 
}

export default class World {

    static preload(load) {
        load.image('exit-sign', 'assets/img/exit sign.png')
        load.image('danger-sign', 'assets/img/danger sign.png');
    }
	
	constructor(game) {
		this.game = game;
        this.start = new Point(0, 0);
        this.events = new WorldEvents();

        const level = levels.get(game.data.currentLevel);
		const tilemap = game.add.tilemap(level.tilemap);
		tilemap.addTilesetImage(level.tilesetName, level.tileset);

		const layer = this.layer = tilemap.createLayer(level.layerName);
		layer.resizeWorld();
		game.physics.enable(layer, Physics.ARCADE);
		
		tilemap.setCollision([2,3,4]);

        this._processTilemap(tilemap);

        const collectibles = this.collectibles = game.add.group();
        tilemap.createFromObjects(level.objectLayerName, 'coin', undefined, undefined, true, false, collectibles, Collectible);

        const doodads = this.doodads = game.add.group(doodads);
        tilemap.createFromObjects(level.objectLayerName, 'exit sign', 'exit-sign', undefined, true, false, doodads);
        tilemap.createFromObjects(level.objectLayerName, 'danger sign', 'danger-sign', undefined, true, false, doodads);

        const objects = this.objects = game.add.group(objects);
        tilemap.createFromObjects(level.objectLayerName, 'cannon', undefined, undefined, true, false, objects, Cannon);
	}

	collide(sprite) {
        const mask = Layers.getMask(sprite)

        //TODO process groups recursively?
        if(testMask(mask, Layers.TERRAIN)) {
            //TODO must collide with terrain to collide with lava or exit.. will need to fix this...
            this.game.physics.arcade.collide(this.layer, sprite);
        }
        if(testMask(mask, Layers.COLLECTIBLE)) {
            this.game.physics.arcade.collide(sprite, this.collectibles, undefined, this._hitCollectible, this);
        }
        if(testMask(mask, Layers.OBJECTS)) {
            this.game.physics.arcade.collide(sprite, this.objects, undefined, this._hitObject, this);
        }
	}

    _hitLava(sprite, tile) {
        const mask = Layers.getMask(sprite)
        if(testMask(mask, Layers.LAVA)) {
            this.events.onTouchLava.dispatch(sprite, tile);
        }

        return true;
    }

    _hitExit(sprite, tile) {
        const mask = Layers.getMask(sprite)
        if(testMask(mask, Layers.EXIT)) {
            this.events.onTouchExit.dispatch(sprite, tile);
        }
        
        return false;
    }

    _hitCollectible(sprite, collectible) {
        this.events.onTouchCollectible.dispatch(sprite, collectible);
        return false;
    }

    _hitObject(sprite, object) {
        const callback = object.collide; //TODO symbol?
        if(callback && (typeof callback === 'function')) {
            return object.collide(sprite);
        }

        return true;
    }

    _processTilemap(tilemap) {
        tilemap.setTileIndexCallback(Tiles.LAVA, this._hitLava, this);

        for(let x = 0; x < tilemap.width; x++) {
            for(let y = 0; y < tilemap.height; y++) {
                let tile = tilemap.getTile(x, y); 

                switch(tile.index) {
                    case Tiles.START:
                        let px = Math.round(x * tilemap.tileWidth + tilemap.tileWidth / 2),
                            py = (y + 1) * tilemap.tileHeight;

                        this.start.setTo(px, py);
                        tilemap.putTile(Tiles.EMPTY, x, y);
                    break;

                    case Tiles.EXIT:
                        tilemap.setTileLocationCallback(x, y, 1, 1, this._hitExit, this);
                        tilemap.putTile(Tiles.EMPTY, x, y);
                    break;
                }
            }
        }

    }
}

