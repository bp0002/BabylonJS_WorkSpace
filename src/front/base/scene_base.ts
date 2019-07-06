/**
 * 场景数据结构 - 高层
 */
import { NodeTools } from './scene_tool';
import { InsertModelObj, AppendModelObj } from './model_instance';

//////////////////////////////////////
///
//////////////////////////////////////

/**
 * 项目框架下 - 场景中数据结构
 */
export interface Scene3DEventInfo {
    e: BABYLON.PointerInfo;
    s: BABYLON.EventState;
}

export enum CAMERATYPES {
    ArcRotateCamera = 'ArcRotateCamera',
    UniversalCamera = 'UniversalCamera',
    TargetCamera = 'TargetCamera'
}

export enum RenderFlags {
    active = 'active',
    pause = 'pause',
    dispose = 'dispose'
}

export enum LIGHTTYPES {
    HemisphericLight = 'HemisphericLight'
}

export let ResPath      = 'game/app/scene_res/res/';
export let SceneResPath = 'scenes/';
export let ModelResPath = 'models/';
export let NodeResPath  = 'models/';
export let EffectResPath = 'effects/';

/**
 * 场景内可做变换的对象结构
 */
export interface ITransformObj {
    /**
     * 3D 节点定位
     */
    position?: [number, number, number];
    /**
     * 3D 节点旋转
     */
    rotation?: [number, number, number];
    /**
     * 3D 节点缩放
     */
    scaling?: [number, number, number];
}

/**
 * 场景内可做变换的对象结构
 */
export interface ITransformObj2 {
    /**
     * 3D 节点定位
     */
    position?: BABYLON.Vector3;
    /**
     * 3D 节点旋转
     */
    rotation?: BABYLON.Vector3;
    /**
     * 3D 节点缩放
     */
    scaling?: BABYLON.Vector3;
    /**
     * 3D 节点旋转四元数
     */
    rotationQuaternion?: BABYLON.Quaternion;
}

/**
 * 3D 节点变换配置
 */
export interface ITransformCfg {
    /**
     * 3D 节点定位
     */
    position?: [number, number, number];
    /**
     * 3D 节点旋转
     */
    rotate?: [number, number, number];
    /**
     * 3D 节点缩放
     */
    scale?: [number, number, number];
}

/**
 * 模型数据结构
 */
export interface IModelInstance extends ITransformObj {
    rayID: number;
    /**
     * 节点/模型 名称
     */
    name: string;
    /**
     * 节点/模型 资源子路径
     */
    path: string;
    /**
     * 节点/模型 资源文件名称
     */
    fileName: string;
    /**
     * 节点/模型 资源文件中模型名称
     */
    modelName: string;
    /**
     * 节点/模型 资源加载成功回调
     */
    loadedCall?: Function;
    /**
     * 节点/模型 资源加载成功回调
     */
    insertedCall?: Function;
}

/**
 * 模型加载配置数据结构
 */
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
    modelName: string;
    /**
     * 要加载的模型在所属资源管理路径下的子路径
     * * 资源文件子路径
     */
    path?: string;
    /**
     * 要加载的模型的资源文件名称
     * * 资源文件名称
     */
    fileName: string;
    onlyUseRoot?: boolean;
    isEffect?: boolean;
    animDefault?: boolean;
    /**
     * 加载成功的回调
     */
    loadedCall?(model: AppendModelObj): any;
    /**
     * 加载成功的回调
     */
    insertedCall?(model: InsertModelObj): any;
}

/**
 * 模型的 子 模型加载数据结构
 */
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
    mesh?: BABYLON.Mesh;
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

    successCall?(OPT: IModelChildOpt): void;
}

/**
 * 模型的 附加<附加于一个模型上> 数据结构
 */
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
    mesh?: BABYLON.Mesh;
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

/**
 * 模型动画配置 数据结构
 */
export interface IModelAnimOpt {
    /**
     * 目标动画名称
     */
    animName: string;
    /**
     *
     */
    goEnd?: boolean;
    /**
     * 是否循环播放
     */
    isLoop: boolean;
    /**
     * 动画结束状态
     */
    stopFlag?: number;
    /**
     * 动画结束回调
     */
    endCall?: Function;
    /**
     * 动画速度
     */
    speed?: number;
    /**
     * 是否要停止前一个动画
     */
    needStop?: boolean;
}