import { ModelObj, ResPath, SceneStruct } from "../pi_babylon/scene_base"
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { LoaderTool } from "../pi_babylon/scene_tool";

/**
 * 设置模型动画
 */
export namespace DemoAction03 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: 'demo03',
            desc: '模型 创建/销毁',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _modelNew: ModelObj;
    let _modelInsert: ModelObj;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        // 指定一个场景资源目录
        // ResPath = 'app_scene/scene_res/res/';
        LoaderTool.getResPath = () => 'app_scene/scene_res/res/';

        initScene();

        // 创建模型的接口
        _modelNew = new ModelObj('model_treeman', _scene, {
            // 目标模型文件 相对 ResPath 的目录路径
            path: 'city_ground/',
            // 目标模型文件 名称
            fileName: 'city_ground',
            // 加载成功的回调
            insertedCall: () => {
                alert(`model_treeman 加载成功`);
            }
        });

        // 导入环境类型的模型
        _scene.importScene('sce_map01', {
            // 目标模型文件 相对 ResPath 的目录路径
            path: 'sce_map01/',
            // 目标模型文件 名称
            fileName: 'sce_map01',
            // 加载成功的回调
            loadedCall: () => {
                alert(`sce_map01 加载成功`);
            }
        });
        
        // 场景内插入模型
        _modelInsert = _scene.insertMesh('dice', {
            // 目标模型文件 相对 ResPath 的目录路径
            path: 'dice/',
            // 目标模型文件 名称
            fileName: 'dice',
            // 加载成功的回调
            insertedCall: () => {
                alert(`dice 加载成功`);
            }
        });

    };
    function uninitCall(){

        // 模型销毁
        _modelNew.dispose();

        // 模型销毁
        _modelInsert.dispose();

        // 销毁场景
        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {

        // 创建场景
        _scene = SceneManager.createScene('mainScene');
        // 导入模型必须的设置 - 设置场景为左手坐标系
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