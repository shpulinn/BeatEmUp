import { _decorator, Component, Animation } from 'cc';
import { PlayerState } from './PlayerState';
const { ccclass, property } = _decorator;

@ccclass('PlayerAnimationController')
export class PlayerAnimationController extends Component {
    
    private animation: Animation;
    private currentState: PlayerState = PlayerState.Idle;

    constructor(animation: Animation) {
        super();
        this.animation = animation;
    }

    public setState(state: PlayerState): void {
        if (this.currentState === state) return;

        const clipState = this.animation.getState(state);
        if (!clipState) {
            console.warn(`[Animator] Clip "${state}" not found.`);
            return;
        }

        this.animation.play(state);
        this.currentState = state;
    }

    public getState(): PlayerState {
        return this.currentState;
    }
    
}