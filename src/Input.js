import { Keyboard as Keys } from 'phaser'

export const LEFT = 'left'
export const RIGHT = 'right'
export const JUMP = 'jump'

export default class Input {

	constructor(game) {
		this.game = game;
		
		const keyboard = game.input.keyboard;

		Object.assign(this, {
			[LEFT]: keyboard.addKey(Keys.LEFT),
			[RIGHT]: keyboard.addKey(Keys.RIGHT),
			[JUMP]: keyboard.addKey(Keys.Z)
		})
	}
}
