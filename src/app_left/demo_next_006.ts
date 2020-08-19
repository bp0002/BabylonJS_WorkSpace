import { ModelObj, SceneStruct, SceneRenderFlags } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext006 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: '创建自定义动画',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_006';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _sphere: BABYLON.Mesh;
    let _sphere2: BABYLON.Mesh;
    let _material: BABYLON.StandardMaterial;
    let _directLight: BABYLON.DirectionalLight;
    let _directLight_parent: BABYLON.TransformNode;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
    
        // 创建材质
        _material = new BABYLON.StandardMaterial('mat', _scene.impl);
        _material.ambientColor = new BABYLON.Color3(251/255, 139/255, 5/255);

        _material.diffuseTexture = new BABYLON.Texture('app_scene/scene_res/res/images/Hd3bL4PPMEgg8d1VykdvgF.jpg', _scene.impl);

        // 往主场景添加模型
        _sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { }, _scene.impl);
        _sphere.material = _material;
        
        // 往主场景添加模型
        _sphere2 = BABYLON.MeshBuilder.CreateSphere('sphere2', { }, _scene.impl);
        _sphere2.material = _material;
        _sphere2.scaling.copyFromFloats(2, 2, 2);
        _sphere2.position.y = 2;
    
        // 动画数据可复用
        const anim = createAnimation();

        const animationGroup = new BABYLON.AnimationGroup('sphere_move', _scene.impl);
        animationGroup.addTargetedAnimation(anim, _sphere);
        animationGroup.play(true);
        
        const animationGroup2 = new BABYLON.AnimationGroup('sphere2_move', _scene.impl);
        animationGroup2.addTargetedAnimation(anim, _sphere2);
        animationGroup2.play(true);
    };
    function uninitCall(){
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
    function createAnimation() {
        const anim = new BABYLON.Animation('move', 'position.x', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
        const keys: BABYLON.IAnimationKey[] = [];

        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 30,
            value: 5
        });
        keys.push({
            frame: 60,
            value: -5
        });
        keys.push({
            frame: 90,
            value: 0
        });

        anim.setKeys(keys);

        return anim;
    }
}