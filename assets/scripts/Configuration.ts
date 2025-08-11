import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Configuration')
export class Configuration extends Component {

    // ===== КАМЕРА =====
    static CameraTopBorder: number = 50;
    static CameraBottomBorder: number = -130;
    
    // ===== ИГРОК =====
    static PlayerSpeed: number = 5;
    static PlayerMaxHealth: number = 100;
    static PlayerAttackRange: number = 50;
    static PlayerDamage: number = 5;
    static PlayerAttackCooldown: number = 0.5;
    
    // ===== ВРАГИ - БАЗОВЫЕ НАСТРОЙКИ =====
    static EnemyBaseSpeed: number = 3;
    static EnemyBaseHealth: number = 50;
    static EnemyBaseAttackRange: number = 40;
    static EnemyBaseDamage: number = 10;
    static EnemyBaseDetectionRange: number = 150;
    static EnemyAttackCooldown: number = 1.0;
    
    // ===== ВРАГИ - ТИПЫ =====
    // Ближний бой
    static MeleeEnemySpeed: number = 4;
    static MeleeEnemyHealth: number = 60;
    static MeleeEnemyAttackRange: number = 100;
    static MeleeEnemyDamage: number = 15;
    static MeleeEnemyDetectionRange: number = 200;
    
    // Дальний бой (для будущего)
    static RangedEnemySpeed: number = 2;
    static RangedEnemyHealth: number = 30;
    static RangedEnemyAttackRange: number = 200;
    static RangedEnemyDamage: number = 8;
    static RangedEnemyDetectionRange: number = 300;
    
    // Танк (для будущего)
    static TankEnemySpeed: number = 1.5;
    static TankEnemyHealth: number = 150;
    static TankEnemyAttackRange: number = 60;
    static TankEnemyDamage: number = 25;
    static TankEnemyDetectionRange: number = 120;
    
    // Маг (для будущего)
    static MageEnemySpeed: number = 2.5;
    static MageEnemyHealth: number = 40;
    static MageEnemyAttackRange: number = 180;
    static MageEnemyDamage: number = 20;
    static MageEnemyDetectionRange: number = 250;
    
    // ===== ФИЗИКА =====
    static PhysicsGravity: number = 9.8;
    static PhysicsVelocityThreshold: number = 0.1;
    
}