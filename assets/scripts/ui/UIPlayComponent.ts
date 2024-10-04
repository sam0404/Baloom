import { _decorator, Component } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass } = _decorator;

@ccclass('UIPlayComponent')
export class UIPlayComponent extends Component {

    protected start(): void {
        GlobalEvent.on('GAME_RESTARTED', () => { this.node.active = true }, this)
    }

    private onPlay() {
        GlobalEvent.emit('GAME_STARTED')

        this.node.active = false
    }
}