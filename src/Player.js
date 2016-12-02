import { Sprite, Physics } from 'phaser'

export default class Player extends Sprite {
	
	static preload(load) {
		load.image('player', 'assets/img/player.png')
	}

	constructor(game, x, y) {
		super(game, x, y, 'player');

		this.anchor.setTo(0.5,1);
		
		game.physics.enable(this, Physics.ARCADE);
	}

	think() {
	
	}	
}
