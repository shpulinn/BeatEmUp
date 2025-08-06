import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Configuration')
export class Configuration extends Component {

    static CameraTopBorder: number = 50;
    static CameraBottomBorder: number = -130;
    
}