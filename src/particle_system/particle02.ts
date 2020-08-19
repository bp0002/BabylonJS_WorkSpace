import { DemoActionList } from '../common/demo_action_list';

export namespace DemoActionParticle02 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: desc,
            initCall: initCall,
            uninitCall: uninitCall
        })
    }

    const name = 'Particle02';
    const desc = 'SolidParticle';

    // let _canvas: HTMLCanvasElement;
    // let _scene: SceneStruct;
    // let _camera: BABYLON.ArcRotateCamera;
    // let sps: BABYLON.SolidParticleSystem;
    // let _model: ModelObj;
    // let _mesh: BABYLON.Mesh;
    // let _light: BABYLON.PointLight;

    const _particleNumber = 2000;
    const half = (_particleNumber * 0.5)|0;

    function initCall(canvas: HTMLCanvasElement) {
        // _canvas = canvas;
        // initScene();

        // // TODO

        // _model = _scene.insertMesh('model', {
        //     fileName: 'mod_poly_006',
        //     path: 'mod_poly_006/',
        //     insertedCall: () => {
        //         _mesh = <BABYLON.Mesh>_model.rootImpl.getChildMeshes()[0];
        //         setTimeout(() => {
        //             initSolidParticle();
        //         }, 2000);
        //     }
        // });
    }

    function uninitCall() {

        // // TODO
        // sps.dispose();
        // _mesh = undefined;
        // _model.dispose();
        // _scene.dispose();

        // SceneManager.disposeScene(_scene.name);
    }
    function initScene() {
        // _scene = SceneManager.createScene('mainScene');
        // // 导入模型必须的设置 - 设置场景为左手坐标系
        // if (!_scene.impl.metadata) {
        //     _scene.impl.metadata = {};
        // }
        // _scene.impl.metadata.gltfAsLeftHandedSystem = true;

        // // TODO
        // _camera = new BABYLON.ArcRotateCamera('camera', 0.1, 0.3, 8, BABYLON.Vector3.Zero(), _scene.impl);
        // _camera.attachControl(_canvas, true);
        // _scene.addCamera(_camera);
        // _scene.setCurrCamera(_camera.name);
        // _scene.active();

        // _light = new BABYLON.PointLight("pl", _camera.position, _scene.impl);
        // _light.intensity = 1.0;

        // (<any>window).scene = _scene;
        // // 设置场景管理器主场景
        // SceneManager.setMainScene(_scene);
    }

    function initSolidParticle() {
        // sps = new BABYLON.SolidParticleSystem(name, _scene.impl);
        // sps.addShape(_mesh, _particleNumber);
        // sps.buildMesh();

        // sps.updateParticle = initParticle;
        // sps.setParticles();

        // sps.updateParticle = updateParticle;
        // sps.computeParticleColor = false;

        // (<any>window).sps = sps;
    }

    function initParticle(particle: BABYLON.SolidParticle) {
        var areaSize = 30.0;
        var particleSize = 1.0;

        particle.position.x = areaSize * (Math.random() - 0.5);
        particle.position.y = areaSize * (Math.random() - 0.5);
        particle.position.z = areaSize * (Math.random() - 0.5);

        // particle.rotation.x = 6.28 * Math.random();
        // particle.rotation.y = 6.28 * Math.random();
        // particle.rotation.z = 6.28 * Math.random();
        particle.scale.z = -1;

        // particle.scaling.scaleInPlace(particleSize);

        return particle;
    }

    function updateParticle(particle: BABYLON.SolidParticle) {
        // // satellites
        // if (particle.idx >= half) {
        //     particle.rotation.y += 0.015;
        //     particle.rotation.z -= 0.06;
        // }
        // // boxes
        // else {
        //     particle.rotation.y += 0.02;
        //     particle.rotation.x += 0.01;
        // }

        return particle;
    };
}