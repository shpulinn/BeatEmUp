import { _decorator, Component, Vec2, EventTarget, PhysicsSystem2D, Rect, RigidBody2D, Node } from 'cc';
import { IDamageable } from '../interfaces/IDamageable';
import { IAttacker } from '../interfaces/IAttacker';
import { IMovable } from '../interfaces/IMovable';
import { PlayerModel } from '../models/PlayerModel';
import { EnemyBehavior } from '../EnemyBehaviour';
import { Configuration } from '../Configuration';
const { ccclass, property } = _decorator;

@ccclass('EnemyModel')
export class EnemyModel extends Component implements IMovable, IAttacker, IDamageable {
    private eventTarget: EventTarget = new EventTarget();
    private position: Vec2 = new Vec2();
    private speed = Configuration.EnemyBaseSpeed;
    private isAttacking: boolean = false;
    private attackCooldown: number = 0;
    private health: number = Configuration.EnemyBaseHealth;
    private isAlive: boolean = true;
    private rigidBody: RigidBody2D | null = null;

    @property({ type: Number, tooltip: "Радиус атаки" })
    attackRange: number = Configuration.EnemyBaseAttackRange;

    @property({ type: Number, tooltip: "Урон" })
    damage: number = Configuration.EnemyBaseDamage;

    private player: Node | null = null;
    @property({ tooltip: 'Радиус обнаружения игрока' })
    detectionRange: number = Configuration.EnemyBaseDetectionRange;

    @property
    maxHealth: number = Configuration.EnemyBaseHealth;

    private behavior: EnemyBehavior | null = null;

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody2D);

        this.health = this.maxHealth;
    }

    setBehavior(behavior: EnemyBehavior): void {
        this.behavior = behavior;
        if (this.player) {
            this.behavior.setPlayer(this.player);
        }
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

    getSpeed(): number {
        return this.speed;
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    setMaxHealth(health: number): void {
        this.health = health;
        this.maxHealth = health;
    }

    setPlayerTarget(playerNode: Node) {
        this.player = playerNode;
        if (this.behavior) {
            this.behavior.setPlayer(playerNode);
        }
    }

    attack(): void {
        if (this.isAttacking || this.attackCooldown > 0) return;

        this.isAttacking = true;
        this.attackCooldown = Configuration.EnemyAttackCooldown;
        this.eventTarget.emit('attackStarted');

        if (!this.player) return;

        const pos = this.node.worldPosition;
        const targetPos = this.player.worldPosition;

        const direction = targetPos.subtract(pos).normalize();
        const offset = direction.multiplyScalar(this.attackRange * 0.5);
        const attackCenter = pos.add(offset);

        const aabb = new Rect(
            attackCenter.x - this.attackRange / 2,
            attackCenter.y - this.attackRange / 2,
            this.attackRange,
            this.attackRange
        );

        const colliders = PhysicsSystem2D.instance.testAABB(aabb);

        for (const collider of colliders) {
            if (!collider.node) continue;
            if (collider.node === this.node) continue;

            const components = collider.node.getComponents(Component);
            for (const comp of components) {
                if (comp instanceof PlayerModel) {
                    comp.takeDamage(this.damage);
                    console.log('[EnemyModel] Нанесён урон игроку:', collider.node.name);
                }
            }
        }
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

        if (!this.isAlive || !this.player) return;

        // Используем поведение для обновления логики
        if (this.behavior) {
            this.behavior.update(deltaTime);
        } else {
            // Fallback: старая логика для совместимости
            this.defaultBehavior(deltaTime);
        }

        if (this.rigidBody) {
            this.position.set(this.node.position.x, this.node.position.y);
        }
    }

    private defaultBehavior(deltaTime: number): void {
        if (!this.player) return;

        const enemyPos = this.node.getPosition();
        const playerPos = this.player.getPosition();
        const distanceToPlayer = Vec2.distance(new Vec2(enemyPos.x, enemyPos.y), new Vec2(playerPos.x, playerPos.y));

        if (distanceToPlayer <= this.attackRange) {
            this.move(new Vec2(0, 0), deltaTime);
            this.attack();
        } else if (distanceToPlayer <= this.detectionRange) {
            const direction = new Vec2(playerPos.x - enemyPos.x, playerPos.y - enemyPos.y);
            this.move(direction, deltaTime);
        } else {
            this.move(new Vec2(0, 0), deltaTime);
        }
    }
} 