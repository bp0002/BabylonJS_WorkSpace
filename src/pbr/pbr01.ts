import { DemoActionList } from "../common/demo_action_list";
import { SceneStruct } from "../pi_babylon/scene_base";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { NumberInput } from "./number_input";
import { DataPanel } from "../common/data_panel";

export namespace DemoActionPBR01 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: 'PBR 应用 HDR (测试时移动端没有效果)',
            fontSize: '12px',
            initCall,
            uninitCall
        });
    }

    const name = 'DemoActionPBR01'

    let _canvas: HTMLCanvasElement;
    let _scene: SceneStruct;
    let _camera: BABYLON.ArcRotateCamera;
    let _light: BABYLON.DirectionalLight;
    let _plane: BABYLON.Mesh;
    let _sphere: BABYLON.Mesh;
    let _box: BABYLON.Mesh;
    let _shadowGenerator: BABYLON.ShadowGenerator;
    let _material: BABYLON.PBRMaterial;
    let _hdrTexture: BABYLON.HDRCubeTexture;

    function initCall(canvas: HTMLCanvasElement) {

        _canvas = canvas;

        initScene();
        hdrTexture();
        CreatePlane();
        CreateSphere();
        CreateBox();
        fresnel();

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
        _material = new BABYLON.PBRMaterial(name, _scene.impl);

        _sphere.material = _material;
        _box.material = _material;

        _material.albedoTexture = new BABYLON.Texture('app_scene/scene_res/res/images/Hd3bL4PPMEgg8d1VykdvgF.jpg', _scene.impl);

        _material.reflectionTexture = _hdrTexture;

        // 未明确指定 会使用底层默认的一个,且会跨场景叠加效果
        _material.environmentBRDFTexture = null;

        // 金属度
        _material.metallic = 0.5;
        // 粗糙度
        _material.roughness = 0.5;

        _plane.material = _material;

        (<any>window).material = _material;
    }
    function hdrTexture() {
        _hdrTexture = new BABYLON.HDRCubeTexture('app_scene/scene_res/res/hdrs/room.hdr', _scene.impl, 512);
    }
}