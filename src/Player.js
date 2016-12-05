import { Sprite, Physics, Signal, Events } from 'phaser'

import { LEFT, RIGHT, JUMP } from './Input'
import Timer from './Timer'
import World from './World'
import StateMachine from './StateMachine'

export const Constants = {
	gravity: 450,
	walkSpeed: 350,
    jump: {
        speed: -400,
        repeatDelay: 750,
        fudgeTime: 100
    },
    lavaDeath: {
        jumpSpeed: -400,
        waitTime: 1500
    },
    walkRate: 6
}

class PlayerEvents extends Events {
    constructor(sprite) {
        super(sprite);

        this.onDying = new Signal();
        this.onDead = new Signal();
    }
}

export default class Player extends Sprite {

	static preload(load) {
        load.spritesheet('player', 'assets/spritesheet/player.png', 64, 64);
	}

	constructor(game, x, y, controls) {
		super(game, x, y, 'player');
        this.events = new PlayerEvents(this);
		this.controls = controls;
        this.state = new StateMachine('start');
		this.facing = 'right';
		this.jumpTimer = new Timer(game);
        this.jumpFudgeTimer = new Timer(game);

        this.animations.add('stand', [4]);
        this.animations.add('walk', [1, 2, 3, 2], Constants.walkRate, true);
        this.animations.add('jump', [5]);
        this.animations.add('fall', [6]);

        this.animations.play('stand');

		this.anchor.setTo(0.5,1);

		game.physics.enable(this, Physics.ARCADE);

        this.body.setSize(32, 64, -16, -64);
		this.body.gravity.set(0, Constants.gravity);
		this.body.collideWorldBounds = true;
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
			body.velocity.y = Constants.jump.speed
			jumpTimer.setTime(Constants.jump.repeatDelay)
		}	
	}

    updateState() {
        const input = this.input,
              jumpTimer = this.jumpTimer;

        switch(this.state.current) {
            case 'start':
                if(!this.onFloor()) 
                    this.fall();
                else
                   this.stand();
                break; 

            case 'standing':
                if(input[LEFT].isDown) {
                    this.walkLeft();
                } else if(input[RIGHT].isDown) {

                } 
                break;

            case 'walking':
                break;

            case 'falling':
                break;

            
        }
    }

    updateMovement() {
        this.body.velocity.x = 0;
        if(input[LEFT].isDown) {
            this.left();
        } else if(input[RIGHT].isDown) {
            this.right();
        } else if(this.canJump())  {
            this.jump(); 
        }
    }

    stand() {
        this.state.change('standing');
        this.animations.play('stand');j
    }

    left() {
        //let anim = this.onFloor() ? 
        
    }

    onFloor() {
        return this.body.onFloor(); //TODO add a small timer so you can jump soon after floor
    }

    canJump() {
        const input = this.input,
              jumpTimer = this.jumpTimer,
              jumpFudgeTimer = this.jumpFudgeTimer;

        return input[JUMP].isDown && 
               (this.onFloor() || !jumpFudgeTimer.isDone()) && 
               jumpTimer.isDone();
    }

    cantJumpNow() {
       this.jump 
    }

    startDyingFromLava() {
        const body = this.body;
              
        this.events.onDying.dispatch();
        this.disableInput = true;
        this.collidesWithWorld = false;

        body.velocity.x = 0;
        body.velocity.y = Constants.lavaDeath.jumpSpeed;
        body.collideWorldBounds = false;

        this.game.camera.unfollow();
        this.game.time.events.add(Constants.lavaDeath.waitTime, this.stopDyingFromLava, this)
    }

    stopDyingFromLava() {
        this.events.onDead.dispatch();
    }

    [World.onCollideLava]() {
       this.startDyingFromLava(); 
    }

    [World.onCollideExit]() {
        console.log("exit!")
    }
}
