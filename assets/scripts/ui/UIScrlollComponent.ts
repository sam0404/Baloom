import { _decorator, Component, EditBox, instantiate, Layout, Node, Prefab, sys, Vec3 } from 'cc';
import { CommonData } from '../common/CommonData';
import { GlobalEvent } from '../utils/event/GlobalEvent';
import { UIRecordComponent } from './UIRecordComponent';
const { ccclass, property } = _decorator;

type RecordPlayerType = {
    name: string
    score: number
}

@ccclass('UIScrlollComponent')
export class UIScrlollComponent extends Component {
    @property(Prefab)
    readonly recordPrefab: Prefab

    @property(EditBox)
    readonly nameBox: EditBox

    @property(Layout)
    readonly container: Layout

    @property(Node)
    readonly addButton: Node

    @property(Node)
    readonly resetButton: Node

    private records: RecordPlayerType[] = []
    private startPosition: Vec3
    private startBoxPosition: Vec3
    private hidePosition: Vec3 = new Vec3(0, -100000, 0)


    protected start(): void {
        sys.localStorage.clear()

        this.startPosition = this.node.worldPosition.clone()
        this.startBoxPosition = this.nameBox.node.worldPosition.clone()
        this.node.worldPosition = this.hidePosition

        this.hideRestart()
        this.hideEditPanel()

        GlobalEvent.on('GAME_OVER', this.show, this)
    }

    private show() {
        this.node.worldPosition = this.startPosition

        this.nameBox.string = ""

        for (let i = this.container.node.children.length - 1; i >= 0; i--) {
            this.container.node.children[i].destroy()
        }

        let data = JSON.parse(sys.localStorage.getItem('records')) as RecordPlayerType[]

        if (!data)
            data = [] as RecordPlayerType[]

        this.records = [...data]

        this.records = Object.values(this.records).sort((a, b) => b.score - a.score)

        this.records.forEach(record => {
            this.addRecordToList(record)
        })

        this.showEditPanel()
        this.hideRestart()
    }

    // EDITOR
    private updateRecordList() {
        let record = {
            name: this.nameBox.string,
            score: CommonData.score
        } as RecordPlayerType

        this.records.push(record)

        this.addRecordToList(record)

        let lastElement = this.container.node.children[this.container.node.children.length - 1]
        let index = 0
        for (let i = 0; i < this.container.node.children.length - 1; i++) {
            if (+lastElement.name >= +this.container.node.children[i].name) {
                index = i

                break
            }
        }

        lastElement.setSiblingIndex(index)

        sys.localStorage.setItem('records', JSON.stringify(this.records))

        this.showRestart()
        this.hideEditPanel()

        GlobalEvent.emit('GAME_RESTARTED')
    }

    private onRestart() {
        this.node.worldPosition = this.hidePosition
        CommonData.resetScore()

        GlobalEvent.emit('SCORE_CHANGED')
    }
    // -----

    private showEditPanel() {
        this.addButton.active = true
        this.nameBox.node.worldPosition = this.startBoxPosition
    }

    private hideEditPanel() {
        this.addButton.active = false
        this.nameBox.node.worldPosition = this.hidePosition
    }

    private showRestart() {
        this.resetButton.active = true
    }

    private hideRestart() {
        this.resetButton.active = false
    }

    private addRecordToList(record: RecordPlayerType) {
        let recordNode = instantiate(this.recordPrefab)
        recordNode.name = '' + record.score
        recordNode.setParent(this.container.node)

        let recordComponent = recordNode.getComponent(UIRecordComponent)
        recordComponent.setData(record.name, record.score)
    }
}