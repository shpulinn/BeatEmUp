import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Vec2 } from 'cc';
import { PlayerModel } from '../models/PlayerModel';
const { ccclass } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    direction: Vec2 = new Vec2();
    playerModel!: PlayerModel;

    onLoad() {
        this.playerModel = this.getComponent(PlayerModel);
        if (!this.playerModel) {
            console.error('PlayerModel component not found on PlayerController');
            return;
        }

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT: this.direction.x = -1; break;
            case KeyCode.ARROW_RIGHT: this.direction.x = 1; break;
            case KeyCode.ARROW_DOWN: this.direction.y = -1; break;
            case KeyCode.ARROW_UP: this.direction.y = 1; break;
            case KeyCode.SPACE: this.playerModel.attack(); break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ARROW_LEFT || event.keyCode === KeyCode.ARROW_RIGHT) {
            this.direction.x = 0;
        }
        if (event.keyCode === KeyCode.ARROW_UP || event.keyCode === KeyCode.ARROW_DOWN) {
            this.direction.y = 0;
        }
    }

    update(deltaTime: number) {
        this.playerModel.move(this.direction, deltaTime);
    }

}