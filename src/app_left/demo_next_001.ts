import { ModelObj, SceneStruct } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager, SceneManagerData } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { getGlobal } from "../pi_sys/util/frame_mgr";

/**
 * 设置模型动画
 */
export namespace DemoActionNext001 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: '多场景渲染',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_001';

    let _scene: SceneStruct;
    let _scene2: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _model2: ModelObj;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
        initScene2();
    
        // 往主场景添加模型
        _model = new ModelObj(`model_treeman`, _scene, {
            fileName: `model_treeman`,
            path: `model_treeman/`,
            particleAutoStart: true,
            animDefault: true,
            insertedCall: () => {
                console.log(`模型 model_treeman 加载成功`);
            }
        });
        
        // 往主场景添加模型
        _model2 = new ModelObj(`sce_map01`, _scene2, {
            fileName: `sce_map01`,
            path: `sce_map01/`,
            particleAutoStart: true,
            insertedCall: () => {
                console.log(`模型 sce_map01 加载成功`);
            }
        });
    
    };
    function uninitCall(){
        _model.dispose();

        SceneManager.disposeScene(_scene.name);

        _model2.dispose();

        SceneManager.disposeScene(_scene2.name);
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
        _scene.addCamera(camera);
        _scene.setCurrCamera(camera.name);
        _scene.active();

        // 设置渲染前清屏颜色
        _scene.impl.clearColor = new BABYLON.Color4(71/255, 81/255, 100/255, 1);

        // 设置环境光 - 才能正确“看见”模型
        _scene.impl.ambientColor = BABYLON.Color3.White();

        // 设置主场景
        SceneManager.setMainScene(_scene);
    }
    function initScene2() {

        const _scene2Name: string = `${_aname}_2`;
        _scene2 = SceneManager.createScene(_scene2Name);
        if (!_scene2.impl.metadata) {
            _scene2.impl.metadata = {};
        }
        _scene2.impl.metadata.gltfAsLeftHandedSystem = true;
        (<any>window).scene2 = _scene2;
        
        const camera = new BABYLON.FreeCamera(`camera_${_aname}`, new BABYLON.Vector3(0, 6, 14), _scene2.impl);
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(_canvas, true);
        _scene2.addCamera(camera);
        _scene2.setCurrCamera(camera.name);
        _scene2.active();

        // 设置环境光 - 才能正确“看见”模型
        _scene2.impl.ambientColor = BABYLON.Color3.White();

        // SceneManager.setMainScene(_scene2);

        // 设置第二个场景的渲染 -
        getGlobal().setPermanent(() => {
            // 第二个场景的渲染叠加到第一个场景渲染结果上，则不能清屏
            _scene2.impl.autoClear = false;
            SceneManager.renderOtherScene(_scene2Name);
        });
    }
    function initDirectionalLight() {

    }
}