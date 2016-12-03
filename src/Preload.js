import TransitionState from './TransitionState'
import Fader from './Fader'
import Player from './Player'
import World from './World'

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
		World.preload(load);
	}

	onLoadComplete() {
        this.wait(300)
            .then( () => this.fadeOut(750, 300) )
            .then( () => this.game.gotoFirstLevel() );
	}

}
