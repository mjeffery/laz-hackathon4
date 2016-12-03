import { Tilemap, Physics } from 'phaser'
import levels from './levels'

const Symbols = {
    onCollideLava: Symbol('onCollideLava')
}

export default class World {
	
	static preload(load) {
	}

	constructor(game) {
		this.game = game;
        
        const level = levels.get(game.data.currentLevel);
		const tilemap = game.add.tilemap(level.tilemap);
		tilemap.addTilesetImage(level.tilesetName, level.tileset);

		const layer = this.layer = tilemap.createLayer(level.layerName);
		layer.resizeWorld();
		game.physics.enable(layer, Physics.ARCADE);
		
		tilemap.setCollision([2,3,4]);

        tilemap.setTileIndexCallback(4, this._hitLava, this);
	}

	collide(sprite) {
		this.game.physics.arcade.collide(this.layer, sprite);
	}

    _hitLava(sprite, tile) {
        const callback = sprite[Symbols.onCollideLava] 
        if(callback && (typeof callback === 'function')) {
            callback.call(sprite, tile);
        }

        return true;
    }
}

Object.assign(World, Symbols)
