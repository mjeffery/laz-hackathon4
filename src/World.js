import { Tilemap, Physics, Point } from 'phaser'

import Collectible from './Collectible'
import CollectibleEffect from './CollectedEffect'
import levels from './levels'

const Tiles = {
    EMPTY: 1,
    SOLID: 2,
    LAVA: 4,
    START: 5,
    EXIT: 6
}

const Symbols = {
    onCollideLava: Symbol('onCollideLava'),
    onCollideExit: Symbol('onCollideExit'),
    onCollideCollectible: Symbol('onCollideCollectible')
}

export default class World {
	
	static preload(load) {
	}

	constructor(game) {
		this.game = game;
        this.start = new Point(0, 0);

        
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
        if(sprite.collidesWithWorld) {
            this.game.physics.arcade.collide(this.layer, sprite);
            this.game.physics.arcade.collide(sprite, this.collectibles, undefined, this._hitCollectible, this);
        }
	}

    _hitLava(sprite, tile) {
        const callback = sprite[Symbols.onCollideLava] 
        if(callback && (typeof callback === 'function')) {
            callback.call(sprite, tile);
        }

        return true;
    }

    _hitExit(sprite, tile) {
        const callback = sprite[Symbols.onCollideExit]
        if(callback && (typeof callback === 'function')) {
            callback.call(sprite, tile)
        }

        return false;
    }

    _hitCollectible(sprite, collectible) {
        const callback = sprite[Symbols.onCollideCollectible]
        if(callback && (typeof callback == 'function')) {
            callback.call(sprite, collectible);
            Collectible.onCollected.dispatch(collectible);
        }

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

Object.assign(World, Symbols)
