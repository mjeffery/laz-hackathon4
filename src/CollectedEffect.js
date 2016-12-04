import Collectible from './Collectible'
import Timer from './Timer'

export const Constants = {
    lifespan: 500,
    resetDelay: 750,
    numberOfSounds: 6,
    sounds: [] //initialized in CollectedEffect.preload
}

let count = 0;

export default class CollectedEffect {
    
    static preload(load) {
        load.spritesheet('ruby-debris', 'assets/spritesheet/ruby-debris.png', 8, 8);

        for(let i = 0; i < Constants.numberOfSounds; i++) {
            const id = `coin-${i}`;
            Constants.sounds.push(id);
            load.audio(id, `assets/audio/pickup_${i}.mp3`)
        }
    }

    constructor(game) {
        this.game = game;

        this.initEmitter();
        this.initAudio();
    }

    initEmitter() {
        const emitter = this.emitter = this.game.add.emitter();

        emitter.makeParticles('ruby-debris', [0, 1, 2, 3]);
        emitter.gravity = 800;
        emitter.minParticleSpeed.setTo(-50, -50);
        emitter.maxParticleSpeed.setTo(150, 150);
        emitter.maxRotation = 50;
        emitter.minRotation = -50;
        emitter.setAlpha(1, 0.2, Constants.lifespan);
    }

    initAudio() {
        const add = this.game.add;
        
        this.sounds = Constants.sounds.map( id => add.audio(id) )
        this.soundIndex = 0;
        this.resetTimer = new Timer(this.game);
    }

    think() {
        this.resetTimer.update();
    }

    collect(coin) {
        console.log(`picked up: ${count}`)
        this.playNextSound();

        this.emitter.x = coin.x;
        this.emitter.y = coin.y;
        this.emitter.start(true, Constants.lifespan, 0, 5);
    }

    playNextSound() {
        let prevIndex = this.soundIndex;
        if(this.resetTimer.isDone()) {
            this.soundIndex = 0;
        } else {
            this.soundIndex = Math.min(Constants.numberOfSounds - 1, this.soundIndex + 1);
        }
        
        this.resetTimer.setTime(Constants.resetDelay);
        this.sounds[this.soundIndex].play();
    }
}
