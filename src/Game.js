import { Physics } from 'phaser'
import Player from './Player'
import World from './World'

export default class Game {
	
	create() {
		const game = this.game,
			  add = this.add;

		this.stage.backgroundColor = '#6595ED';

		game.physics.startSystem(Physics.ARCADE);

		const player = this.player = new Player(game, 400, 300);
		add.existing(player);

		const world = this.world = new World(game);
	}
}
