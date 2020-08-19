/**
 *
 */
import { ITransformCfg, ITransformObj } from './base';
import { AppendModelObj, InsertModelObj } from './model_obj';

// tslint:disable-next-line:no-unnecessary-class
export class NodeTools {
    public static sceneAsRightHand: boolean = false;
    /**
     * 旋转 Mesh - 自转
     * @param mesh 目标mesh
     * @param rotate 旋转参数： [ x, y, z ]
     */
    public static rotateNode(node: ITransformObj, rotate: number[]) {
        // if (!node.rotationQuaternion) {
        //     node.rotationQuaternion = new BABYLON.Quaternion();
        // }

        // NodeTools.rotateQuaternion(node.rotationQuaternion, rotate);
    }
    /**
     * 旋转 Mesh - 自转
     * @param quaternion 目标 Quaternion
     * @param rotate 旋转参数： [ x, y, z ]
     */
    public static rotateQuaternion(quaternion: BABYLON.Quaternion, rotate: number[]) {
        // YXZ
        if (NodeTools.sceneAsRightHand) {
            BABYLON.Quaternion.RotationYawPitchRollToRef(rotate[1] - Math.PI, rotate[0], -rotate[2], quaternion);
        } else {
            BABYLON.Quaternion.RotationYawPitchRollToRef(rotate[1], rotate[0], rotate[2], quaternion);
        }
    }
    public static positNode(node: ITransformObj, data: number[]) {
        if (NodeTools.sceneAsRightHand) {
            node.position.set(-data[0], data[1], -data[2]);
        } else {
            node.position.set(data[0], data[1], data[2]);
        }
    }
    public static scaleNode(node: ITransformObj, data: number[]) {
        if (NodeTools.sceneAsRightHand) {
            node.scaling = new BABYLON.Vector3(data[0], data[1], -data[2]);
        } else {
            node.scaling = new BABYLON.Vector3(data[0], data[1], data[2]);
        }
    }
    public static nodeLookAt(node: BABYLON.TransformNode, data: number[]) {
        if (NodeTools.sceneAsRightHand) {
            node.lookAt(new BABYLON.Vector3(data[0], data[1], -data[2]));
        } else {
            node.lookAt(new BABYLON.Vector3(data[0], data[1], data[2]));
        }
    }
    public static nodeTransform(node: BABYLON.TransformNode, transform: ITransformCfg) {
        if (transform !== undefined) {
            if (transform.position) {
                NodeTools.positNode(node, transform.position);
            }
            if (transform.scale) {
                NodeTools.scaleNode(node, transform.scale);
            }
            if (transform.rotate) {
                NodeTools.rotateNode(node, transform.rotate);
            }
        }
    }
}

// tslint:disable-next-line:no-unnecessary-class
export class CameraTool {
    /**
     * 修改 正交相机视角
     * @param size 正交相机视角大小
     */
    public static changeCameraOrth(camera: BABYLON.FreeCamera, size: number, width: number, height: number, sizeForWidth: boolean = false) {
        const yDistance = sizeForWidth ? Math.round(size / width / height * 100) / 100 : size;
        const xDistance = sizeForWidth ? size : Math.round(size * width / height * 100) / 100;
        camera.orthoLeft = -xDistance;
        camera.orthoRight = xDistance;
        camera.orthoTop = yDistance;
        camera.orthoBottom = -yDistance;
    }

    public static getAccurateSize(xDistance: number, w: number, h: number) {
        return xDistance / (w / h);
    }
}

// tslint:disable-next-line:no-unnecessary-class
export namespace LoaderTool {
    let _ResPath        = '';
    let _SceneResPath   = '';
    let _ModelResPath   = '';
    let _NodeResPath    = '';
    let _EffectResPath  = '';

    export let getResPath = () => {
        return _ResPath;
    }
    export let getSceneResPath = () => {
        return _SceneResPath;
    }
    export let getModelResPath = () => {
        return _ModelResPath;
    }
    export let getNodeResPath = () => {
        return _NodeResPath;
    }
    export let getEffectResPath = () => {
        return _EffectResPath;
    }
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    export function loadScene(model: AppendModelObj, targetPath?: string, targetFile?: string) {
        if (!model.scene) {
            return undefined;
        }

        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;

        targetPath = targetPath ? targetPath : `${getResPath()}${getSceneResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;

        return BABYLON.SceneLoader.Append(targetPath, targetFile, sceneImpl, model.appened, (e) => {
            console.log(e);
        });
    }
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    export function loadSceneAsync(model: AppendModelObj, targetPath?: string, targetFile?: string) {
        if (!model.scene) {
            return Promise.reject("loadSceneAsync Error: not get scene");
        }

        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;

        targetPath = targetPath ? targetPath : `${getResPath()}${getSceneResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;

        return BABYLON.SceneLoader.AppendAsync(targetPath, targetFile, sceneImpl, (e) => {
            console.log(e);
        }).then(
                (res) => {
                    model.appened(res);
                }
            );
    }
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    export function insertMesh(model: InsertModelObj, targetPath?: string, targetFile?: string) {
        if (!model.scene) {
            return undefined;
        }

        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;

        targetPath = targetPath ? targetPath : `${getResPath()}${getModelResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;

        // return BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, (e) => {
        //     console.log(e);
        // }, undefined, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts });
        return BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, (e) => {
            console.log(e);
        }, undefined, undefined);

    }
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    export function insertMeshAsync(model: InsertModelObj, targetPath?: string, targetFile?: string) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;

        targetPath = targetPath ? targetPath : `${getResPath()}${getModelResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;

        // return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, (e) => {
        //     console.log(e);
        // }, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts }).then(
        //         (res) => {
        //             model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
        //         }
        //     );
        return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, (e) => {
            console.log(e);
        }, undefined).then(
                (res) => {
                    model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
                }
            );
    }
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    export function insertEffect(model: InsertModelObj, targetPath?: string, targetFile?: string) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;

        targetPath = targetPath ? targetPath : `${getResPath()}${getEffectResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;

        // BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, undefined, undefined, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts });
        BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, undefined, undefined, undefined);
    }
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    export function insertEffectAsync(model: InsertModelObj, targetPath?: string, targetFile?: string) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;

        targetPath = targetPath ? targetPath : `${getResPath()}${getEffectResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;

        // return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, undefined, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts })
        //     .then(
        //         (res) => {
        //             model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
        //         }
        //     );
        return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, undefined, undefined)
            .then(
                (res) => {
                    model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
                }
            );
    }
}