import { InsertModelObj, AppendModelObj } from "./model_obj";
import { SceneInstance3D } from "./scene_struct";

/**
 * 项目框架下 - 场景中数据结构
 */
export interface Scene3DEventInfo {
    rayInfo: any;
    e: BABYLON.PointerInfo;
    s: BABYLON.EventState | undefined;
}

export enum CAMERATYPES {
    ArcRotateCamera = 'ArcRotateCamera',
    UniversalCamera = 'UniversalCamera',
    TargetCamera = 'TargetCamera'
}

export enum SceneRenderFlags {
    active = 'active',
    pause = 'pause',
    dispose = 'dispose'
}

export enum LIGHTTYPES {
    HemisphericLight = 'HemisphericLight'
}

/**
 * [自定义名称, 要修改的gltf.images 列表序号, 目标图片相对模型文件的路径, 图片变纹理时是否需要反转Y轴]
 */
export type IImageSolt = [string, number, string, boolean?];
/**
 * [自定义名称, 要修改的gltf.materials 列表序号, [对应extension.PI_material 的属性名,属性值] ]
 */
export type IMaterialSolt = [string, number, [string, any][]];

// tslint:disable-next-line:interface-name
export interface ITransformObj {
    /**
     * 3D 节点定位
     */
    position: BABYLON.Vector3;
    /**
     * 3D 节点旋转
     */
    rotation?: BABYLON.Vector3;
    /**
     * 3D 节点缩放
     */
    scaling?: BABYLON.Vector3;
}
/**
 * 3D 节点变换配置
 */
// tslint:disable-next-line:interface-name
export interface ITransformCfg {
    /**
     * 3D 节点定位
     */
    position?: number[];
    /**
     * 3D 节点旋转
     */
    rotate?: number[];
    /**
     * 3D 节点缩放
     */
    scale?: number[];
}

/**
 * 模型加载配置
 */
// tslint:disable-next-line:interface-name
export interface IModelOpt {
    /**
     * 父节点
     */
    parent?: InsertModelObj;
    /**
     * rayID
     */
    rayID?: number;
    /**
     * 要加载的模型名称
     * * 美术资源(GLTF) 中定义的模型名称
     */
    modelName?: string | string[];
    /**
     * 要加载的模型在所属资源管理路径下的子路径
     * * 资源文件子路径
     */
    path?: string;
    /**
     * 要加载的模型的资源文件名称
     * * 资源文件名称
     */
    fileName?: string;
    isEffect?: boolean;
    /**
     * 自动播放动画 - 默认为第一个
     */
    animDefault?: boolean;
    /**
     * 自动播放粒子
     */
    particleAutoStart?: boolean;
    /**
     * 使用深度预通过
     */
    needDepthPrePass?: boolean;
    /**
     * 控制当前动画完全结束才会切换到目标动画
     */
    workWithAnimationGroupChange?: boolean;
    /**
     * 模型纹理槽数据
     */
    imageSolts?: string[] | IImageSolt[];
    /**
     * 模型纹理槽数据
     */
    materialSolts?: string[] | IMaterialSolt[];
    /**
     * 加载成功的回调
     */
    loadedCall?(model: AppendModelObj): any;
    /**
     * 加载成功的回调
     */
    insertedCall?(model: InsertModelObj): any;
}

// tslint:disable-next-line:interface-name
export interface IModelChildOpt {
    name: string;
    /**
     * 模型加载参数
     */
    modelOpt?: IModelOpt;
    /**
     * 模型
     */
    model?: InsertModelObj;
    /**
     * MESH
     */
    mesh?: BABYLON.AbstractMesh;
    /**
     * 变换设置
     */
    transform?: ITransformCfg;
    /**
     * 附加成功标识
     */
    isFinished?: boolean;
    /**
     * 加載好的動畫狀態
     */
    isLoop?: boolean;

    successCall?(OPT: IModelChildOpt) : void;
}

// tslint:disable-next-line:interface-name
export interface IModelAttachOpt {
    name: string;
    /**
     * 模型加载参数
     */
    modelOpt?: IModelOpt;
    /**
     * 模型
     */
    model?: InsertModelObj;
    /**
     * MESH
     */
    mesh?: BABYLON.AbstractMesh;
    /**
     * 附加到目标 skeleton
     */
    skeletonName: string;
    /**
     * 附加到目标 骨头
     */
    boneName: string;
    /**
     * 变换设置
     */
    transform?: ITransformCfg;
}

// tslint:disable-next-line:interface-name
export interface IModelAnimOpt {
    animName: string;
    goEnd?: boolean;
    isLoop: boolean;
    stopFlag?: number;
    endCall?: Function;
    startCall?: Function;
    speed?: number;
    needStop?: boolean; // 是否要停止前一个动画
}

// tslint:disable-next-line:interface-name
export interface INodeObj extends ISceneObj {
    rayID: number;
    /**
     * 节点/模型 名称
     */
    name: string;
    /**
     * 节点/模型 资源子路径
     */
    path: string | undefined;
    /**
     * 节点/模型 资源文件名称
     */
    fileName: string | undefined;
    /**
     * 节点/模型 资源文件中模型名称
     */
    modelName: string | string[] | undefined;
    /**
     * 节点/模型 资源加载成功回调
     */
    loadedCall?: Function;
    /**
     * 节点/模型 资源加载成功回调
     */
    insertedCall?: Function;
}

// tslint:disable-next-line:interface-name
export interface ISceneObj {
    /**
     * 3D 节点所在场景
     */
    scene: SceneInstance3D | undefined;
    /**
     * 3D 节点销毁接口
     */
    dispose: Function;
    /**
     * 3D 节点变换属性
     */
    rootImpl: ITransformObj | undefined;
}