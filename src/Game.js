import { Physics } from 'phaser'
import Input from './Input'
import Player from './Player'
import World from './World'

export default class Game {
	
	create() {
		const game = this.game,
			  add = this.add;

		this.stage.backgroundColor = '#6595ED';

		game.physics.startSystem(Physics.ARCADE);

		const input = this.input = new Input(game);
		const player = this.player = new Player(game, 400, 300, input);
		add.existing(player);

        game.renderer.renderSession.roundPixels = true;
		game.camera.follow(player);
        //game.camera.deadzone = new Rectangle(0, 0, 0, 0);

		const world = this.world = new World(game);
	}

	update() {
		const player = this.player,
			  world = this.world;

		this.world.collide(this.player);
		player.think();
	}
}
