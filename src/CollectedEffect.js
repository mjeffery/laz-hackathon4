import Collectible from './Collectible'

export default class CollectedEffect {
    
    static preload(load) {
        load.spritesheet('ruby-debris', 'assets/spritesheet/ruby-debris.png', 8, 8)
    }

    constructor(game) {
        this.game = game;

        const emitter = this.emitter = game.add.emitter();
        emitter.makeParticles('ruby-debris', [0, 1, 2, 3]);
        emitter.gravity = 200;
        emitter.minParticleSpeed.setTo(-50, -50);
        emitter.maxParticleSpeed.setTo(150, 150);
        emitter.maxRotation = 0;
        emitter.minRotation = 0;

        Collectible.onCollected.add(this.collect, this); 
    }

    collect(coin) {
        coin.kill();
        this.emitter.x = coin.x;
        this.emitter.y = coin.y;
        this.emitter.start(true, 300, 0, 5);
    }
}
