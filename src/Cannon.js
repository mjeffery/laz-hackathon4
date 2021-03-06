import { Sprite, Point, Physics } from 'phaser'
import Timer from './Timer'

export const Constants = {
    power: {
        min: 300,
        max: 1000,
        default: 500 
    },
    shotDelay: 200
}

const temp = new Point();

export default class Cannon extends Sprite {

    static preload(load) {
        load.image('cannon', 'assets/img/cannon.png');
        load.audio('cannon', 'assets/audio/cannon.mp3');
    }

    constructor(game, x, y) {
        super(game, x, y, 'cannon');
        this.timer = new Timer(game);

        //TODO how to correct for rotations from Tiled?
        game.physics.enable(this, Physics.ARCADE); 

        this.sound = game.add.audio('cannon');
    }

    collide(sprite) {
        if(this.timer.isDone()) {
            this.timer.setTime(Constants.shotDelay);
            
            let power = this.power || Constants.power.default; 
            power = this.game.math.clamp(power, Constants.power.min, Constants.power.max);

            this.sound.play();
            this.game.physics.arcade.velocityFromAngle(this.angle, power, temp);
            Point.add(sprite.body.velocity, temp, sprite.body.velocity);
        }

        return false;
    }

    think() {
        this.timer.update();
    }
}
