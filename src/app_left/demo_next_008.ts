import { ModelObj, SceneStruct } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 设置模型动画
 */
export namespace DemoActionNext008 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: 'PBR模型',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_008';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _model0: ModelObj;
    let _model00: ModelObj;
    let _model2: ModelObj;
    let _directLight: BABYLON.DirectionalLight;
    let _directLight_parent: BABYLON.TransformNode;
    // 阴影生成器
    let _shoadowGenerator: BABYLON.ShadowGenerator;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
        initDirectionalLight();
    
        // 往主场景添加模型
        _model = new ModelObj(`mod_poly_037`, _scene, {
            fileName: `mod_poly_037`,
            path: `mod_poly_037/`,
            particleAutoStart: true,
            // animDefault: true,
            insertedCall: () => {
                console.log(`模型 mod_poly_037 加载成功`);
                // 人物模型加载成功后指定 该人物模型需要产生阴影
                _model.rootImpl.getChildMeshes().forEach((m) => {
                    _shoadowGenerator.addShadowCaster(m);
                    m.receiveShadows = false;
                });
            }
        });
        _model.setPostion([0, 0, 0])
        
        // 往主场景添加模型
        _model0 = new ModelObj(`mod_poly_033`, _scene, {
            fileName: `mod_poly_033`,
            path: `mod_poly_033/`,
            particleAutoStart: true,
            // animDefault: true,
            insertedCall: () => {
                console.log(`模型 mod_poly_033 加载成功`);
                // 人物模型加载成功后指定 该人物模型需要产生阴影
                _model0.rootImpl.getChildMeshes().forEach((m) => {
                    _shoadowGenerator.addShadowCaster(m);
                    m.receiveShadows = false;
                });
            }
        });
        _model0.setPostion([5, 0, 0])
        
        // 往主场景添加模型
        _model00 = new ModelObj(`mod_poly_051`, _scene, {
            fileName: `mod_poly_051`,
            path: `mod_poly_051/`,
            particleAutoStart: true,
            // animDefault: true,
            insertedCall: () => {
                console.log(`模型 mod_poly_051 加载成功`);
                // 人物模型加载成功后指定 该人物模型需要产生阴影
                _model00.rootImpl.getChildMeshes().forEach((m) => {
                    _shoadowGenerator.addShadowCaster(m);
                    m.receiveShadows = false;
                });
            }
        });
        _model00.setPostion([-5, 0, 0])

        // 往主场景添加模型
        _model2 = new ModelObj(`sce_map01`, _scene, {
            fileName: `sce_map01`,
            path: `sce_map01/`,
            particleAutoStart: true,
            insertedCall: () => {
                console.log(`模型 sce_map01 加载成功`);
                // 地表模型加载成功后指定  指定地表模型需要接受阴影
                _model2.rootImpl.getChildMeshes().forEach((m) => {
                    m.receiveShadows = true;
                });
            }
        });

        _model2.setScale([5, 1, 1])
    
        // 创建阴影生成器 - 指定阴影图片大小影响阴影质量 - 指定要用来生成阴影的光
        _shoadowGenerator = new BABYLON.ShadowGenerator(1024, _directLight);
    };
    function uninitCall(){
        _model.dispose();
        _model0.dispose();
        _model00.dispose();
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
        
        const camera = new BABYLON.FreeCamera(`camera_${_aname}`, new BABYLON.Vector3(0, 6, 14), _scene.impl);
        camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        camera.setTarget(BABYLON.Vector3.Zero());
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
        _directLight_parent.rotation = new BABYLON.Vector3(60 / 180 * Math.PI, -100 / 180 * Math.PI, -200 / 180 * Math.PI);
        // 产生阴影 与 物体与光 相对位置相关
        _directLight_parent.position.x = 0;
        _directLight_parent.position.y = 5;
        _directLight_parent.position.z = 5;

        // 光漫反射颜色
        _directLight.diffuse = BABYLON.Color3.White();
        // 光高光颜色
        _directLight.specular = BABYLON.Color3.White();
        // 光照强度
        _directLight.intensity = 1;
    }
}