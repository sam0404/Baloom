import { _decorator, AudioClip, AudioSource, Component, instantiate, NodePool, Prefab } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass, property } = _decorator;

const POOL_SIZE = 8
const RANDOM_KOEFFICIENT = 1993

@ccclass('EffectSoundPoolComponent')
export class EffectSoundPoolComponent extends Component {
    @property(AudioClip)
    readonly boomClip: AudioClip

    @property(AudioClip)
    readonly pfClip: AudioClip

    @property(Prefab)
    readonly soundPrefab: Prefab

    private soundPool: NodePool


    protected start(): void {
        this.initPool()
        GlobalEvent.on('BALLOON_PUT', this.onPlaySound, this)
    }

    private initPool(): void {
        this.soundPool = new NodePool()

        for (let i = 0; i < POOL_SIZE; i++) {
            this.soundPool.put(instantiate(this.soundPrefab))
        }
    }

    private onPlaySound() {
        let source = this.getAudioSource()
        source.clip = Math.ceil(Math.random() * RANDOM_KOEFFICIENT) % 2 == 0 ? this.boomClip : this.pfClip
        source.play()

        this.scheduleOnce(() => { this.putAudioSource(source) }, source.clip.getDuration())
    }

    private getAudioSource(): AudioSource {
        let element = this.soundPool.get()

        if (!element) {
            element = instantiate(this.soundPrefab)
        }

        const component = element.getComponent(AudioSource)

        return component
    }

    private putAudioSource(source: AudioSource) {
        if (!source) return

        source.clip = null

        this.soundPool.put(source.node)
    }


}


