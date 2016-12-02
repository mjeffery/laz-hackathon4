import { Tilemap } from 'phaser'

export default class World {
	
	static preload(load) {
		load.image('test-tileset', 'assets/img/test-tileset.png');
		load.tilemap('test-map', 'assets/tilemap/test-map.json', null, Tilemap.TILED_JSON);
	}

	constructor(game) {
		this.game = game;

		const tilemap = game.add.tilemap('test-map');
		tilemap.addTilesetImage('test-tileset', 'test-tileset');

		const layer = tilemap.createLayer('Tile Layer 1');
		layer.resizeWorld();
	}

}
