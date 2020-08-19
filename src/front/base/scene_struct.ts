import { SceneStructBase } from "./scene_struct_base";
import { Scene3DEventInfo, SceneRenderFlags, IModelOpt } from "./base";
import { AppendModelObj, InsertModelObj } from "./model_obj";
import { FactoryScene3D } from "./base_factory";

/**
 * 项目应用层的场景数据结构
 */
export class SceneInstance3D extends SceneStructBase {
    public viewportX: number = 0;
    /**
     * 场景内渲染光表
     */
    public readonly lightMap: Map<string, BABYLON.Light> = new Map();
    /**
     * 场景内 场景环境级别节点表
     */
    public readonly appendMeshMap: Map<string, AppendModelObj> = new Map();
    public readonly pointerDownListenMap: Map<Function, (info: Scene3DEventInfo) => any> = new Map();
    public readonly pointerMoveListenMap: Map<Function, (info: Scene3DEventInfo) => any> = new Map();
    public readonly pointerUpListenMap: Map<Function, (info: Scene3DEventInfo) => any> = new Map();
    public readonly pointerClickListenMap: Map<Function, (info: Scene3DEventInfo) => any> = new Map();
    /**
     *
     * @param sceneName 场景命名
     * @param engine 引擎
     */
    constructor(sceneName: string, engine: BABYLON.Engine) {
        super(sceneName, engine);
        this.onPointerDown = (e: PointerEvent) => {
            (<any>this.impl)._inputManager._onPointerDown(e);
        };
        this.onPointerMove = (e: PointerEvent) => {
            (<any>this.impl)._inputManager._onPointerMove(e);
        };
        this.onPointerUp = (e: PointerEvent) => {
            (<any>this.impl)._inputManager._onPointerUp(e);
        };
        this.onPointerClick = (e: any) => {
            if (this.impl) {
                const rayInfo = this.impl.pick(e.x, e.y);
                this.pointerClickListenMap.forEach((func) => {
                    func({ rayInfo, e, s: undefined });
                });
            }
        };
    }

    public create(engine: BABYLON.Engine) {
        const impl = FactoryScene3D(engine);
        impl.renderTargetsEnabled = true;

        return impl;
    }
    /**
     * 导入场景模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    public importScene(objName: string, opt: IModelOpt = {}) {
        const model = new AppendModelObj(objName, this, opt);

        this.appendMeshMap.set(objName, model);
    }
    /**
     * 插入模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    public insertMesh(objName: string, opt: IModelOpt = {}) {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const model = new InsertModelObj(objName, this, opt);

        return model;
    }
    /**
     * 销毁
     */
    public dispose() {
        this.camera && this.disposeObserver(this.camera);
        this.appendMeshMap.clear();
        this.impl && this.impl.dispose();
        this.camera = undefined;
        this.renderFlag = SceneRenderFlags.dispose;
    }
    /**
     * 停止所有动画
     */
    public stopAnim() {
        this.impl && this.impl.stopAllAnimations();
    }
    public addDownListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerDownListenMap.set(listener, listener);
    }
    public removeDownListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerDownListenMap.delete(listener);
    }
    public addUpListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerUpListenMap.set(listener, listener);
    }
    public removeUpListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerUpListenMap.delete(listener);
    }
    public addMoveListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerMoveListenMap.set(listener, listener);
    }
    public removeMoveListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerMoveListenMap.delete(listener);
    }
    public addClickListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerClickListenMap.set(listener, listener);
    }
    public removeClickListen = (listener: (info: Scene3DEventInfo) => any) => {
        this.pointerClickListenMap.delete(listener);
    }
}
