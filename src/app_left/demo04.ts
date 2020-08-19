import { ModelObj, ResPath, SceneStruct } from "../pi_babylon/scene_base"
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { LoaderTool } from "../pi_babylon/scene_tool";

/**
 * 设置模型动画
 */
export namespace DemoAction04 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: 'demo04',
            desc: '模型 平移/旋转/缩放',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _modelInsert: ModelObj;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        // 指定一个场景资源目录
        // ResPath = 'app_scene/scene_res/res/';
        LoaderTool.getResPath = () => 'app_scene/scene_res/res/';

        initScene();
        
        // 场景内插入模型
        _modelInsert = _scene.insertMesh('dice', {
            // 目标模型文件 相对 ResPath 的目录路径
            path: 'dice/',
            // 目标模型文件 名称
            fileName: 'dice',
            // 加载成功的回调
            insertedCall: () => {
                alert(`dice 加载成功`);

                // 延时再修改位置
                setTimeout(() => {
                    _modelInsert.setPostion([-2, -2, -2]);
                }, 1000);
                // 延时再修改缩放
                setTimeout(() => {
                    _modelInsert.setScale([2, 2, 2]);
                }, 1000);
                // 延时再修改旋转
                setTimeout(() => {
                    _modelInsert.setRotate([45 / 180 * Math.PI, 0, 0]);
                }, 1000);
            }
        });

        // 设置自定义位置
        _modelInsert.setPostion([1, 1, 1]);

        // 设置自定义缩放
        _modelInsert.setScale([2, 1, 1]);

        // 设置自定义旋转
        _modelInsert.setRotate([0, 0, 0]);
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
        // 设置相机目标点
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(_canvas, true);
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

        // 设置场景管理器主场景
        SceneManager.setMainScene(_scene);
    }
}