import { Tilemap, Physics } from 'phaser'

export default class World {
	
	static preload(load) {
		load.image('test-tileset', 'assets/img/test-tileset.png');
		load.tilemap('test-map', 'assets/tilemap/test-map.json', null, Tilemap.TILED_JSON);
	}

	constructor(game) {
		this.game = game;

		const tilemap = game.add.tilemap('test-map');
		tilemap.addTilesetImage('test-tileset', 'test-tileset');

		const layer = this.layer = tilemap.createLayer('Tile Layer 1');
		layer.resizeWorld();
		game.physics.enable(layer, Physics.ARCADE);
		
		tilemap.setCollision([2,3,4]);
	}

	collide(sprite) {
		this.game.physics.arcade.collide(this.layer, sprite);
	}

}
