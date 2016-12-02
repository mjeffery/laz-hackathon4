import { Sprite, Physics } from 'phaser'
import { LEFT, RIGHT, JUMP } from './Input'
import Timer from './Timer'

export const Constants = {
	gravity: 180,
	walkSpeed: 350,
	jumpSpeed: -400 
}

export default class Player extends Sprite {

	static preload(load) {
		load.image('player', 'assets/img/player.png')
	}

	constructor(game, x, y, input) {
		super(game, x, y, 'player');
		this.input = input;
		this.facing = 'right';
		this.jumpTimer = new Timer(game);

		this.anchor.setTo(0.5,1);

		game.physics.enable(this, Physics.ARCADE);

		this.body.gravity.set(0, Constants.gravity);
	}

	think() {
		const body = this.body,
			  input = this.input,
			  jumpTimer = this.jumpTimer;

		jumpTimer.update()

		body.velocity.x = 0;
		if(input[LEFT].isDown) {
			body.velocity.x = -Constants.walkSpeed
			
			if(this.facing !== 'left') {
				this.scale.x = -1
				this.facing = 'left'
			}
		}
		else if (input[RIGHT].isDown) {
			body.velocity.x = Constants.walkSpeed
			
			if(this.facing !== 'right') {
				this.scale.x = 1
				this.facing = 'right'
			}
		}

		if(input[JUMP].isDown && body.onFloor() && jumpTimer.isDone()) {
			body.velocity.y = Constants.jumpSpeed
			jumpTimer.setTime(750)
		}	
	}
}
