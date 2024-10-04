import { _decorator, Component, math, Node, UITransform, Vec3 } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass, property, requireComponent } = _decorator;

const MIN_SPEED = 100
const MAX_SPEED = 300

@ccclass('BalloonComponent')
@requireComponent(UITransform)
export class BalloonComponent extends Component {

    private _speed: number
    private _halfHeight: number
    private _worldPosition: number
    private _isInited = false
    private _position: Vec3

    public init(position: Vec3): void {
        var uiTransform = this.node.getComponent(UITransform)
        this._halfHeight = uiTransform.height / 2

        this.node.worldPosition = position

        this._worldPosition = this.node.worldPosition.y - this._halfHeight

        this._speed = math.clamp(Math.random() * MAX_SPEED, MIN_SPEED, MAX_SPEED)

        this.node.once(Node.EventType.TOUCH_START, this.onBoomBallon, this)
        GlobalEvent.on('GAME_OVER', this.offBoomBallon, this)

        this.node.active = true

        this._isInited = true
    }

    protected update(dt: number): void {
        if (!this._isInited) return

        var nextPosition = this.node.position.clone()
        nextPosition.y += this._speed * dt

        this.node.position = nextPosition
        this._worldPosition = this.node.worldPosition.y - this._halfHeight
        this._position = this.node.worldPosition.clone()
    }

    public get bottomWorldPosition(): number {
        return this._worldPosition
    }

    public get worldPosition(): Vec3 {
        return this._position
    }

    private onBoomBallon() {
        GlobalEvent.emit('BALLOON_PUT', this)
        GlobalEvent.emit("SCORE_CHANGED")
    }

    private offBoomBallon() {
        GlobalEvent.emit('BALLOON_PUT', this, false)
        this.node.off(Node.EventType.TOUCH_START, this.onBoomBallon, this)
    }

    protected onDisable(): void {
        this._isInited = false
    }
}