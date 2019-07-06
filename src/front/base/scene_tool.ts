
import { ITransformCfg, ITransformObj2 } from './scene_base';
import { AppendModelObj, InsertModelObj } from './model_instance';

export class NodeTools {
    /**
     * 旋转 Mesh - 自转
     * @param mesh 目标mesh
     * @param rotate 旋转参数： [ x, y, z ]
     */
    public static rotateNode(node: ITransformObj2, rotate: [number, number, number]) {
        if (!node.rotationQuaternion) {
            node.rotationQuaternion = new BABYLON.Quaternion();
        }

        NodeTools.rotateQuaternion(node.rotationQuaternion, rotate);
    }
    /**
     * 旋转 Mesh - 自转
     * @param quaternion 目标 Quaternion
     * @param rotate 旋转参数： [ x, y, z ]
     */
    public static rotateQuaternion(quaternion: BABYLON.Quaternion, rotate: [number, number, number]) {
        // YXZ
        BABYLON.Quaternion.RotationYawPitchRollToRef(rotate[1] - Math.PI, rotate[0], -rotate[2], quaternion);
    }
    public static positNode(node: ITransformObj2, data: [number, number, number]) {
        // node.position = new BABYLON.Vector3(-data[0], data[1], -data[2]);
        (<BABYLON.Vector3>node.position).set(-data[0], data[1], -data[2]);
    }
    public static scaleNode(node: ITransformObj2, data: [number, number, number]) {
        node.scaling = new BABYLON.Vector3(data[0], data[1], -data[2]);
    }
    public static nodeLookAt(node: BABYLON.Mesh, data: [number, number, number]) {
        node.lookAt(new BABYLON.Vector3(data[0], data[1], -data[2]));
    }
    public static nodeTransform(node: BABYLON.Mesh, transform: ITransformCfg | undefined) {
        if (transform !== undefined) {
            if (transform.position) {
                NodeTools.positNode(<ITransformObj2>node, transform.position);
            }
            if (transform.scale) {
                NodeTools.scaleNode(<ITransformObj2>node, transform.scale);
            }
            if (transform.rotate) {
                NodeTools.rotateNode(<ITransformObj2>node, transform.rotate);
            }
        }
    }
    public static translatePosition(data: [number, number, number]) {
        data[0] = -data[0];
        data[1] = data[1];
        data[2] = -data[2];
    }
    public static translateRotate(data: [number, number, number]) {
        data[0] = data[0];
        data[1] = data[1] - Math.PI;
        data[2] = -data[2];
    }
    public static translateQuaternion(data: [number, number, number]) {
        const quaternion: BABYLON.Quaternion = new BABYLON.Quaternion();
        NodeTools.rotateQuaternion(quaternion, data);

        return quaternion;
    }
    public static translateScale(data: [number, number, number]) {
        data[0] = data[0];
        data[1] = data[1];
        data[2] = -data[2];
    }
}

// tslint:disable-next-line:no-unnecessary-class
export class LoaderTool {
    public static appendMesh(model: AppendModelObj) {
        const name      = model.name;
        const path      = model.path;
        const fileName  = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;

        // BABYLON.SceneLoader.Append(`${ResPath}${SceneResPath}${path}`, `${fileName}.scene.gltf`, sceneImpl, model.appened);
        BABYLON.SceneLoader.AppendAsync(`${path}`, `${fileName}.gltf`, sceneImpl).then(
            (res) => {
                model.appened(res);
            }
        );
    }
    public static loadMesh(model: InsertModelObj) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;

        BABYLON.SceneLoader.ImportMesh(modelName, `${path}`, `${fileName}.gltf`, sceneImpl, model.loaded);
    }
    public static loadEffect(model: InsertModelObj) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;

        BABYLON.SceneLoader.ImportMesh(modelName, `${path}`, `${fileName}.gltf`, sceneImpl, model.loaded);
    }
}
