import { Signal } from 'phaser'

class StateMachineEvents {
    constructor() {
        this.onEnterState = new Signal();
        this.onExitState = new Signal();
    }
}

export default class StateMachine {

    constructor(startingState) {
        this.current = startingState || 'start'; 
        this.previous = null;
        this.events = new StateMachineEvents(); 
    }
    
    change(newState) {
        this.previous = this.current;
        this.current = newState;
        this.events.onExitState.dispatch(this.previous);
        this.events.onEnterState.dispatch(this.current);
    }
}
