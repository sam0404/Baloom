import { _decorator, Component, Label } from 'cc';
import { CommonData } from '../common/CommonData';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UIScoreComponent')
@requireComponent(Label)
export class UIScoreComponent extends Component {
    private _scoreLabel: Label

    protected start(): void {
        this._scoreLabel = this.node.getComponent(Label)
        this.updateLabel()
        GlobalEvent.on('SCORE_CHANGED', this.scoreChanged, this)
    }

    private changeScore() {
        CommonData.score++
    }

    private updateLabel() {
        this._scoreLabel.string = '' + CommonData.score
    }

    private scoreChanged() {
        this.changeScore()
        this.updateLabel()
    }
}