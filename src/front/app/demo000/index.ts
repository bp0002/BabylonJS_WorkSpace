import { SceneManager } from "../../base/scene";
import { SceneInstance3D } from "../../base/scene_struct";
import { InsertModelObj } from "../../base/model_obj";

/**
 * 功能模块
 * * 主功能，babylon 3D demo
 */
export class Index {
    public static canvas: HTMLCanvasElement;
    public static scene: SceneInstance3D;
    /**
     * 初始化时，创建一个简单的完整的场景展示
     * * 相机
     * * 灯光
     * * 球体
     * * 平面
     * @param canvas 目标 canvas
     */
    public static init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        SceneManager.init(canvas);
        const func = () => {
            SceneManager.renderLoop();
            requestAnimationFrame(func);
        }
        requestAnimationFrame(func);
        // 创建场景
        this.scene  = SceneManager.createScene('test');

        const camera = new BABYLON.ArcRotateCamera('camera1', 1, 1, 10, BABYLON.Vector3.Zero(), this.scene.impl);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        // 添加相机
        this.scene.addCamera(camera);
        // 设置活动相机
        this.scene.setCurrCamera(camera.name);
        // 可以激活场景
        this.scene.active();

        SceneManager.setMainScene(this.scene);

        // 添加灯光
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene.impl);
        // this.scene.addLight('light1', light);

        // // 添加球体
        // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene.scene);
        // sphere.position.y = 1;

        // // 添加平面
        // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene.scene);
        // ground.position.y = 0.1;

        // var sceneIn = new BABYLON.SceneInstrumentation(this.scene.scene);

        const model = this.scene.insertMesh('buster_drone', {
            rayID: 1,
            modelName: undefined,
            path: '../../resource/model/buster_drone/',
            /**
             * 要加载的模型的资源文件名称
             * * 资源文件名称
             */
            fileName: 'scene',
            /**
             * 加载成功的回调
             */
            insertedCall: (model: InsertModelObj) => {
                console.warn(`Insert Scuccess.`);
                // this.scene.activeCamera = camera;
                let span = document.createElement('a');
                document.body.appendChild(span);
                span.innerText = `GLTF Model From: LaVADraGoN's <Buster Drone>` ;
                span.style.cssText = 'position:absolute;height:24px;color:red;z-index:10000000;';
                span.href = 'https://sketchfab.com/3d-models/buster-drone-294e79652f494130ad2ab00a13fdbafd';
            }
        });

        model.setPostion([0, 0.0, 0.0]);
        model.setScale([0.01, 0.01, 0.01]);
        model.setAnim({ animName: 'CINEMA_4D_Basis', isLoop: true });
    }
    public static createEngine(canvas: HTMLCanvasElement) {
        return new BABYLON.Engine(canvas, true);
    }
}