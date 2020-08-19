import { ModelObj, SceneStruct, SceneRenderFlags } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext012 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: '半透明度纹理',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_012';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _plane: BABYLON.Mesh;
    let _sphere: BABYLON.Mesh;
    let _material: BABYLON.StandardMaterial;
    let _directLight: BABYLON.DirectionalLight;
    let _directLight_parent: BABYLON.TransformNode;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();

        // 创建材质
        _material = new BABYLON.StandardMaterial('mat', _scene.impl);
        _material.ambientColor = BABYLON.Color3.White();
        _material.diffuseTexture = new BABYLON.Texture('app_scene/scene_res/res/images/Hd3bL4PPMEgg8d1VykdvgF.jpg', _scene.impl);
        _material.opacityTexture = new BABYLON.Texture('app_scene/scene_res/res/images/ray.png', _scene.impl);

        // 往主场景添加模型
        _plane = BABYLON.MeshBuilder.CreatePlane('plane', { }, _scene.impl);
        _plane.material = _material;
        _plane.position.x = -1;
        // 往主场景添加模型
        _sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { }, _scene.impl);
        _sphere.material = _material;
        _sphere.position.x = 1;

        setInterval(() => {
            _plane.rotation.x = (Date.now() % 5000 / 5000) * 2 * Math.PI;
        });
    }
    function uninitCall() {
        _plane.dispose();
        _sphere.dispose();

        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {

        _scene = SceneManager.createScene(_aname);
        if (!_scene.impl.metadata) {
            _scene.impl.metadata = {};
        }
        _scene.impl.metadata.gltfAsLeftHandedSystem = true;
        (<any>window).scene = _scene;
        
        const camera = new BABYLON.FreeCamera(`camera_${_aname}`, new BABYLON.Vector3(0, 6, 14), _scene.impl);
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(_canvas, true);
        _scene.addCamera(camera);
        _scene.setCurrCamera(camera.name);
        _scene.active();
        
        // 设置环境光
        _scene.impl.ambientColor = BABYLON.Color3.White();

        SceneManager.setMainScene(_scene);
    }
    function initDirectionalLight() {
        // 创建方向光 - 固定方向为 Forward
        _directLight = new BABYLON.DirectionalLight('light', BABYLON.Vector3.Forward(), _scene.impl);

        // 创建光的父节点 - 用于控制方向
        _directLight_parent = new BABYLON.TransformNode('light_parent', _scene.impl);
        _directLight.parent = _directLight_parent;
        _directLight_parent.rotation = BABYLON.Vector3.Zero();

        // 光漫反射颜色
        _directLight.diffuse = BABYLON.Color3.White();
        // 光高光颜色
        _directLight.specular = BABYLON.Color3.White();
        // 光照强度
        _directLight.intensity = 1;
    }
}