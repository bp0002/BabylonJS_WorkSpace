import { RenderFlags, IModelOpt } from "./scene_base";
import { InsertModelObj, AppendModelObj } from "./model_instance";

export class SceneInstance {
    public readonly name: string;
    public readonly scene: BABYLON.Scene;
    public readonly engine: BABYLON.Engine;
    private _renderFlag: RenderFlags;
    private _camera: BABYLON.Camera | undefined;
    /**
     * 场景内渲染光表
     */
    private readonly lightMap: Map<string, BABYLON.Light> = new Map();
    /**
     * 场景内相机表
     */
    public readonly cameraMap: Map<string, BABYLON.Camera> = new Map();

    constructor(name: string, engine: BABYLON.Engine, opt?: BABYLON.SceneOptions) {
        this.name   = name;
        this.engine = engine;
        this.scene  = new BABYLON.Scene(engine, opt);

        this.cameraMap      = new Map();
        this._renderFlag    = RenderFlags.pause;
    }
    public addLight(lname: string, light: BABYLON.Light) {
        if (this.lightMap.get(lname)) {
            // TODO
        } else {
            this.lightMap.set(lname, light);
        }
    }
    public removeLight(lname: string) {
        if (this.lightMap.get(lname)) {
            this.lightMap.delete(lname);
        } else {
            // TODO
        }
    }
    public readLight(lname: string) {
        return this.lightMap.get(lname);
    }
    public get activeCamera() {
        return this._camera;
    }
    public set activeCamera(camera: BABYLON.Camera | undefined) {
        if (camera) {
            this._camera = camera;
            this.scene.activeCamera = camera;
        }
    }
    public get renderFlag() {
        return this._renderFlag;
    }
    public set renderFlag(flag: RenderFlags) {
        this._renderFlag = flag;
    }

    public activeObserver = () => {
        console.warn(`Scene ${this.name} active!`);
    }
    public disposeObserver = () => {
        console.warn(`Scene ${this.name} dispose!`);
    }
    public changeCameraObserver = (camera: BABYLON.Camera) => {
        console.log(`Scene ${this.name} camera change: ${camera.name}`);
    }
    public removeCameraObserver = (camera: BABYLON.Camera) => {
        console.log(`Scene ${this.name} camera change: ${camera.name}`);
    }
    /**
     * 设置当前活动相机
     * @param cameraName 目标相机名称
     * * 在场景内部相机表中查找
     */
    public setActiveCamera(cameraName: string) {
        const camera = this.cameraMap.get(cameraName);
        if (!!camera) {
            this.activeCamera = camera;

            this.changeCameraObserver(this.activeCamera);

            // if (FormatCanvasDisplay.getIsWeixinGAME()) {
                // CameraTool.computeViewPort(camera);
            // }
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

            if (this.activeCamera === camera) {
                this.removeCameraObserver(camera);
                this.activeCamera   = undefined;
                this.renderFlag     = RenderFlags.pause;
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
        //
    }

    /**
     * 销毁
     */
    public dispose() {

        this.scene.dispose();
        this._camera    = undefined;
        this.renderFlag = RenderFlags.dispose;

        this.cameraMap.clear();

        this.disposeObserver();
    }

    /**
     * 暂停渲染
     */
    public pause = () => {
        this.renderFlag = RenderFlags.pause;
        this.scene.onPointerObservable.removeCallback(this.pickCall);
    }

    /**
     * 激活渲染
     */
    public active = () => {
        // 未销毁
        if (this.renderFlag !== RenderFlags.dispose) {

            // 未激活
            if (this.renderFlag !== RenderFlags.active) {
                if (this.isReady()) {
                    if (!this.scene.onPointerObservable.hasObservers()) {
                        this.scene.onPointerObservable.add(this.pickCall);
                    }

                    this.renderFlag = RenderFlags.active;

                    this.activeObserver();
                } else {
                    console.warn(`场景 ${this.name} 未准备完毕，不能激活`);
                }

            } else {
                console.warn(`场景 ${this.name} 重复激活`);
            }
        } else {
            console.warn(`场景 ${this.name} 已被销毁`);
        }
    }
    /**
     * 检查场景是否准备结束，可激活
     */
    public isReady() {
        let result: boolean = true;

        result = result && this.activeCamera !== undefined;

        return result;
    }
}

export class SceneInstance3D extends SceneInstance {
    /**
     * 场景内 场景环境级别节点表
     * * append 方式加载的
     */
    private readonly appendMeshMap: Map<string, AppendModelObj> = new Map();
    private readonly insertMeshMap: Map<string, InsertModelObj> = new Map();
    public readonly pointerDownListenMap:   Map<Function, (info: any) => any> = new Map();
    public readonly pointerMoveListenMap:   Map<Function, (info: any) => any> = new Map();
    public readonly pointerUpListenMap:     Map<Function, (info: any) => any> = new Map();
    public readonly pointerClickListenMap:  Map<Function, (info: any) => any> = new Map();

    /**
     * 导入场景模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    public appendScene(objName: string, opt: IModelOpt = <any>{}) {
        const model = new AppendModelObj(objName, this, opt);

        this.appendMeshMap.set(objName, model);
    }
    public removeAppend(model: AppendModelObj) {
        this.appendMeshMap.delete(model.name);
    }

    /**
     * 插入模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    public insertMesh(objName: string, opt: IModelOpt = <any>{}) {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const model = new InsertModelObj(objName, this, opt);

        this.insertMeshMap.set(objName, model);

        return model;
    }

    public removeInsert(model: InsertModelObj) {
        this.insertMeshMap.delete(model.name);
    }

    public addDownListen = (listener: (info: any) => any) => {
        this.pointerDownListenMap.set(listener, listener);
    }
    public removeDownListen = (listener: (info: any) => any) => {
        this.pointerDownListenMap.delete(listener);
    }
    public addUpListen = (listener: (info: any) => any) => {
        this.pointerUpListenMap.set(listener, listener);
    }
    public removeUpListen = (listener: (info: any) => any) => {
        this.pointerUpListenMap.delete(listener);
    }
    public addMoveListen = (listener: (info: any) => any) => {
        this.pointerMoveListenMap.set(listener, listener);
    }
    public removeMoveListen = (listener: (info: any) => any) => {
        this.pointerMoveListenMap.delete(listener);
    }
    public addClickListen = (listener: (info: any) => any) => {
        this.pointerClickListenMap.set(listener, listener);
    }
    public removeClickListen = (listener: (info: any) => any) => {
        this.pointerClickListenMap.delete(listener);
    }

    /**
     * 销毁
     */
    public dispose() {
        super.dispose();

        this.appendMeshMap.clear();
    }
}