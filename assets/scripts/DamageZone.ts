import { _decorator, Component, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
import { IDamageable } from './interfaces/IDamageable';
const { ccclass, property } = _decorator;

@ccclass('DamageZone')
export class DamageZone extends Component {
    @property({ type: Number, tooltip: "Сколько урона наносить за тик" })
    damage: number = 10;

    @property({ type: Number, tooltip: "Пауза между уронами (секунды)" })
    delayBetweenDamageTicks: number = 1;

    private currentTarget: IDamageable | null = null;
    private damageTimer: number = 0;

    start () {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherNode = otherCollider.node;
        const components = otherNode.getComponents(Component);
        for (const comp of components) {
            if ('takeDamage' in comp && typeof (comp as IDamageable).takeDamage === 'function') {
                this.currentTarget = comp as IDamageable;
                this.damageTimer = 0;
                return;
            }
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.currentTarget = null;
        this.damageTimer = 0;
    }

    onDisable () {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    update (deltaTime: number) {
        if (this.currentTarget) {
            this.damageTimer += deltaTime;
            if (this.damageTimer >= this.delayBetweenDamageTicks) {
                this.currentTarget.takeDamage(this.damage);
                this.damageTimer = 0;
            }
        }
    }
}