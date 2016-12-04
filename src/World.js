import { Tilemap, Physics, Point, Signal } from 'phaser'

import Collectible from './Collectible'
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

    _processTilemap(tilemap) {
        tilemap.setTileIndexCallback(Tiles.LAVA, this._hitLava, this);

        for(let x = 0; x < tilemap.width; x++) {
            for(let y = 0; y < tilemap.height; y++) {
                let tile = tilemap.getTile(x, y); 

                switch(tile.index) {
                    case Tiles.START:
                        let px = x * Math.round(tilemap.tileWidth + tilemap.tileWidth / 2),
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

