import { _decorator, Component, Animation } from 'cc';
import { PlayerState } from './PlayerState';
const { ccclass, property } = _decorator;

@ccclass('PlayerAnimationController')
export class PlayerAnimationController extends Component {
    
    private animation: Animation;
    private currentState: PlayerState = PlayerState.Idle;
    private isLocked: boolean = false;

    constructor(animation: Animation) {
        super();
        this.animation = animation;
    }

    public setState(newState: PlayerState): void {
        if (this.isLocked && newState !== PlayerState.Idle) return;

        if (this.currentState === newState) return;

        this.currentState = newState;

        this.animation.play(newState.toString());

        if (newState === PlayerState.Attack) {
            this.isLocked = true;

            const clip = this.animation.getState(newState.toString());
            if (clip) {
                clip.once('finished', () => {
                    this.isLocked = false;
                    this.setState(PlayerState.Idle);
                });
            }
        }
    }

    public isBusy(): boolean {
        return this.isLocked;
    }

    public getState(): PlayerState {
        return this.currentState;
    }
    
}