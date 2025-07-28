import { _decorator, Component, Vec2, EventTarget, PhysicsSystem2D, Rect, RigidBody2D } from 'cc';
import { IDamageable } from '../interfaces/IDamageable';
import { IAttacker } from '../interfaces/IAttacker';
import { IMovable } from '../interfaces/IMovable';
const { ccclass, property } = _decorator;

@ccclass('EnemyModel')
export class EnemyModel extends Component implements IMovable, IAttacker, IDamageable {
    private eventTarget: EventTarget = new EventTarget();
    private position: Vec2 = new Vec2();
    private speed = 3;
    private isAttacking: boolean = false;
    private attackCooldown: number = 0;
    private health: number = 50;
    private isAlive: boolean = true;
    private rigidBody: RigidBody2D | null = null;

    @property({ type: Number, tooltip: "Радиус атаки" })
    attackRange: number = 40;

    @property({ type: Number, tooltip: "Урон" })
    damage: number = 10;

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody2D);
    }

    dispatchEvent(eventName: string, ...args: any[]): void {
        this.eventTarget.emit(eventName, ...args);
    }

    on(eventName: string, callback: (...args: any[]) => void): void {
        this.eventTarget.on(eventName, callback, this);
    }

    off(eventName: string, callback: (...args: any[]) => void): void {
        this.eventTarget.off(eventName, callback, this);
    }

    takeDamage(amount: number): void {
        if (!this.isAlive) return;
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.isAlive = false;
            this.eventTarget.emit('enemyDied');
        }
        this.eventTarget.emit('healthChanged', this.health);
    }

    getHealth(): number {
        return this.health;
    }

    isEnemyAlive(): boolean {
        return this.isAlive;
    }

    attack(): void {
        if (this.isAttacking || this.attackCooldown > 0) return;
        this.isAttacking = true;
        this.attackCooldown = 1.0;
        this.eventTarget.emit('attackStarted');
        // Здесь логика поиска цели и нанесения урона (например, игроку)
    }

    move(direction: Vec2, deltaTime: number): void {
        if (!this.isAlive) return;
        if (!direction || direction.length() === 0) {
            if (this.rigidBody) {
                this.rigidBody.linearVelocity = new Vec2(0, 0);
                this.position.set(this.node.position.x, this.node.position.y);
            }
            this.eventTarget.emit('positionChanged', this.position.clone());
            return;
        }

        direction = direction.normalize();

        if (this.rigidBody) {
            this.rigidBody.linearVelocity = new Vec2(direction.x * this.speed, direction.y * this.speed);
            this.position.set(this.node.position.x, this.node.position.y);
        } else {
            this.position.x += direction.x * this.speed * deltaTime;
            this.position.y += direction.y * this.speed * deltaTime;
        }

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
        if (this.rigidBody) {
            this.position.set(this.node.position.x, this.node.position.y);
        }
    }
} 