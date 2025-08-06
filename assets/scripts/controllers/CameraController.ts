import { _decorator, Component, Node, Vec3 } from 'cc';
import { Configuration } from '../Configuration';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property({ type: Node })
    playerNode: Node = null;

    start() {
        if (!this.playerNode) {
            console.log("PlayerNode not found on CameraController");
        }
    }

    update(deltaTime: number) {
        if (this.playerNode) {
            this.node.setPosition(this.playerNode.position);
            let pos = this.playerNode.position;
            if (this.node.position.y < Configuration.CameraBottomBorder) {
                pos = new Vec3(this.playerNode.position.x, Configuration.CameraBottomBorder, this.playerNode.position.z);
            }
            else if (this.node.position.y > Configuration.CameraTopBorder) {
                pos = new Vec3(this.playerNode.position.x, Configuration.CameraTopBorder, this.playerNode.position.z);
            }
            this.node.setPosition(pos);
        }
    }
}