import { _decorator, Component, Vec2, EventTarget, Collider2D, PhysicsSystem2D, Rect } from 'cc';
import { IDamageable } from '../interfaces/IDamageable';
import { IAttacker } from '../interfaces/IAttacker';
import { IMovable } from '../interfaces/IMovable';
const { ccclass, property } = _decorator;

@ccclass('PlayerModel')
export class PlayerModel extends Component implements IMovable, IAttacker, IDamageable {

    private eventTarget: EventTarget = new EventTarget();
    private position: Vec2 = new Vec2();
    private speed = 200;
    private isAttacking: boolean = false;
    private comboStage: number = 0;
    private attackCooldown: number = 0;
    private health: number = 100;
    private isAlive: boolean = true;

    @property({ type: Number, tooltip: "Радиус атаки" })
    attackRange: number = 50;

    @property({ type: Number, tooltip: "Урон" })
    damage: number = 5;

    dispatchEvent(eventName: string, ...args: any[]): void {
        this.eventTarget.emit(eventName, ...args);
    }

    on(eventName: string, callback: (...args: any[]) => void): void {
        this.eventTarget.on(eventName, callback, this);
    }

    takeDamage(amount: number): void {
        if (!this.isAlive) return;
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.isAlive = false;
            this.eventTarget.emit('playerDied');
        }
        this.eventTarget.emit('healthChanged', this.health);
        console.log("Получил урон, текущее здоровье: " + this.health)
    }

    getHealth(): number {
        return this.health;
    }

    isPlayerAlive(): boolean {
        return this.isAlive;
    }

    attack(): void {
        if (this.isAttacking || this.attackCooldown > 0) return;

        console.log("Игрок атакует");

        this.isAttacking = true;
        this.comboStage = (this.comboStage + 1) % 3;
        this.attackCooldown = 0.5;
        this.eventTarget.emit('attackStarted', this.comboStage);

        const pos = this.node.worldPosition;
        const half = this.attackRange / 2;
        const aabb = new Rect(pos.x + half, pos.y + half, this.attackRange, this.attackRange);

        const colliders = PhysicsSystem2D.instance.testAABB(aabb);
        for (const collider of colliders) {
            if (collider.node === this.node) continue;
            const components = collider.node.getComponents(Component);
            for (const comp of components) {
                if ('takeDamage' in comp && typeof (comp as IDamageable).takeDamage === 'function') {
                    (comp as IDamageable).takeDamage(this.damage);
                    console.log('[PlayerModel] Нанесён урон объекту:', collider.node.name);
                }
            }
        }
    }

    move(direction: Vec2, deltaTime: number): void {
        if (!direction || direction.length() === 0) {
            return; // No movement if direction is zero
        }
        this.position.x += direction.x * this.speed * deltaTime;
        this.position.y += direction.y * this.speed * deltaTime;
        this.eventTarget.emit('positionChanged', this.position.clone());
    }

    getPosition(): Vec2 {
        return this.position.clone();
    }

    update(deltaTime: number) {
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
            if (this.attackCooldown <= 0) {
                this.isAttacking = false;
            }
        }
    }

    serialize(): object {
        return {
            position: { x: this.position.x, y: this.position.y },
            health: this.health,
            isAlive: this.isAlive,
        };
    }

    deserialize(data: any): void {
        this.position.set(data.position.x, data.position.y);
        this.health = data.health;
        this.isAlive = data.isAlive;
    }
} 