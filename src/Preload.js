import TransitionState from './TransitionState'
import Fader from './Fader'
import Player from './Player'
import World from './World'
import Collectible from './Collectible'
import CollectedEffect from './CollectedEffect'
import Cannon from './Cannon'
import Lava from './Lava'

export default class Preload extends TransitionState {
	preload() {
		const load = this.load,
			  add = this.add;

		this.bar = add.sprite(303, 281, 'loading-bar');
		this.overlay = add.sprite(298, 276, 'loading-bar-overlay');

		load.onLoadComplete.addOnce(this.onLoadComplete, this);
		load.setPreloadSprite(this.bar);

		//PRELOAD RESOURCES HERE
        Fader.preload(load);
		Player.preload(load);		
        Collectible.preload(load);
        CollectedEffect.preload(load);
        World.preload(load);
        Cannon.preload(load);
        Lava.preload(load);
	}

	onLoadComplete() {
        this.wait(300)
            .then( () => this.fadeOut(750, 300) )
            .then( () => this.game.gotoFirstLevel() );
	}

}
