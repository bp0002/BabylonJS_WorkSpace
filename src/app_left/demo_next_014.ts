import { ModelObj, SceneStruct, SceneRenderFlags } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 轮廓描边
 * * 以膨胀模型方式渲染
 * * 不能正确处理半透明渲染模型
 * * 模型多个面共用点法线需要对齐
 */
export namespace DemoActionNext014 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: 'Unity 动画事件监听',
            btnHeight: '60px',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_014';

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
        _model = new ModelObj(`anim_event`, _scene, {
            fileName: `sce_map01`,
            path: `anim_event/`,
            particleAutoStart: true,
            animDefault: true,
            insertedCall: () => {
                console.log(`模型 anim_event 加载成功`);

                _model.addAnimationEventListen('center', () => { console.log('center'); return false; });
            }
        });
    }
    function uninitCall() {
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

        const camera = new BABYLON.ArcRotateCamera(`camera_${_aname}`, 0.5, 0.2, 10, BABYLON.Vector3.Zero(), _scene.impl);
        // camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        // camera.setTarget(BABYLON.Vector3.Zero());
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

        // 产生阴影与 光方向相关
        _directLight_parent.rotation = new BABYLON.Vector3(60 / 180 * Math.PI, -100 / 180 * Math.PI, -200 / 180 * Math.PI);
        // 产生阴影 与 物体与光 相对位置相关
        _directLight_parent.position.x = 0;
        _directLight_parent.position.y = 5;
        _directLight_parent.position.z = 5;

        // 光漫反射颜色
        _directLight.diffuse = BABYLON.Color3.White();
        // 光高光颜色
        _directLight.specular = BABYLON.Color3.White();
        // 光照强度
        _directLight.intensity = 1;
    }
}