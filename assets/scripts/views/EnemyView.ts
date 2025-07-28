import { _decorator, Component, Animation, Vec2 } from 'cc';
import { EnemyModel } from '../models/EnemyModel';
const { ccclass } = _decorator;

@ccclass('EnemyView')
export class EnemyView extends Component {
    private enemyModel: EnemyModel;
    private animation: Animation;

    private boundPositionChanged: (pos: Vec2) => void;
    private attack: () => void;
    private die: () => void;

    private isDestroyed = false;

    protected onLoad(): void {
        this.enemyModel = this.getComponent(EnemyModel);
        if (!this.enemyModel) {
            console.error('EnemyModel component not found on EnemyView');
            return;
        }
        this.animation = this.getComponent(Animation);
        if (!this.animation) {
            console.error('Animation component not found on EnemyView');
            return;
        }

        this.boundPositionChanged = this.onPositionChanged.bind(this);
        this.attack = this.onAttack.bind(this);
        this.die = this.onEnemyDied.bind(this);
        this.enemyModel.on('positionChanged', this.boundPositionChanged);
        this.enemyModel.on('attackStarted', this.attack);
        this.enemyModel.on('enemyDied', this.die);
    }

    private onPositionChanged(position: Vec2): void {
        // Здесь логика проигрывания анимаций движения
    }

    private onAttack(): void {
        // Здесь логика проигрывания анимации атаки
    }

    protected onDisable(): void {
        if (this.enemyModel) {
            if (this.boundPositionChanged) {
                this.enemyModel.off('positionChanged', this.boundPositionChanged);
            }
            if (this.attack) {
                this.enemyModel.off('attackStarted', this.attack);
            }
        }
    }

    private onEnemyDied = () => {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.node.destroy();
    }
} 