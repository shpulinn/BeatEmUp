import { _decorator, Component, Node } from 'cc';
import { PlayerModel } from '../models/PlayerModel';
const { ccclass, property } = _decorator;

@ccclass('PlayerView')
export class PlayerView extends Component {

    playerModel: PlayerModel;

    protected onLoad(): void {
        this.playerModel = this.getComponent(PlayerModel);
        if (!this.playerModel) {
            console.error('PlayerModel component not found on PlayerView');
            return;
        }
    }

    update(deltaTime: number) {
        const pos2 = this.playerModel.getPosition();
        this.node.setPosition(pos2.x, pos2.y, 0);
    }
    
}