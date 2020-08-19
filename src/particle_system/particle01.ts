import { DemoActionList } from '../common/demo_action_list';

export namespace DemoActionParticle01 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: desc,
            initCall: initCall,
            uninitCall: uninitCall
        });
    }

    const name = 'Particle01';
    const desc = '球形发射器 - 简单';

    // let _canvas: HTMLCanvasElement;
    // let _scene: SceneStruct;
    // let _camera: BABYLON.ArcRotateCamera;
    // let _particle: BABYLON.ParticleSystem;

    function initCall(canvas: HTMLCanvasElement) {
        // _canvas = canvas;

        // initScene();

        // // TODO
        // _particle = new BABYLON.ParticleSystem(name, 2000, _scene.impl);
        // _particle.emitRate = 10;
        // _particle.updateSpeed = 0.01;
        // _particle.emitter = BABYLON.Vector3.Zero();
        
        // _particle.particleTexture = new BABYLON.Texture('app_scene/scene_res/res/images/ray.png', _scene.impl);
        // _particle.particleTexture.hasAlpha = true;
        // _particle.minSize = 0.1;
        // _particle.maxSize = 0.1;

        // _particle.isLoop = true;

        // _particle.start();
    }

    function uninitCall() {

        // TODO
        // _particle.stop();
        // _particle.dispose();

        // SceneManager.disposeScene(_scene.name);
    }

    function initScene() {
        // _scene = SceneManager.createScene('mainScene');
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

        // (<any>window).scene = _scene;
        // // 设置场景管理器主场景
        // SceneManager.setMainScene(_scene);
    }
}