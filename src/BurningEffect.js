import { Point } from 'phaser'

export const Constants = {
    numParticles: 450,
    lifespan: 100,
    gravity: -1200,
    frequency: 2,
    defaultOffset: new Point()
}

export default class BurningEffect {

    static preload(load) {
        load.spritesheet('burn-blotches', 'assets/spritesheet/burn blotches.png', 16, 16);
    }

    constructor(game, target, offset=Constants.defaultOffset) {
        this.game = game;
        this.target = target;
        this.offset = offset;

        this.initEmitter();
    }

    initEmitter() {
        let x = this.target.x,
            y = this.target.y;
        
        const emitter = this.emitter = this.game.add.emitter(x, y, Constants.numParticles);

        emitter.makeParticles('burn-blotches', [0, 1, 2, 3, 4, 5, 6, 7]);
        emitter.gravity = Constants.gravity;
        emitter.minParticleSpeed.setTo(-50, 0);
        emitter.maxParticleSpeed.setTo(50, -100);
        emitter.maxRotation = 0;
        emitter.minRotation = 0;
        emitter.setAlpha(1, 0.1, Constants.lifespan);
        emitter.setSize(32, 64);
        emitter.setScale(0.1, 0.1, 1, 1);

        this.emitter.start(false, Constants.lifespan, Constants.frequency);
    }

    think() {
        this.emitter.x = this.target.x + this.offset.x;
        this.emitter.y = this.target.y + this.offset.y;
    }
}
