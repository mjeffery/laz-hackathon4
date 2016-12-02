export default class Timer {

    constructor (game) {
        this.game = game;
    }

    setTime (time) {
        this.time = time;
    }

    update () {
        this.timer -= this.game.time.physicsElapsedMS;
        return this.isDone();
    }

    isDone () {
        return this.timer == 0;
    }
}
