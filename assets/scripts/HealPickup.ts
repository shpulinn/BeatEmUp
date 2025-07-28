import { _decorator, Component, Node } from 'cc';
import { ICollectable } from './interfaces/ICollectable';
import { IHealable } from './interfaces/IHealable';
const { ccclass, property } = _decorator;

@ccclass('HealPickup')
export class HealPickup extends Component implements ICollectable {
    @property({ type: Number })
    healAmount: number = 20;

    collect(collector: Node): void {
        const components = collector.getComponents(Component);
        for (const comp of components) {
            if ('heal' in comp && typeof (comp as IHealable).heal === 'function') {
                (comp as IHealable).heal(this.healAmount);
                break;
            }
        }

        this.node.destroy();
    }
}