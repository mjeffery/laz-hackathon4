import { Physics } from 'phaser'

import TransitionState from './TransitionState'
import Input from './Input'
import Player from './player/Player'
import World from './World'
import CollectedEffect from './CollectedEffect'

const Constants = {
    fadeInDelay: 300,
    fadeInDuration: 750
}

export default class Game extends TransitionState {
	
	create() {
		const game = this.game,
			  add = this.add;

		this.stage.backgroundColor = '#6595ED';

		game.physics.startSystem(Physics.ARCADE);

		const world = this.world = new World(game);

		const input = this.input = new Input(game);
		const player = this.player = new Player(game, world.start.x, world.start.y, input);

		add.existing(player);

        game.renderer.renderSession.roundPixels = true;
		game.camera.follow(player);
        //game.camera.deadzone = new Rectangle(0, 0, 0, 0);
        
        const effect = this.collectedEffect = new CollectedEffect(game)
        world.events.onTouchCollectible.add( (sprite, coin) => {
            coin.kill()
            effect.collect(coin)
        });

        world.events.onTouchExit.add( (sprite, tile) => {
            
        });

        this.fadeIn(Constants.fadeInDelay, Constants.fadeInDuration);
	}

	update() {
		const player = this.player,
			  world = this.world;

		world.collide(player);
		player.think();
        world.think();

        this.collectedEffect.think();
	}
}
