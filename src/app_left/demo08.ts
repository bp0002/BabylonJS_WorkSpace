import { ModelObj, ResPath, SceneStruct } from "../pi_babylon/scene_base"
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { CameraTool, LoaderTool } from "../pi_babylon/scene_tool";

/**
 * 设置模型动画
 */
export namespace DemoAction08 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: 'demo08',
            desc: '正交相机 旋转/平移',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

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
        _modelInsert = _scene.insertMesh('model_treeman', {
            // 目标模型文件 相对 ResPath 的目录路径
            path: 'model_treeman/',
            // 目标模型文件 名称
            fileName: 'model_treeman',
            // 加载成功的回调
            insertedCall: () => {
                // alert(`model_treeman 加载成功`);
            }
        });

        CameraTool.changeCameraOrth(_camera, 10, canvas.width, canvas.height, false);

        // 控制相机 位置/旋转，需要为相机创建父节点，实际控制相机父节点 - 相机位置置 0，0，0
        const _camera_parent = new BABYLON.TransformNode('CAMERA_PARENT', _scene.impl);
        _camera.position.copyFromFloats(0, 0, 0);
        _camera.parent = _camera_parent;

        _camera_parent.position.copyFromFloats(0, 5, 15);
        _camera_parent.rotation.copyFromFloats(0, 0, 0);
        // 位移
        setTimeout(() => {
            _camera_parent.position.copyFromFloats(-5, 5, 15);
        }, 1000);
        // 旋转
        setTimeout(() => {
            _camera_parent.rotation.copyFromFloats(30 / 180 * Math.PI, 0, 0);
        }, 2000);
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
        
        // 创建相机 - 相机位置置 0，0，0
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, 15), _scene.impl);
        // 设置为 透视相机模式
        camera.mode = BABYLON.FreeCamera.ORTHOGRAPHIC_CAMERA;
        camera.setTarget(BABYLON.Vector3.Zero());
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