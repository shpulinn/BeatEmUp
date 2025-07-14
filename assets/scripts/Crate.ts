import { _decorator, Component, Node } from 'cc';
import { IDamageable } from './interfaces/IDamageable';
const { ccclass, property } = _decorator;

@ccclass('Crate')
export class Crate extends Component implements IDamageable {

    @property({ type: Number, tooltip: "Кол-во здоровья" })
    maxHealth: number = 30;

    private currentHealth : number;

    protected start(): void {
        this.currentHealth = this.maxHealth;
        console.log("Здороывье коробки: " + this.currentHealth);
    }

    takeDamage(amount: number): void {
        if (amount > 0) {
            this.currentHealth = Math.max(0, this.currentHealth - amount);

            if (this.currentHealth == 0) {
                this.node.destroy();
            }
        }
    }
}


