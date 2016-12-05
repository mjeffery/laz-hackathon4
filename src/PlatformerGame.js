import { Game as PhaserGame } from 'phaser'

import Boot from './Boot'
import Preload from './Preload'
import LevelIntro from './LevelIntro'
import Winner from './Winner'
import Game from './Game'
import GameData from './GameData'

import levels from './levels'

export default class PlatformerGame extends PhaserGame {

    constructor(...args) {
        super(...args)
        this._data = new GameData()

        this.state.add('boot', Boot);
        this.state.add('preload', Preload);
        this.state.add('levelIntro', LevelIntro);
        this.state.add('game', Game);
        this.state.add('winner', Winner);

        this.state.start('boot');
    }

    get data() { return this._data; }

    gotoFirstLevel() {
        this.data.currentLevel = 0;
		this.state.start('levelIntro');
    } 

    gotoNextLevel() {
        this.data.currentLevel++;
        if(this.data.currentLevel >= levels.count) {
            this.state.start('winner');
        }
        else { 
            this.state.start('levelIntro');
        }
    }
}
