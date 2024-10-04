import { _decorator, Component, screen, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResizeScreenComponent')
export class ResizeScreenComponent extends Component {


    start() {
        screen.on('window-resize', this.resize, this);
    }

    resize() {
        const designResolution = view.getDesignResolutionSize();

        const frameSize = screen.windowSize

        const scaleX = frameSize.width / designResolution.width;
        const scaleY = frameSize.height / designResolution.height;

        // Выбор меньшего масштаба для поддержания пропорций
        const scale = Math.min(scaleX, scaleY);

        // Применение масштаба к Canvas
        this.node.scale = new Vec3(scale, scale, scale);
    }
}


