import { _decorator, Component, Vec2 } from 'cc';
import { EnemyModel } from '../models/EnemyModel';
const { ccclass } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    direction: Vec2 = new Vec2();
    enemyModel!: EnemyModel;

    onLoad() {
        this.enemyModel = this.getComponent(EnemyModel);
        if (!this.enemyModel) {
            console.error('EnemyModel component not found on EnemyController');
            return;
        }
        // Здесь можно реализовать простейший AI (например, патрулирование)
    }   

    update(deltaTime: number) {
        // Пример: враг всегда двигается вправо
        this.direction.set(-1, 0);
        this.enemyModel.move(this.direction, deltaTime);
        // Можно добавить вызов атаки по условию (например, если игрок рядом)
        // this.enemyModel.attack();
    }
} 