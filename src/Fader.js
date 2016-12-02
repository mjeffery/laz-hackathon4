import { Sprite } from 'phaser'

export default class Fader { 

    static preload(load) {
        load.image('black', 'assets/img/black.png')
    }

    constructor(game) {
        super(game, 0, 0, 'black');

        this.width = game.stage.width;
        this.height = game.stage.height;

        this.fixedToCamera = true;
        game.world.bringToFront(this);
        this.bringToTop();

        this.onComplete = new Phaser.Signal();
    }

    fadeIn(delay, duration) {
        const game = this.game,
              tween = game.add.tween(this);
        
        tween.to({ alpha: 0 }, duration, undefined, true, delay)

        return { onComplete: tween.onComplete }
    }

    fadeOut(delay) {
        const game = this.game,
              tween = game.add.tween(this)
                .to({ alpha: 1 }, duration)
                .to({ alpha: 1 }, delay || 0);

        this.alpha = 0;

        tween.start();

        return { onComplete: tween.onComplete }
    }
}
