export interface IMovable {
    move(direction: import("cc").Vec2, deltaTime: number): void;
}