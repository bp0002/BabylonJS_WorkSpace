import { ModelObj, ResPath, SceneStruct } from "../pi_babylon/scene_base"
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { CameraTool, LoaderTool } from "../pi_babylon/scene_tool";

/**
 * 设置模型动画
 */
export namespace DemoAction12 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: '粒子特效 - 绑定到骨骼',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const name = 'DemoAction12';

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
        _modelInsert = new ModelObj('model_char_007', _scene, {
            fileName: 'model_char_007',
            path: 'model_char_007/',
            particleAutoStart: true,
            insertedCall: () => {
                console.log('model_char_007 创建成功');
                // _modelInsert.animationMap.forEach((anim) => {
                //     anim.play(true);
                // });
            }
        });

        _modelInsert.setAnim({
            animName: 'anim_char_007_idle',
            isLoop: true
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
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, 15), _scene.impl);
        // 设置为 透视相机模式
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.fov = 40 / 180 * Math.PI;
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

        // 设置场景管理器主场景
        SceneManager.setMainScene(_scene);
    }
}