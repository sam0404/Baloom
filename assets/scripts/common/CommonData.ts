import { _decorator } from 'cc';
const { ccclass, } = _decorator;

@ccclass('CommonData')
export class CommonData {
    public static score: number = 0

    public static resetScore() {
        this.score = 0
    }
}