import { _decorator, Component, Node, Vec2 } from 'cc';
import { EnemyModel } from './models/EnemyModel';
const { ccclass, property } = _decorator;

export abstract class EnemyBehavior {
    protected enemy: EnemyModel;
    protected player: Node | null = null;

    constructor(enemy: EnemyModel) {
        this.enemy = enemy;
    }

    setPlayer(player: Node) {
        this.player = player;
    }

    abstract update(deltaTime: number): void;
    abstract shouldAttack(distanceToPlayer: number): boolean;
    abstract getMovementDirection(enemyPos: Vec2, playerPos: Vec2, distanceToPlayer: number): Vec2;
}