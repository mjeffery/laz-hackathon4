import { Sprite } from 'phaser'

const tweenToPromise = (tween) => new Promise( (resolve, reject) => tween.onComplete.addOnce(resolve) )

export default class Fader extends Sprite { 

    static preload(load) {
        load.image('black', 'assets/img/black.png')
    }

    constructor(game) {
        super(game, 0, 0, 'black');

        this.width = game.stage.width;
        this.height = game.stage.height;

        this.fixedToCamera = true;
    }

    fadeIn(delay, duration) {
        const game = this.game,
              tween = game.add.tween(this);

        this.alpha = 1;
        this._bringToFront();
        
        tween.to({ alpha: 0 }, duration, undefined, true, delay)

        return tweenToPromise(tween)
    }

    fadeOut(duration, delay) {
        const game = this.game,
              tween = game.add.tween(this)
                .to({ alpha: 1 }, duration)
                .to({ alpha: 1 }, delay || 0);

        this.alpha = 0;
        this._bringToFront();

        tween.start();

        return tweenToPromise(tween)
    }

    _bringToFront() {
        this.game.world.bringToTop(this);
        this.bringToTop();
    }
}
