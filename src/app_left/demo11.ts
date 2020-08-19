import { ModelObj, ResPath, SceneStruct } from "../pi_babylon/scene_base"
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { CameraTool, LoaderTool } from "../pi_babylon/scene_tool";

/**
 * 设置模型动画
 */
export namespace DemoAction11 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: '粒子特效',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }
    
    const name = 'DemoAction11';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _modelInsert: ModelObj;
    let _camera: BABYLON.FreeCamera;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        // 指定一个场景资源目录
        // ResPath = 'app_scene/scene_res/res/';
        LoaderTool.getResPath = () => 'app_scene/scene_res/res/';

        initScene();
        
        // 场景内插入模型
        _modelInsert = new ModelObj('eff_char_007_attack', _scene, {
            fileName: 'eff_perfect_001',
            path: 'eff_perfect_001/',
            particleAutoStart: true,
            animDefault: true,
            insertedCall: () => {
                console.log('smoke02 创建成功');
                // _modelInsert.animationMap.forEach((anim) => {
                //     anim.play(true);
                // });
                
                // setTimeout(() => {
                //     _modelInsert.setPostion([5, 2, 2])
                // }, 2000);
                
                // setTimeout(() => {
                //     _modelInsert.setRotate([1, 1, 1])
                // }, 4000);

                // setTimeout(() => {
                //     _modelInsert.setScale([2, 2, 2])
                // }, 9000);
            }
        });

        (<any>window).model = _modelInsert;

    };
    function uninitCall(){

        _modelInsert.dispose();

        // 销毁场景
        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {

        // 创建场景
        _scene = SceneManager.createScene('mainScene');
        if (!_scene.impl.metadata) {
            _scene.impl.metadata = {};
        }
        _scene.impl.metadata.gltfAsLeftHandedSystem = true;
        (<any>window).scene = _scene;
        
        // 创建相机
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), _scene.impl);
        // 设置为 透视相机模式
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        // camera.setTarget(BABYLON.Vector3.Zero());
        camera.fov = 90 / 180 * Math.PI;
        // 为场景添加相机记录
        _scene.addCamera(camera);
        // 为场景设置活动相机
        _scene.setCurrCamera(camera.name);
        // 激活场景渲染 - 必须先有活动相机
        _scene.active();

        // 设置渲染前清屏颜色
        _scene.impl.clearColor = new BABYLON.Color4(71/255, 81/255, 100/255, 1);

        // 设置环境光 - 才能正确“看见”模型
        _scene.impl.ambientColor = BABYLON.Color3.White();

        _camera = camera;

        const node = new BABYLON.TransformNode('s', _scene.impl);
        node.rotation = new BABYLON.Vector3(15/180*Math.PI, Math.PI, 0);
        node.position = new BABYLON.Vector3(0, 60, 105);
        camera.parent = node;

        // 设置场景管理器主场景
        SceneManager.setMainScene(_scene);
    }
}