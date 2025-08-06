import { _decorator, Component, Vec2, find, Node, Enum } from 'cc';
import { EnemyModel } from '../models/EnemyModel';
import { EnemyBehavior } from '../EnemyBehaviour';
import { MeleeBehavior } from '../MeleeBehaviour';
const { ccclass, property } = _decorator;

export enum EnemyType {
    MELEE = 'melee',
    RANGED = 'ranged', 
    TANK = 'tank',
    MAGE = 'mage'
}

@ccclass('EnemyController')
export class EnemyController extends Component {
    direction: Vec2 = new Vec2();
    enemyModel!: EnemyModel;

    @property({ 
        tooltip: "Тип поведения врага",
        type: Enum(EnemyType)
     })
    enemyType: EnemyType = EnemyType.MELEE;

    onLoad() {
        this.enemyModel = this.getComponent(EnemyModel);
        const player = find('Canvas/Player');
        if (player) {
            this.enemyModel.setPlayerTarget(player);
        } else {
            console.warn('Player node not found');
        }

        this.setupEnemyBehavior();
    }
    
    private setupEnemyBehavior(): void {
        let behavior: EnemyBehavior;

        switch (this.enemyType) {
            case EnemyType.MELEE:
                behavior = new MeleeBehavior(this.enemyModel);
                this.setupMeleeStats();
                break;
                
            // case EnemyType.RANGED:
            //     behavior = new RangedBehavior(this.enemyModel);
            //     this.setupRangedStats();
            //     break;
                
            // case EnemyType.TANK:
            //     behavior = new TankBehavior(this.enemyModel);
            //     this.setupTankStats();
            //     break;
                
            // case EnemyType.MAGE:
            //     behavior = new MageBehavior(this.enemyModel);
            //     this.setupMageStats();
            //     break;
                
            default:
                behavior = new MeleeBehavior(this.enemyModel);
                this.setupMeleeStats();                
        }
        this.enemyModel.setBehavior(behavior);
        console.log(`[EnemyController] Установлено поведение: ${this.enemyType}`);
    }

    private setupMeleeStats(): void {
        this.enemyModel.attackRange = 100;
        this.enemyModel.damage = 15;
        this.enemyModel.detectionRange = 200;
        this.enemyModel.setSpeed(4);
        this.enemyModel.setMaxHealth(60);
    }

    update(deltaTime: number) {
    }

    // dynamic behaviour change?
    changeEnemyType(newType: EnemyType): void {
        this.enemyType = newType;
        this.setupEnemyBehavior();
    }

    getCurrentEnemyType(): EnemyType {
        return this.enemyType;
    }
} 