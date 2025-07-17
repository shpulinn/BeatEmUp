import { _decorator, Component, PhysicsSystem2D, Rect, UITransform } from 'cc';
import { IDamageable } from './interfaces/IDamageable';
const { ccclass, property } = _decorator;

@ccclass('DamageZone')
export class DamageZone extends Component {
    @property({ type: Number, tooltip: "Сколько урона наносить за тик" })
    damage: number = 10;

    @property({ type: Number, tooltip: "Пауза между уронами (секунды)" })
    delayBetweenDamageTicks: number = 1;

    private damageTimers: Map<IDamageable, number> = new Map();
    private uiTransform: UITransform;

    private worldPos;
    private zoneRect;
    private alreadyDamaged = new Set<IDamageable>();

    protected start(): void {
        this.uiTransform = this.getComponent(UITransform);

        this.worldPos = this.node.worldPosition;
        this.zoneRect = new Rect(
            this.worldPos.x - this.uiTransform.width * 0.5,
            this.worldPos.y - this.uiTransform.height * 0.5,
            this.uiTransform.width,
            this.uiTransform.height
        );
    }

    update(deltaTime: number) {        

        const colliders = PhysicsSystem2D.instance.testAABB(this.zoneRect);

        this.alreadyDamaged.clear(); 

        for (const collider of colliders) {
            const node = collider.node;
            const components = node.getComponents(Component);
            for (const comp of components) {
                if ('takeDamage' in comp && typeof (comp as IDamageable).takeDamage === 'function') {
                    const target = comp as IDamageable;

                    let timer = this.damageTimers.get(target) ?? this.delayBetweenDamageTicks;
                    timer += deltaTime;

                    if (timer >= this.delayBetweenDamageTicks) {
                        target.takeDamage(this.damage);
                        timer = 0;
                    }

                    this.damageTimers.set(target, timer);
                    this.alreadyDamaged.add(target);
                }
            }
        }

        for (const [target] of this.damageTimers) {
            if (!this.alreadyDamaged.has(target)) {
                this.damageTimers.delete(target);
            }
        }
    }
}