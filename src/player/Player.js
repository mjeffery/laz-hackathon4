import { Sprite, Physics, Point } from 'phaser'

import StateMachine from '../StateMachine'
import { LEFT, RIGHT, JUMP } from '../Input'
import Timer from '../Timer'
import BurningEffect from '../BurningEffect'

import { makeMask } from '../utils'
import * as Layers from '../layers'

export const START = 'start';
export const STANDING = 'standing';
export const WALKING = 'walking';
export const JUMPING = 'jumping';
export const FALLING = 'falling';
export const BURNING = 'burning'; //TODO not happy about this-- maybe a second set of parent states?

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
    }, 
    burn: {
        drag: 100,
        bounce: new Point(0.4, 0.9),
        offset: new Point(0, -16)
    }
}

export default class Player extends Sprite {

    static preload(load) {
        load.spritesheet('player', 'assets/spritesheet/player.png', 64, 64);
        load.audio('jump', 'assets/audio/spring.mp3');
        load.audio('land', 'assets/audio/hop.mp3');
        load.audio('thud', 'assets/audio/thud.mp3');
    }

    constructor(game, x, y, controls) {
        super(game, x, y, 'player')
        this.controls = controls;

        this.state = new StateMachine(START); 

        this.initControls();
        this.initGraphics();
        this.initAudio();
        this.initPhysics();

        this.updateState();
    }

    initControls() {
        this.controlsActive = true;

        this.controlVelocity = 0;
        this.wantsToJump = false;
        this.jumping = false;

        this.jumpTimer = new Timer(this.game);
        this.jumpPressTimer = new Timer(this.game);
        this.jumpFudgeTimer = new Timer(this.game);
    }

    initPhysics() {
        this.game.physics.enable(this, Physics.ARCADE);

        this.body.setSize(32, 64, 16, 0);
        this.body.gravity.y = Constants.gravity;
        this.body.maxVelocity.setTo(Constants.maxSpeed, 10 * Constants.maxSpeed);
        this.body.collideWorldBounds = true;

        this._collisionMask = makeMask(Layers.ALL)
    }

    initGraphics() {
        this.anchor.setTo(0.5, 1);

        this.animations.add('stand', [3]);
        this.animations.add('walk', [0, 1, 2, 3], Constants.walk.animRate, true);
        this.animations.add('jump', [4]);
        this.animations.add('fall', [5]);
        this.animations.add('hurt', [6]);
        this.animations.add('pose', [7]);
    }

    initAudio() {
        this.sounds = {
            jump: this.game.add.audio('jump'),
            land: this.game.add.audio('land'),
            thud: this.game.add.audio('thud')
        }
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
        const controls = this.controls;

        this.controlVelocity = 0;
        this.wantsToJump = false;

        if(this.controlsActive) {
            if(controls[LEFT].isDown) {
                this.controlVelocity = -1;
            } else if(controls[RIGHT].isDown) {
                this.controlVelocity = 1;
            }
            
            this.wantsToJump = controls[JUMP].isDown;
        }
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
                    this.sounds.land.play();
                    if(this.controlVelocity != 0) {
                        this.walk();
                    } else {
                        this.stand();
                    }
                } 
            break;

            case BURNING:
                this.burningEffect.think();
                if(this.body.velocity.x < 0) {
                    this.scale.x = -1;
                    this.facing = 'left';
                } else {
                    this.scale.x = 1;
                    this.facing = 'right';
                }
                break;
        }
    }

    updateMovement() {
        this.body.acceleration.x = Constants.walk.acceleration * this.controlVelocity;

        let drag = 0;
        if(this.burning) {
            drag = Constants.burn.drag;
        } else {
            drag = this.onFloor() ? Constants.walk.drag : Constants.jump.drag;
        }
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
        let anim = this.winning ? 'pose' : 'stand';
        this.animations.play(anim);
        this.jumping = false;
    }

    jump() {
        this.state.change(JUMPING);

        this.animations.play('jump');
        this.sounds.jump.play();

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

    win() {
        this.controlsActive = false;
        this.winning = true;
        this._collisionMask = makeMask(Layers.TERRAIN);
        if(this.state.current === STANDING)
            this.animations.play('pose');
    }

    burn() {
        this.state.change(BURNING);
        this.animations.play('hurt');
        this.controlsActive = false;
        this._collisionMask = makeMask(Layers.TERRAIN);
        this.body.bounce.copyFrom(Constants.burn.bounce);
        this.burning = true;

        const effect = this.burningEffect = new BurningEffect(this.game, this, Constants.burn.offset);
    }

    onFloor() {
        return this.body.onFloor();
    }

    [Layers.getCollisionMask]() {
        return this._collisionMask; 
    }
}
