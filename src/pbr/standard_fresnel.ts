import { DemoActionList } from "../common/demo_action_list";
import { SceneStruct } from "../pi_babylon/scene_base";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { DataPanel } from "../common/data_panel";

export namespace DemoActionStandardFresnel {
    export function init() {

        DemoActionList.registDemoAction({
            aname: name,
            desc: '标准材质 Fresnel (菲涅尔)',
            initCall,
            uninitCall
        });
    }
    const name = 'DemoActionStandardFresnel';

    let _canvas: HTMLCanvasElement;
    let _scene: SceneStruct;
    let _camera: BABYLON.ArcRotateCamera;
    let _light: BABYLON.DirectionalLight;
    let _plane: BABYLON.Mesh;
    let _sphere: BABYLON.Mesh;
    let _box: BABYLON.Mesh;
    let _shadowGenerator: BABYLON.ShadowGenerator;
    let _material: BABYLON.StandardMaterial;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
        CreatePlane();
        CreateSphere();
        CreateBox();
        fresnel();

        DataPanel.init([
            ['specularColor ', 0.01, (v) => { _material.specularColor.copyFromFloats(v,v,v) }],
            ['emissiveColor ', 0.01, (v) => { _material.emissiveColor.copyFromFloats(v,v,v) }],

            ['reflectionFresnel.bias (x2)', 0.1, (v) => { _material.reflectionFresnelParameters.bias = v * 2 }],
            ['reflectionFresnel.power (x10)', 0.1, (v) => { _material.reflectionFresnelParameters.power = v * 10 }],
            ['reflectionFresnel.leftColor', 0.1, (v) => { _material.reflectionFresnelParameters.leftColor.copyFromFloats(v,v,v) }],
            ['reflectionFresnel.rightColor', 0.1, (v) => { _material.reflectionFresnelParameters.rightColor.copyFromFloats(v,v,v) }],

            ['emissiveFresnel.bias (x2)', 0.1, (v) => { _material.emissiveFresnelParameters.bias = v * 2 }],
            ['emissiveFresnel.power (x10)', 0.1, (v) => { _material.emissiveFresnelParameters.power = v * 10 }],
            ['emissiveFresnel.leftColor', 0.1, (v) => { _material.emissiveFresnelParameters.leftColor.copyFromFloats(v,v,v) }],
            ['emissiveFresnel.rightColor', 0.1, (v) => { _material.emissiveFresnelParameters.rightColor.copyFromFloats(v,v,v) }],

            ['specularPower (x40)', 0.01, (v) => { _material.specularPower = v * 40 }],
        ])
    }
    function uninitCall() {

        DataPanel.uninit();

        _box.dispose();
        _sphere.dispose();
        _plane.dispose();

        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {
        _scene = SceneManager.createScene('mainScene');

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
        const material = new BABYLON.StandardMaterial(name, _scene.impl);

        _sphere.material = material;
        _box.material = material;

        material.diffuseTexture = new BABYLON.Texture('app_scene/scene_res/res/images/Hd3bL4PPMEgg8d1VykdvgF.jpg', _scene.impl);

        material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        material.reflectionFresnelParameters.leftColor = BABYLON.Color3.White();
        material.reflectionFresnelParameters.rightColor = BABYLON.Color3.Black();
        material.reflectionFresnelParameters.bias = 0.1;

        material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        material.emissiveFresnelParameters.bias = 0.6;
        material.emissiveFresnelParameters.power = 4;
        material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
        material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

        // 会使阴影消失
        // material.opacityFresnelParameters = new BABYLON.FresnelParameters();
        // material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        // material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        material.specularColor = BABYLON.Color3.Black();
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.specularPower = 16;

        // material.backFaceCulling = false;
        // material.alpha = 0.6;

        _material = material;
    }
}