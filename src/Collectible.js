import { Sprite, Physics, Signal } from 'phaser'

export default class Collectible extends Sprite {

    static preload(load) {
        load.image('collectible', 'assets/img/collectible.png');
    }
    
    constructor(game, x, y) {
        super(game, x, y, 'collectible');

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Physics.ARCADE);
    }
}

Collectible.onCollected = new Signal();
