import TransitionState from './TransitionState'
import { titleStyle } from './fontStyles'
import levels from './levels'

export const Constants = {
    fadeInDelay: 200,
    fadeInDuration: 750,
    introDuration: 1200,
    fadeOutDuration: 500,
    fadeOutDelay: 150
}

export default class LevelIntro extends TransitionState {

    preload() {
        const load = this.load,
              data = this.game.data,
              level = this.level = levels.get(data.currentLevel);
        
        level.preload(load);            
    }

    create() {
        const level = this.level,
              text = this.game.add.text(0, 0, level.name, titleStyle);

        text.setTextBounds(0, 0, 800, 600);

        this.stage.backgroundColor = '#000';

        this.fadeIn(Constants.fadeInDelay, Constants.fadeInDuration)
            .then( () => this.wait(Constants.introDuration) )
            .then( () => this.fadeOut(Constants.fadeOutDuration, Constants.fadeOutDelay) )
            .then( () => this.game.state.start('game') )
    } 
}
