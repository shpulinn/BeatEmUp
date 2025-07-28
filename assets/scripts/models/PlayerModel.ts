import { _decorator, Component, Vec2, EventTarget, PhysicsSystem2D, Rect, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { IDamageable } from '../interfaces/IDamageable';
import { IAttacker } from '../interfaces/IAttacker';
import { IMovable } from '../interfaces/IMovable';
import { IHealable } from '../interfaces/IHealable';
import { ICollectable } from '../interfaces/ICollectable';
const { ccclass, property } = _decorator;

@ccclass('PlayerModel')
export class PlayerModel extends Component implements IMovable, IAttacker, IDamageable, IHealable {    

    private eventTarget: EventTarget = new EventTarget();
    private position: Vec2 = new Vec2();
    private speed = 5;
    private isAttacking: boolean = false;
    private comboStage: number = 0;
    private attackCooldown: number = 0;
    private health: number = 0;
    private isAlive: boolean = true;
    private rigidBody: RigidBody2D | null = null;

    @property({ type: Number, tooltip: "Радиус атаки" })
    attackRange: number = 50;   

    @property({ type: Number, tooltip: "Урон" })
    damage: number = 5;

    @property({ type: Number, tooltip: "Макс. здоровье" })
    private maxHealth: number = 100;

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody2D);
        if (!this.rigidBody) {
            console.warn('RigidBody2D not found on PlayerModel, using node position for movement');
        }        
    }

    start () {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this.health = this.maxHealth;
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let otherNode = otherCollider.node;
        const components = otherNode.getComponents(Component);
        for (const comp of components) {
            if ('collect' in comp && typeof (comp as ICollectable).collect === 'function') {
                comp.collect(this.node);
            }
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
            this.eventTarget.emit('playerDied');
            console.log("Игрок умер");
        }
        this.eventTarget.emit('healthChanged', this.health);
        console.log("Получил урон, текущее здоровье: " + this.health)
    }    

    isPlayerAlive(): boolean {
        return this.isAlive;
    }

    attack(): void {
        if (this.isAttacking || this.attackCooldown > 0) return;

        this.isAttacking = true;
        //this.comboStage = (this.comboStage + 1) % 3;
        this.attackCooldown = 0.5;
        this.eventTarget.emit('attackStarted', this.comboStage);

        const pos = this.node.worldPosition;

        const isFacingLeft = this.node.scale.x < 0;

        const offsetX = isFacingLeft ? -this.attackRange : 0;

        const aabb = new Rect(
            pos.x + offsetX,
            pos.y - this.attackRange / 2,
            this.attackRange,
            this.attackRange
        );

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

    heal(amount: number): void {
        if (!this.isAlive) return;

        this.health = Math.min(this.maxHealth, this.health + amount);
        this.eventTarget.emit('healthChanged', this.health);
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    getHealth(): number {
        return this.health;
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

    protected onDisable(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
} 