import { DemoActionList } from "../common/demo_action_list";
import { SceneStruct } from "../pi_babylon/scene_base";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { NumberInput } from "./number_input";
import { DataPanel } from "../common/data_panel";

export namespace DemoActionPBRSG00 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: '镜面光泽度材质',
            fontSize: '16px',
            initCall,
            uninitCall
        });
    }
    const name = 'DemoActionPBRSG00'

    let _canvas: HTMLCanvasElement;
    let _scene: SceneStruct;
    let _camera: BABYLON.ArcRotateCamera;
    let _light: BABYLON.DirectionalLight;
    let _plane: BABYLON.Mesh;
    let _sphere: BABYLON.Mesh;
    let _box: BABYLON.Mesh;
    let _shadowGenerator: BABYLON.ShadowGenerator;
    let _material: BABYLON.PBRSpecularGlossinessMaterial;

    function initCall(canvas: HTMLCanvasElement) {

        _canvas = canvas;

        initScene();
        CreatePlane();
        CreateSphere();
        CreateBox();
        fresnel();
        
        DataPanel.init([
            ['SpecularColor', 0.0, (v) => { _material.specularColor.r = _material.specularColor.r = _material.specularColor.g = v }],
            ['SpecularColor.R', 0.0, (v) => { _material.specularColor.r = v }],
            ['SpecularColor.G', 0.0, (v) => { _material.specularColor.g = v }],
            ['SpecularColor.B', 0.0, (v) => { _material.specularColor.b = v }],
            ['Glossiness', 0.0, (v) => { _material.glossiness = v }],
        ]);
    }
    function uninitCall() {

        DataPanel.uninit();

        _shadowGenerator.dispose();

        _box.dispose();
        _sphere.dispose();
        _plane.dispose();

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
        _light.diffuse = new BABYLON.Color3(247/255, 194/255, 66/255);

        _shadowGenerator = new BABYLON.ShadowGenerator(2048, _light);

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
    function CreatePlane() {
        _plane = BABYLON.MeshBuilder.CreatePlane('plane', { size: 20 }, _scene.impl);
        _plane.rotation = new BABYLON.Vector3(1.57, 0, 0);

        _plane.receiveShadows = true;
    }
    function CreateSphere() {
        _sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { arc: 0 });
        _sphere.position.y = 2;
        // _sphere.position.x = -2;
        _sphere.scaling = new BABYLON.Vector3(2, 2, 2);
        _shadowGenerator.addShadowCaster(_sphere);
    }
    function CreateBox() {
        _box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 });
        _box.position.y = 2;
        _box.position.x = 2;
        _shadowGenerator.addShadowCaster(_box);
    }
    function fresnel() {
        _material = new BABYLON.PBRSpecularGlossinessMaterial(name, _scene.impl);

        _sphere.material = _material;
        _box.material = _material;

        _material.diffuseTexture = new BABYLON.Texture('app_scene/scene_res/res/images/Hd3bL4PPMEgg8d1VykdvgF.jpg', _scene.impl);

        // 金属度
        _material.specularColor = BABYLON.Color3.Black();
        // 粗糙度
        _material.glossiness = 0.0;

        (<any>window).material = _material;
    }
}