import { _decorator, Animation, Component, math, Sprite, SpriteFrame } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

const MIN_SPEED = 0.1
const MAX_SPEED = 1.5
const RANDOM_KOEFF = 10

@ccclass('BalloonBackgroundComponent')
@requireComponent(Animation)
@requireComponent(Sprite)
export class BalloonBackgroundComponent extends Component {
    //@property({ type: CCFloat, min: 0.1, max: 3.5 })
    private speedAnimation: number = 0.5

    @property([SpriteFrame])
    readonly sprites: SpriteFrame[] = []

    protected start() {
        this.speedAnimation = math.clamp(Math.random() * MAX_SPEED, MIN_SPEED, MAX_SPEED)

        var sprite = this.node.getComponent(Sprite)
        if (this.sprites.length > 0) {
            sprite.spriteFrame = this.sprites[Math.ceil(math.random() * RANDOM_KOEFF) % this.sprites.length]
        }

        var animation = this.node.getComponent(Animation)
        animation.getState(animation.defaultClip.name).speed = this.speedAnimation
    }
}