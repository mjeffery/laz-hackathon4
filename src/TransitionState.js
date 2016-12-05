import Fader from './Fader'

export default class TransitionState {

    wait(delay) {
        return new Promise( (resolve, reject) => 
            this.game.time.events.add(delay, resolve)
        );
    }

    fadeIn(delay, duration) {
        const game = this.game,
              add = this.add,
              fader = new Fader(game);

        add.existing(fader);

        //TODO use a group instead of destroying the fader
        return fader.fadeIn(delay, duration)
            .then( () => fader.destroy() )
    }

    fadeOut(duration, delay) {
        const game = this.game,
              add = this.add,
              fader = new Fader(game);

        add.existing(fader);

        return fader.fadeOut(duration, delay)
            .then( () => {
                this.stage.backgroundColor = '#000';
                fader.destroy();
            })     
    }
}
