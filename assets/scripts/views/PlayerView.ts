import { _decorator, Component, Animation, RigidBody2D, Vec2 } from 'cc';
import { PlayerModel } from '../models/PlayerModel';
const { ccclass, property } = _decorator;

@ccclass('PlayerView')
export class PlayerView extends Component {

    private playerModel: PlayerModel;
    private animation: Animation;
    private rigidBody: RigidBody2D | null = null;
    private currentAnim: string = '';
    private boundPositionChanged: (pos: Vec2) => void;

    protected onLoad(): void {
        this.playerModel = this.getComponent(PlayerModel);
        if (!this.playerModel) {
            console.error('PlayerModel component not found on PlayerView');
            return;
        }
        this.animation = this.getComponent(Animation);
        if (!this.animation) {
            console.error('animation component not found on PlayerView');
            return;
        }

        if (!this.animation.clips.find(clip => clip.name === "run")) {
            console.error('Animation clip "run" not found in Animation component');
            return;
        }

        this.rigidBody = this.getComponent(RigidBody2D);
        if (this.rigidBody) {
            console.log('RigidBody2D found, using physics for position updates');
        }

        this.boundPositionChanged = this.onPositionChanged.bind(this);
        this.playerModel.on('positionChanged', this.boundPositionChanged);
    }

    private onPositionChanged(position: Vec2): void {
        let isMoving = false;

        if (this.rigidBody) {
            const velocity = this.rigidBody.linearVelocity;

            isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;

            const newAnim = isMoving ? 'run' : 'idle';

            if (this.currentAnim !== newAnim) {
                if (this.animation.getState(newAnim)) {
                    this.animation.crossFade(newAnim, 0.1);
                    this.currentAnim = newAnim;
                    //console.log(`Switched animation to: ${newAnim}`);
                } else {
                    console.warn(`Animation "${newAnim}" not found`);
                }
            }
        }
    }

    protected onDestroy(): void {
        this.playerModel.off('positionChanged', this.boundPositionChanged);
    }
}