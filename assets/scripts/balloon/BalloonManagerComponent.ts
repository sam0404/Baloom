import { _decorator, Component, instantiate, math, Node, NodePool, Prefab, Vec3 } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
import { BalloonComponent } from './BalloonComponent';
const { ccclass, property } = _decorator;

const POOL_SIZE = 10
const RANDOM_KOEFFICIENT = 4

@ccclass('BalloonManagerComponent')
export class BalloonManagerComponent extends Component {
    @property(Prefab)
    readonly balloonPrefab: Prefab

    @property([Node])
    readonly generatePoints: Node[] = []

    private balloonPool: NodePool
    private intervalTime: number

    private activeBalloons: BalloonComponent[] = []
    private isPlay: boolean = false

    protected start(): void {
        this.initPool()
        this.setTimeInterval()

        GlobalEvent.on("BALLOON_PUT", this.onBoom, this)
        GlobalEvent.on('GAME_STARTED', this.onPlay, this)
        GlobalEvent.on('GAME_RESTARTED', this.onRestart, this)
    }

    protected update(deltaTime: number) {
        if (!this.isPlay) return

        this.intervalTime -= deltaTime

        if (this.intervalTime <= 0) {
            this.setTimeInterval()
            this.createBallon()
        }

        this.activeBalloons.forEach((balloon, i) => {
            if (this.node.worldPosition.y < balloon.bottomWorldPosition) {
                this.isPlay = false

                this.putBalloon(balloon)
                this.activeBalloons.splice(i, 1)

                GlobalEvent.emit('GAME_OVER')
            }
        })
    }

    private createBallon() {
        var balloon = this.getBalloonComponent()
        balloon.node.setParent(this.node)
        balloon.init(this.generatePoints[Math.ceil(Math.random() * RANDOM_KOEFFICIENT) % this.generatePoints.length].worldPosition)
        this.activeBalloons.push(balloon)
    }

    private initPool(): void {
        this.balloonPool = new NodePool()

        for (let i = 0; i < POOL_SIZE; i++) {
            this.balloonPool.put(instantiate(this.balloonPrefab))
        }
    }

    private setTimeInterval() {
        this.intervalTime = math.clamp(Math.random() * RANDOM_KOEFFICIENT, 1, RANDOM_KOEFFICIENT)
    }

    private onRestart() {
        this.setTimeInterval()
    }

    private getBalloonComponent(): BalloonComponent {
        let element = this.balloonPool.get()

        if (!element) {
            element = instantiate(this.balloonPrefab)
        }

        const component = element.getComponent(BalloonComponent)

        return component
    }

    private onPlay() {
        this.isPlay = true
    }

    private onBoom(balloon: BalloonComponent, isCreateNew: boolean = true) {
        if (isCreateNew) {
            this.createBallon()
        }

        this.putBalloon(balloon)
    }

    private putBalloon(balloon: BalloonComponent) {
        if (!balloon) return

        balloon.node.scale = Vec3.ONE
        balloon.node.position = Vec3.ZERO
        balloon.node.active = false

        this.balloonPool.put(balloon.node)
    }

    protected onDisable(): void {
        GlobalEvent.off("BALLOON_PUT", this.onBoom, this)
        GlobalEvent.off('GAME_STARTED', this.onPlay, this)

        this.isPlay = false
    }
}