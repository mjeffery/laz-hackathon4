import { Sprite, Color } from 'phaser'

export const Constants = {
    min: Color.hexToRGB('#ffff00'),
    max: Color.hexToRGB('#ff0000'),
    steps: 100,
    halfSteps: 50
}

export class LavaManager {

    constructor(game) {
        this.game = game;
        this.t = 0;
        this.color = Constants.min;
    }

    update() {
        this.t += this.game.time.physicsElapsed;
        
        let currentStep = Math.floor(Math.sin(this.t) * Constants.halfSteps + Constants.halfSteps);
        this.color = Color.interpolateColor(Constants.min, Constants.max, Constants.steps, currentStep);        
    }
}

export default class Lava extends Sprite {

    static preload(load) {
        load.image('lava', 'assets/img/lava.png')
    }

    constructor(game, x, y, manager) {
        super(game, x, y, 'lava');
        this.manager = manager;
    }

    update() {
        this.tint = this.manager.color
    }
}
