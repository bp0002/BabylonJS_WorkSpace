import { ModelObj, SceneStruct, SceneRenderFlags } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext002 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: '单场景多相机',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_002';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _model2: ModelObj;
    let _camera: BABYLON.FreeCamera;
    let _camera2: BABYLON.FreeCamera;
    // // 需要手动管理渲染的物体
    // let _cameraRenderMeshes: BABYLON.AbstractMesh[] = [];
    // let _camera2RenderMeshes: BABYLON.AbstractMesh[] = [];

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
                _model.rootImpl.getChildMeshes().forEach((m) => {
                    // _cameraRenderMeshes.push(m);
                    m.layerMask = 0x10000000;
                });
                console.log(`模型 model_treeman 加载成功`);
            }
        });
        
        // 往主场景添加模型
        _model2 = new ModelObj(`sce_map01`, _scene, {
            fileName: `sce_map01`,
            path: `sce_map01/`,
            particleAutoStart: true,
            insertedCall: () => {
                _model2.rootImpl.getChildMeshes().forEach((m) => {
                    // _camera2RenderMeshes.push(m);
                });
                console.log(`模型 sce_map01 加载成功`);
            }
        });

        
        // // 使用第一相机渲染前 - 主渲染调用前设置活动相机为第一相机,设置活动模型列表
        // SceneManager.registerBeforeRenderCall(() => {

        //     // 激活 第一 相机
        //     _scene.setCurrCamera(_camera.name);

        //     // 传递 渲染列表
        //     _scene.impl.getActiveMeshCandidates = () => {
        //         return {
        //             data: _cameraRenderMeshes,
        //             length: _cameraRenderMeshes.length
        //         };
        //     };
        //     _scene.impl.autoClear = true;
        // });

        // // 使用第二相机渲染前 - 主渲染调用后设置活动相机为第二相机,设置活动模型列表,并手动再次调用渲染
        // SceneManager.registerAfterRenderCall(() => {

        //     // 激活 第二 相机
        //     _scene.setCurrCamera(_camera2.name);

        //     // 传递 渲染列表
        //     _scene.impl.getActiveMeshCandidates = () => {
        //         return {
        //             data: _camera2RenderMeshes,
        //             length: _camera2RenderMeshes.length
        //         };
        //     };
        //     if (_scene.renderFlag !== SceneRenderFlags.pause) {
        //         _scene.impl.autoClear = false;
        //         _scene.render();
        //     }
        // });

        // _scene.changeCameraObserver = () => { };
    
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
        _camera = camera;
        
        const camera2 = new BABYLON.FreeCamera(`camera2_${_aname}`, new BABYLON.Vector3(0, 6, 14), _scene.impl);
        camera2.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        camera2.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(_canvas, true);
        _scene.addCamera(camera2);
        _camera2 = camera2;
        _camera2.layerMask = 0x10000000;

        // push 顺序决定渲染顺序, layerMask 决定渲染物体
        _scene.impl.activeCameras.push(_camera);
        _scene.impl.activeCameras.push(_camera2);
        
        // 设置环境光 - 才能正确“看见”模型
        _scene.impl.ambientColor = BABYLON.Color3.White();

        SceneManager.setMainScene(_scene);
    }
    function initDirectionalLight() {

    }
}