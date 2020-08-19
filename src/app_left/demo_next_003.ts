import { ModelObj, SceneStruct, SceneRenderFlags } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext003 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: '环境光控制',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_003';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _model2: ModelObj;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
    
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
        _model2 = new ModelObj(`sce_map01`, _scene, {
            fileName: `sce_map01`,
            path: `sce_map01/`,
            particleAutoStart: true,
            insertedCall: () => {
                console.log(`模型 sce_map01 加载成功`);
            }
        });
        
        // 每帧渲染前变化环境光
        SceneManager.registerBeforeRenderCall(() => {
            _scene.impl.ambientColor.copyFromFloats(Math.sin(Date.now() % 2000 / 2000 * Math.PI) * 0.5 + 0.5, 0, 0);
        });
    
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
        
        const camera = new BABYLON.FreeCamera(`camera_${_aname}`, new BABYLON.Vector3(0, 6, 14), _scene.impl);
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        camera.setTarget(BABYLON.Vector3.Zero());
        _scene.addCamera(camera);
        _scene.setCurrCamera(camera.name);
        _scene.active();
        
        // 设置环境光 - 才能正确“看见”模型
        _scene.impl.ambientColor = BABYLON.Color3.White();

        SceneManager.setMainScene(_scene);
    }
    function initDirectionalLight() {

    }
}