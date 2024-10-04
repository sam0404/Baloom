import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIRecordComponent')
export class UIRecordComponent extends Component {
    @property(Label)
    readonly playerName: Label

    @property(Label)
    readonly score: Label

    public setData(name: string, score: number) {
        this.playerName.string = name
        this.score.string = '' + score
    }
}