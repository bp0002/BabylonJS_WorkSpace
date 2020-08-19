
import { SceneRenderFlags } from "./base";
import { FactorySceneGUI } from "./base_factory";

export class SceneStructBase {
    public engine: BABYLON.Engine;

    /**
     * 场景名称
     */
    public name: string;
    /**
     * 底层场景对象
     */
    public impl: BABYLON.Scene;
    /**
     * 场景渲染状态
     */
    public renderFlag: string = SceneRenderFlags.pause;
    /**
     * 场景当前活动相机
     */
    public camera: BABYLON.Camera | undefined;
    /**
     * 场景内相机表
     */
    public cameraMap: Map<string, BABYLON.Camera> = new Map();
    public beforeRenderCallList: ((scene: SceneStructBase) => void)[] = [];
    public afterRenderCallList: ((scene: SceneStructBase) => void)[] = [];
    public onPointerUp: ((e: PointerEvent) => void) | undefined;
    public onPointerClick: ((e: PointerEvent) => void) | undefined;
    public onPointerMove: ((e: PointerEvent) => void) | undefined;
    public onPointerDown: ((e: PointerEvent) => void) | undefined;
    /**
     *
     * @param sceneName 场景命名
     * @param engine 引擎
     */
    constructor(sceneName: string, engine: BABYLON.Engine) {
        this.name = sceneName;
        this.engine = <BABYLON.Engine>engine;
        this.impl = this.create(engine);
    }
    public create(engine: BABYLON.Engine) {
        return FactorySceneGUI(engine);
    }
    public render = () => {
        if (this.renderFlag === SceneRenderFlags.active) {
            if (this.impl) {
                const gl: WebGLRenderingContext = <any>this.impl.getEngine()._gl;
                gl.disable(gl.SCISSOR_TEST);
                this.beforeRenderCallList.forEach((f) => f(this));
                this.impl.render();
                this.impl.getEngine().wipeCaches(true);
                this.afterRenderCallList.forEach((f) => f(this));
            }
        }
    }
    public activeObserver = (camera: BABYLON.Camera) => {
        console.warn(`Scene ${this.name} active!`);
    }
    public disposeObserver = (camera: BABYLON.Camera) => {
        console.warn(`Scene ${this.name} dispose!`);
    }
    public changeCameraObserver = (camera: BABYLON.Camera) => {
        console.log(`Scene ${this.name} camera change!`);
    }
    public removeCameraObserver = (camera: BABYLON.Camera) => {
        console.log(`Scene ${this.name} camera change!`);
    }
    /**
     * 设置当前活动相机
     * @param cameraName 目标相机名称
     * * 在场景内部相机表中查找
     */
    public setCurrCamera(cameraName: string) {
        const camera = this.cameraMap.get(cameraName);
        if (!!camera && this.impl) {
            this.camera = camera;
            this.impl.activeCamera = camera;
            this.changeCameraObserver(this.camera);
        } else {
            console.warn(`SceneStruct.setCurrCamera：目标场景没有Name为${cameraName}的相机`);
        }
    }
    /**
     * 销毁相机
     * @param cameraName 目标相机名称
     */
    public removeCamera(cameraName: string) {
        const camera = this.cameraMap.get(cameraName);
        if (camera !== undefined) {
            if (this.camera === camera) {
                this.removeCameraObserver(this.camera);
                this.camera = undefined;
                this.renderFlag = SceneRenderFlags.pause;
            }
            this.cameraMap.delete(cameraName);
            camera.dispose();
        }
    }
    /**
     * 添加相机
     * @param camera 目标相机对象
     */
    public addCamera(camera: BABYLON.Camera) {
        this.cameraMap.set(camera.name, camera);
    }

    public pickCall = (e: BABYLON.PointerInfo, s: BABYLON.EventState) => {
        // 由子类实现
    }
    /**
     * 销毁
     */
    public dispose() {
        this.camera && this.disposeObserver(this.camera);
        this.impl && this.impl.dispose();
        this.camera = undefined;
        this.renderFlag = SceneRenderFlags.dispose;
    }
    /**
     * 暂停渲染
     */
    public pause = () => {
        this.renderFlag = SceneRenderFlags.pause;
        this.impl && this.impl.onPointerObservable.removeCallback(this.pickCall);
    }
    /**
     * 激活渲染
     */
    public active = () => {
        if (this.camera !== undefined) {
            if (this.renderFlag !== SceneRenderFlags.dispose) {
                if (this.impl && !this.impl.onPointerObservable.hasObservers()) {
                    this.impl.onPointerObservable.add(this.pickCall);
                }
                this.renderFlag = SceneRenderFlags.active;
                this.activeObserver(this.camera);
            }
        }
    }

    public registerBeforeRenderCall(f: (scene: SceneStructBase) => void) {
        if (this.beforeRenderCallList.indexOf(f) < 0) {
            this.beforeRenderCallList.push(f);
        }
    }
    public unregisterBeforeRenderCall(f: (scene: SceneStructBase) => void) {
        const index = this.beforeRenderCallList.indexOf(f);
        if (index >= 0) {
            this.beforeRenderCallList.splice(index, 1);
        }
    }

    public registerAfterRenderCall(f: (scene: SceneStructBase) => void) {
        if (this.afterRenderCallList.indexOf(f) < 0) {
            this.afterRenderCallList.push(f);
        }
    }
    public unregisterAfterRenderCall(f: (scene: SceneStructBase) => void) {
        const index = this.afterRenderCallList.indexOf(f);
        if (index >= 0) {
            this.afterRenderCallList.splice(index, 1);
        }
    }
}