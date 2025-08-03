import { _decorator, Component, Node, Vec2 } from 'cc';
import { EnemyBehavior } from './EnemyBehaviour';
const { ccclass, property } = _decorator;

@ccclass('MeleeBehaviour')
export class MeleeBehavior extends EnemyBehavior {
    update(deltaTime: number): void {
        if (!this.player) return;

        const enemyPos = this.enemy.node.getPosition();
        const playerPos = this.player.getPosition();
        const distanceToPlayer = Vec2.distance(
            new Vec2(enemyPos.x, enemyPos.y), 
            new Vec2(playerPos.x, playerPos.y)
        );

        if (this.shouldAttack(distanceToPlayer)) {
            this.enemy.move(new Vec2(0, 0), deltaTime);
            this.enemy.attack();
        } else if (distanceToPlayer <= this.enemy.detectionRange) {
            const direction = this.getMovementDirection(
                new Vec2(enemyPos.x, enemyPos.y),
                new Vec2(playerPos.x, playerPos.y),
                distanceToPlayer
            );
            this.enemy.move(direction, deltaTime);
        } else {
            this.enemy.move(new Vec2(0, 0), deltaTime);
        }
    }

    shouldAttack(distanceToPlayer: number): boolean {
        return distanceToPlayer <= this.enemy.attackRange;
    }

    getMovementDirection(enemyPos: Vec2, playerPos: Vec2, distanceToPlayer: number): Vec2 {
        return new Vec2(playerPos.x - enemyPos.x, playerPos.y - enemyPos.y);
    }
}