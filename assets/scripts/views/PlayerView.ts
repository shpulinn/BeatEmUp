import { _decorator, Component, Animation, RigidBody2D, Vec2 } from 'cc';
import { PlayerModel } from '../models/PlayerModel';
import { PlayerState } from '../PlayerState';
import { PlayerAnimationController } from '../PlayerAnimationController';
const { ccclass, property } = _decorator;

@ccclass('PlayerView')
export class PlayerView extends Component {

    private playerModel: PlayerModel;
    private rigidBody: RigidBody2D | null = null;
    private animation: Animation;
    private animator: PlayerAnimationController;

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

        this.rigidBody = this.getComponent(RigidBody2D);
        if (this.rigidBody) {
            console.log('RigidBody2D found, using physics for position updates');
        }

        this.animator = new PlayerAnimationController(this.animation);

        this.boundPositionChanged = this.onPositionChanged.bind(this);
        this.playerModel.on('positionChanged', this.boundPositionChanged);
    }

    private onPositionChanged(position: Vec2): void {
        let isMoving = false;

        if (this.rigidBody) {
            const velocity = this.rigidBody.linearVelocity;

            isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;

            this.animator.setState(isMoving ? PlayerState.Run : PlayerState.Idle);

            if (isMoving) {
                // Flip X
                const direction = velocity.x;
                if (direction !== 0) {
                    const scale = this.node.scale;
                    this.node.setScale(Math.sign(direction) < 0 ? -Math.abs(scale.x) : Math.abs(scale.x), scale.y, scale.z);
                }
            }
        }
    }

    protected onDestroy(): void {
        this.playerModel.off('positionChanged', this.boundPositionChanged);
    }
}