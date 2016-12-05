import TransitionState from './TransitionState'
import { titleStyle } from './fontStyles'

export const Constants = {
    fadeInDelay: 200,
    fadeInDuration: 750,
    winnersMessage: 'You Win!'
}

export default class LevelIntro extends TransitionState {

    create() {
        const text = this.game.add.text(0, 0, Constants.winnersMessage, titleStyle);

        this.stage.backgroundColor = '#000';

        text.setTextBounds(0, 0, 800, 600);

        this.fadeIn(Constants.fadeInDelay, Constants.fadeInDuration);
    } 
}
