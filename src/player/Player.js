import { Sprite, Physics } from 'phaser'

import StateMachine from '../StateMachine'
import { LEFT, RIGHT, JUMP } from '../Input'
import Timer from '../Timer'
import World from '../World'

export const START = 'start';
export const STANDING = 'standing';
export const WALKING = 'walking';
export const JUMPING = 'jumping';
export const FALLING = 'falling';

const Constants = {
    gravity: 1200,
    maxSpeed: 500,
    jump: {
        speed: -450,
        duration: 175,
        repeatDelay: 750,
        fudgeTime: 100,
        drag: 3600 
    },
    walk: {
        acceleration: 1800,
        drag: 2900, //1400,
        animRate: 7
    }
}

export default class Player extends Sprite {

    static preload(load) {
        load.spritesheet('player', 'assets/spritesheet/test player.png', 32, 64);
    }

    constructor(game, x, y, input) {
        super(game, x, y, 'player')
        this.input = input;

        this.state = new StateMachine(START); 

        this.initControls();
        this.initPhysics();
        this.initGraphics();

        this.updateState();
    }

    initControls() {
        this.controlVelocity = 0;
        this.wantsToJump = false;
        this.jumping = false;

        this.jumpTimer = new Timer(this.game);
        this.jumpPressTimer = new Timer(this.game);
        this.jumpFudgeTimer = new Timer(this.game);
    }

    initPhysics() {
        this.game.physics.enable(this, Physics.ARCADE);

        this.body.gravity.y = Constants.gravity;
        this.body.maxVelocity.setTo(Constants.maxSpeed, 10 * Constants.maxSpeed);
        this.body.collideWorldBounds = true;

        this.collidesWithWorld = true;
    }

    initGraphics() {
        this.anchor.setTo(0.5, 1);

        this.animations.add('stand', [3]);
        this.animations.add('walk', [0, 1, 2, 3], Constants.walk.animRate, true);
        this.animations.add('jump', [4]);
        this.animations.add('fall', [5]);
    }

    think() {
        this.jumpTimer.update();
        this.jumpPressTimer.update();
        this.jumpFudgeTimer.update();

        this.updateControls();
        this.updateState();

        this.updateMovement();
    }

    updateControls() {
        const input = this.input;

        this.controlVelocity = 0;
        this.wantsToJump = false;

        //if(this.inputEnabled) {
            if(input[LEFT].isDown) {
                this.controlVelocity = -1;
            } else if(input[RIGHT].isDown) {
                this.controlVelocity = 1;
            }
            
            this.wantsToJump = input[JUMP].isDown;
        //}
    }

    updateState() {
        let state;
        do {
            state = this.state.current;
            this.runState();
        } while(this.state.current !== state);
    }

    runState() {
        switch(this.state.current) {
            case START:
                if(this.onFloor()) {
                    if(this.controlVelocity != 0) {
                        this.walk();
                    } else {
                        this.stand();
                    }
                } else {
                    this.fall();
                    this.jumpFudgeTimer.setTime(0); //special case reset
                }
            break;

            case STANDING:
                if(this.wantsToJump && this.jumpTimer.isDone()) {
                    this.jump();
                } else if(!this.onFloor()) {
                    this.fall();
                } else if(this.controlVelocity != 0) {
                    this.walk();
                } 
            break;

            case WALKING:
                if(this.wantsToJump && this.jumpTimer.isDone()) {
                    this.jump();
                } else if(!this.onFloor()) {
                    this.fall();
                } else if(this.controlVelocity == 0) {
                    this.stand();
                }
            break;

            case JUMPING:
                if(!this.jumping && this.body.velocity.y >= 0) {
                    this.fall();
                }
            break;

            case FALLING:
                if(this.wantsToJump && 
                   !this.jumpFudgeTimer.isDone() &&
                   this.jumpTimer.isDone()) 
                {
                    this.jump();
                } else if(this.onFloor()) {
                    if(this.controlVelocity != 0) {
                        this.walk();
                    } else {
                        this.stand();
                    }
                } 
            break;
        }
    }

    updateMovement() {
        this.body.acceleration.x = Constants.walk.acceleration * this.controlVelocity;

        let drag = this.onFloor() ? Constants.walk.drag : Constants.jump.drag;
        this.body.drag.setTo(drag, 0);

        if(this.controlVelocity < 0 && this.facing != 'left') {
            this.facing = 'left';
            this.scale.x = -1;
        } else if(this.controlVelocity > 0 && this.facing != 'right') {
            this.facing = 'right';
            this.scale.x = 1;
        }

        if(this.jumping) {
            if(!this.wantsToJump || this.jumpPressTimer.isDone()) {
                this.jumping = false;
                //if(this.jumpPressTimer.isDone()) {
                //   this.body.velocity.y = 0;                    
                //}
            } else {
                this.body.velocity.y = Constants.jump.speed;
            }
        }
    }

    stand() {
        this.state.change(STANDING);
        this.animations.play('stand');
        this.jumping = false;
    }

    jump() {
        this.state.change(JUMPING);
        this.animations.play('jump');

        this.jumpTimer.setTime(Constants.jump.repeatDelay);
        this.jumpPressTimer.setTime(Constants.jump.duration);
        this.jumping = true;
    }

    fall() {
        this.state.change(FALLING);
        this.animations.play('fall');
        this.jumpFudgeTimer.setTime(Constants.jump.fudgeTime);
        this.jumping = false;
    }

    walk() {
        this.state.change(WALKING);
        this.animations.play('walk');
    }

    onFloor() {
        return this.body.onFloor();
    }

    [World.onCollideCollectible](coin) {
        //TODO this is crazy...
    }
}
