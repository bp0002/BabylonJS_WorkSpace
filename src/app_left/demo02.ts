import { ModelObj, ResPath, SceneStruct } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoAction02 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: 'demo02',
            desc: '主场景渲染',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
    };
    function uninitCall(){
        // 销毁场景
        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {

        // 创建场景
        _scene = SceneManager.createScene('mainScene');
        (<any>window).scene = _scene;
        
        // 创建相机
        const camera = new BABYLON.FreeCamera('camera2D', new BABYLON.Vector3(5, 5, 5), _scene.impl);
        // 设置为 透视相机模式
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        // 设置相机目标点
        camera.setTarget(BABYLON.Vector3.Zero());
        // 为场景添加相机记录
        _scene.addCamera(camera);
        // 为场景设置活动相机
        _scene.setCurrCamera(camera.name);
        // 激活场景渲染 - 必须先有活动相机
        _scene.active();

        // 设置渲染前清屏颜色
        _scene.impl.clearColor = new BABYLON.Color4(237/255, 51/255, 33/255, 1);

        // 设置场景管理器主场景
        SceneManager.setMainScene(_scene);
    }
}