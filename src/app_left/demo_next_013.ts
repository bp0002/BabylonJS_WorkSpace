import { ModelObj, SceneStruct, SceneRenderFlags } from "../pi_babylon/scene_base";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { BABYLON } from "../pi_babylon/render3d/babylon";

/**
 * 轮廓描边
 * * 以膨胀模型方式渲染
 * * 不能正确处理半透明渲染模型
 * * 模型多个面共用点法线需要对齐
 */
export namespace DemoActionNext013 {

    export function init() {
        DemoActionList.registDemoAction({
            aname: _aname,
            desc: '轮廓描边(模型渲染方式,不能正确处理半透明渲染模型)',
            btnHeight: '60px',
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const _aname: string = 'demo_Next_013';

    let _scene: SceneStruct;
    let _canvas: HTMLCanvasElement;
    let _model: ModelObj;
    let _sphere: BABYLON.Mesh;
    let _cube: BABYLON.Mesh;
    let _cube2: BABYLON.Mesh;
    let _material: BABYLON.StandardMaterial;
    let _directLight: BABYLON.DirectionalLight;
    let _directLight_parent: BABYLON.TransformNode;

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();
        initDirectionalLight();

        // 创建材质
        _material = new BABYLON.StandardMaterial('mat', _scene.impl);
        _material.ambientColor = BABYLON.Color3.White();
        _material.diffuseTexture = new BABYLON.Texture('app_scene/scene_res/res/images/Hd3bL4PPMEgg8d1VykdvgF.jpg', _scene.impl);
        _material.opacityTexture = new BABYLON.Texture('app_scene/scene_res/res/images/ray.png', _scene.impl);

        // 往主场景添加模型
        _model = new ModelObj(`mod_poly_037`, _scene, {
            fileName: `mod_poly_037`,
            path: `mod_poly_037/`,
            particleAutoStart: true,
            animDefault: true,
            insertedCall: () => {
                console.log(`模型 mod_poly_037 加载成功`);
                _model.meshMap.forEach((mesh) => {
                    mesh.outlineColor = BABYLON.Color3.Black();
                    mesh.renderOutline = true;
                });
            }
        });
        _model.setPostion([0, 0, 0]);

        // 往主场景添加模型
        _sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { }, _scene.impl);
        _sphere.material = _material;
        _sphere.position.x = 1;
        _sphere.outlineColor = BABYLON.Color3.Black();
        _sphere.renderOutline = true;
        _sphere.outlineWidth = 0.2;
        _sphere.renderOverlay = true;

        // 往主场景添加模型
        _cube = BABYLON.MeshBuilder.CreateBox('box', { }, _scene.impl);
        _cube.material = _material;
        _cube.position.x = -1;
        _cube.outlineColor = BABYLON.Color3.Black();
        _cube.renderOutline = true;
        _cube.outlineWidth = 0.2;

        _cube.getVertexBuffer(BABYLON.VertexBuffer.NormalKind)._buffer._updatable = true;

        _cube.updateVerticesData(BABYLON.VertexBuffer.NormalKind, [
            0.577350269189, -0.577350269189, 0.577350269189,
            -0.577350269189, -0.577350269189, 0.577350269189,
            -0.577350269189, 0.577350269189, 0.577350269189,
            0.577350269189, 0.577350269189, 0.577350269189,
            0.577350269189, 0.577350269189, -0.577350269189,

            -0.577350269189, 0.577350269189, -0.577350269189,
            -0.577350269189, -0.577350269189, -0.577350269189,
            0.577350269189, -0.577350269189, -0.577350269189,
            0.577350269189, 0.577350269189, -0.577350269189,
            0.577350269189, -0.577350269189, -0.577350269189
            ,
            0.577350269189, -0.577350269189, 0.577350269189,
            0.577350269189, 0.577350269189, 0.577350269189,
            -0.577350269189, 0.577350269189, 0.577350269189,
            -0.577350269189, -0.577350269189, 0.577350269189,
            -0.577350269189, -0.577350269189, -0.577350269189
            ,
            -0.577350269189, 0.577350269189, -0.577350269189,
            -0.577350269189, 0.577350269189, 0.577350269189,
            -0.577350269189, 0.577350269189, -0.577350269189,
            0.577350269189, 0.577350269189, -0.577350269189,
            0.577350269189, 0.577350269189, 0.577350269189
            ,
            0.577350269189, -0.577350269189, 0.577350269189,
            0.577350269189, -0.577350269189, -0.577350269189,
            -0.577350269189, -0.577350269189, -0.577350269189,
            -0.577350269189, -0.577350269189, 0.577350269189
        ]);
        // 往主场景添加模型
        _cube2 = BABYLON.MeshBuilder.CreateBox('box', { }, _scene.impl);
        _cube2.material = _material;
        _cube2.position.y = -1;
        _cube2.outlineColor = BABYLON.Color3.Black();
        _cube2.renderOutline = true;
        _cube2.outlineWidth = 0.2;

        (<any>window).cube = _cube;
    }
    function uninitCall() {
        _model.dispose();
        _sphere.dispose();
        _cube.dispose();
        _cube2.dispose();

        SceneManager.disposeScene(_scene.name);
    }
    function initScene() {

        _scene = SceneManager.createScene(_aname);
        if (!_scene.impl.metadata) {
            _scene.impl.metadata = {};
        }
        _scene.impl.metadata.gltfAsLeftHandedSystem = true;
        (<any>window).scene = _scene;

        const camera = new BABYLON.ArcRotateCamera(`camera_${_aname}`, 0.5, 0.2, 10, BABYLON.Vector3.Zero(), _scene.impl);
        // camera.mode = BABYLON.FreeCamera.PERSPECTIVE_CAMERA;
        // camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(_canvas, true);
        _scene.addCamera(camera);
        _scene.setCurrCamera(camera.name);
        _scene.active();

        // 设置环境光
        _scene.impl.ambientColor = BABYLON.Color3.White();

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