export interface IHealable {
    heal(amount: number): void;
    getHealth?(): number;
    getMaxHealth?(): number;
}