export default class Timer {

    constructor (game) {
        this.game = game;
		this.timer = 0;
    }

    setTime (time) {
        this.timer = time;
    }

    update () {
		if(this.timer > 0)
			this.timer -= this.game.time.physicsElapsedMS;

        return this.isDone();
    }

    isDone () {
        return this.timer <= 0;
    }
}
