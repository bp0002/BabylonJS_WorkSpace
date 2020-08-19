import { DemoActionList } from "../common/demo_action_list";
import { SceneStruct, ModelObj } from "../pi_babylon/scene_base";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { NumberInput } from "./number_input";
import { DataPanel } from "../common/data_panel";

export namespace DemoActionPBR02 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: 'PBR 导入',
            fontSize: '12px',
            initCall,
            uninitCall
        });
    }

    const name = 'DemoActionPBR02'

    let _canvas: HTMLCanvasElement;
    let _scene: SceneStruct;
    let _camera: BABYLON.ArcRotateCamera;
    let _light: BABYLON.DirectionalLight;
    let _material: BABYLON.PBRMaterial;
    let _model: ModelObj;

    function initCall(canvas: HTMLCanvasElement) {

        _canvas = canvas;

        initScene();

        _model = _scene.insertMesh(name, {
            fileName: 'dice',
            path: 'dice/',
            insertedCall: () => {
                const mesh = _model.rootImpl.getChildMeshes()[0];
                _material = <any>mesh.material;
                _material.environmentBRDFTexture = null;
            }
        })

        DataPanel.init([
            ['alpha - 重要', 0.5, (v) => { _material.alpha = v }],
            ['metallic', 0.5, (v) => { _material.metallic = v }],
            ['roughness', 0.5, (v) => { _material.roughness = v }],
            ['directIntensity', 0.5, (v) => { _material.directIntensity = v }],
            ['cameraExposure', 0.5, (v) => { _material.cameraExposure = v * 4 }],
            ['cameraContrast', 0.5, (v) => { _material.cameraContrast = v * 4 }]
        ]);
    }
    function uninitCall() {

        DataPanel.uninit();

        _model.dispose();

        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {
        _scene = SceneManager.createScene('mainScene');

        _scene.impl.imageProcessingConfiguration.exposure = 4;

        _camera = new BABYLON.ArcRotateCamera('camera', 0.1, 0.3, 8, BABYLON.Vector3.Zero(), _scene.impl);
        _camera.attachControl(_canvas, true);
        _scene.addCamera(_camera);
        _scene.setCurrCamera(_camera.name);
        _scene.active();

        _light = new BABYLON.DirectionalLight('light0', BABYLON.Vector3.Forward(), _scene.impl);
        _light.diffuse = new BABYLON.Color3(1, 1, 1);

        const lightNode = new BABYLON.TransformNode('LIGHT_NODE', _scene.impl);
        lightNode.position.y = 8,
        lightNode.position.x = 8;
        lightNode.position.z = 8;
        lightNode.rotation = new BABYLON.Vector3(2.0, 0, 0);

        _light.parent = lightNode;

        (<any>window).scene = _scene;
        // 设置场景管理器主场景
        SceneManager.setMainScene(_scene);
    }
}