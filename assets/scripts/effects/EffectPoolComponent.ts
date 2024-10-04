import { _decorator, Component, instantiate, NodePool, ParticleSystem2D, Prefab } from 'cc';
import { BalloonComponent } from '../balloon/BalloonComponent';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass, property } = _decorator;

const POOL_SIZE = 5
@ccclass('EffectPoolComponent')
export class EffectPoolComponent extends Component {
    @property(Prefab)
    readonly effectPrefab: Prefab

    private effectPool: NodePool

    public start() {
        this.initPool()
        GlobalEvent.on("BALLOON_PUT", this.show, this)
    }

    private initPool() {
        this.effectPool = new NodePool()
        for (let i = 0; i < POOL_SIZE; i++) {
            this.effectPool.put(instantiate(this.effectPrefab))
        }
    }

    private show(balloon: BalloonComponent) {
        var effect = this.getEffect()

        effect.node.active = true
        effect.node.setParent(this.node)
        effect.node.worldPosition = balloon.worldPosition
    }

    private getEffect(): ParticleSystem2D {
        let element = this.effectPool.get()

        if (!element) {
            element = instantiate(this.effectPrefab)
        }

        const component = element.getComponent(ParticleSystem2D)

        return component
    }
}
