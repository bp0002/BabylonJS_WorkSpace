import { ModelObj, SceneStruct } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext010 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: 'FOG - 环境雾',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_010';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _model2: ModelObj;
    let _directLight: BABYLON.DirectionalLight;
    let _directLight_parent: BABYLON.TransformNode;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
        initDirectionalLight();
    
        // 往主场景添加模型
        _model = new ModelObj(`mod_poly_033`, _scene, {
            fileName: `mod_poly_033`,
            path: `mod_poly_033/`,
            particleAutoStart: true,
            animDefault: true,
            insertedCall: () => {
                console.log(`模型 mod_poly_033 加载成功`);
            }
        });

        // 往主场景添加模型
        _model2 = new ModelObj(`sce_map01`, _scene, {
            fileName: `sce_map01`,
            path: `sce_map01/`,
            particleAutoStart: true,
            insertedCall: () => {
                console.log(`模型 sce_map01 加载成功`);
            }
        });

        // 导入 设置
        _scene.importScene('sce', {
            fileName: 'sce_map01',
            path: 'sce_map01_fog/'
        });
        // 手动设置
        // _scene.impl.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        // _scene.impl.fogDensity = 1.0 / 10; // 运行效果为 Unity 参数的 0.1 倍
        // _scene.impl.fogEnabled = true; 
        // _scene.impl.fogStart = 0;
        // _scene.impl.fogEnd = 10;
    };
    function uninitCall(){
        _model.dispose();
        _model2.dispose();

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
        
        const camera = new BABYLON.FreeCamera(`camera_${_aname}`, new BABYLON.Vector3(0, 8, 11.5), _scene.impl);
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        // camera.setTarget(BABYLON.Vector3.Zero());
        camera.rotation = new BABYLON.Vector3(35 / 180 * Math.PI, Math.PI, 0);
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