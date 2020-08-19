import { ModelObj, SceneStruct } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext009 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: 'PBR模型 - 麻将',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_009';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _directLight: BABYLON.DirectionalLight;
    let _directLight_parent: BABYLON.TransformNode;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
        initDirectionalLight();
    
        // 往主场景添加模型
        _model = new ModelObj(`root`, _scene, {
            fileName: `root`,
            path: `root/`,
            particleAutoStart: true,
            insertedCall: () => {
                console.log(`模型 root 加载成功`);
                _model.rootImpl.getChildMeshes().forEach(mesh => {
                    const material: BABYLON.PBRMaterial = <any>mesh.material;
                    if (material) {
                        // material.environmentBRDFTexture = null;
                        // material.brdf && (material.brdf.useSphericalHarmonics = false);
                        // material.brdf && (material.brdf.useEnergyConservation = false);
                        // material.enableSpecularAntiAliasing = false;
                        // material.forceIrradianceInFragment = false;
                    }
                });
                _scene.impl.freezeActiveMeshes();
            }
        });

        // 调整
        _scene.impl.imageProcessingConfiguration.exposure = 4;
    };
    function uninitCall(){
        _model.dispose();

        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {

        _scene = SceneManager.createScene(_aname);
        if (!_scene.impl.metadata) {
            _scene.impl.metadata = {};
        }
        _scene.impl.metadata.gltfAsLeftHandedSystem = true;
        (<any>window).scene = _scene;
        (<any>window).scene = _scene;
        
        const camera = new BABYLON.FreeCamera(`camera_${_aname}`, new BABYLON.Vector3(0, 8.5, -10.6), _scene.impl);
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        // camera.setTarget(BABYLON.Vector3.Zero());
        camera.rotation = new BABYLON.Vector3(41 / 180 * Math.PI, 0, 0);
        _scene.addCamera(camera);
        _scene.setCurrCamera(camera.name);
        _scene.active();
        
        // 设置环境光  - 环境光会与其他光照叠加
        _scene.impl.ambientColor = BABYLON.Color3.Black();

        SceneManager.setMainScene(_scene);
    }
    function initDirectionalLight() {
        // 创建方向光 - 固定方向为 Forward
        _directLight = new BABYLON.DirectionalLight('light', BABYLON.Vector3.Forward(), _scene.impl);

        // 创建光的父节点 - 用于控制方向
        _directLight_parent = new BABYLON.TransformNode('light_parent', _scene.impl);
        _directLight.parent = _directLight_parent;

        // 产生阴影与 光方向相关
        _directLight_parent.rotation = new BABYLON.Vector3(85 / 180 * Math.PI, 0, 0);
        // 产生阴影 与 物体与光 相对位置相关
        _directLight_parent.position.x = 0;
        _directLight_parent.position.y = 5;
        _directLight_parent.position.z = 5;

        // 光漫反射颜色
        _directLight.diffuse = BABYLON.Color3.White();
        // 光高光颜色
        _directLight.specular = BABYLON.Color3.White();
        // 光照强度
        _directLight.intensity = 1.4;
    }
}