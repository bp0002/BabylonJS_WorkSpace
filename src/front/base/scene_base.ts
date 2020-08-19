/**
 * 场景数据结构 - 高层
 */
import { AppendModelObj, InsertModelObj } from './model_obj';
import { IImageSolt, IMaterialSolt, ITransformObj, ITransformCfg, IModelOpt, IModelChildOpt, IModelAttachOpt, IModelAnimOpt, INodeObj, ISceneObj, SceneRenderFlags, Scene3DEventInfo } from './base';
import { SceneStructBase } from './scene_struct_base';
import { SceneInstance3D } from './scene_struct';
import { LoaderTool } from './scene_tool';

export let ResPath = 'app/scene_res/res/';
export let SceneResPath = 'scenes/';
export let ModelResPath = 'models/';
export let NodeResPath = 'models/';
export let EffectResPath = 'effects/';

// 仅作导出至项目层的兼容用,需要保证注释后，底层没有引用错误,以确保底层没有循环引用
export {
    IImageSolt,
    IMaterialSolt,
    ITransformObj,
    ITransformCfg,
    IModelOpt,
    IModelChildOpt,
    IModelAttachOpt,
    IModelAnimOpt,
    INodeObj,
    ISceneObj,

    AppendModelObj,
    InsertModelObj as ModelObj,

    SceneStructBase,
    SceneInstance3D as SceneStruct,

    SceneRenderFlags,
    Scene3DEventInfo
}

LoaderTool.getResPath = () => {
    return ResPath;
}
LoaderTool.getSceneResPath = () => {
    return SceneResPath;
}
LoaderTool.getModelResPath = () => {
    return ModelResPath;
}
LoaderTool.getNodeResPath = () => {
    return NodeResPath;
}
LoaderTool.getEffectResPath = () => {
    return EffectResPath;
}