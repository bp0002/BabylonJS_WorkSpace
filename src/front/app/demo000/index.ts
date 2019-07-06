import { EngineInstance } from "../../base/engine_instance";
import { SceneInstance3D, SceneInstance } from "../../base/scene_instance";
import { AppendModelObj, InsertModelObj } from "../../base/model_instance";

/**
 * 功能模块
 * * 主功能，babylon 3D demo
 */
export class Index {
    public static canvas: HTMLCanvasElement;
    public static engine: EngineInstance;
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
        this.engine = new EngineInstance('00', canvas);
        this.engine.active();

        // 创建场景
        this.scene  = this.engine.createScene3D('test');

        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        // 添加相机
        this.scene.addCamera(camera);
        // 设置活动相机
        this.scene.activeCamera = camera;
        // 可以激活场景
        this.scene.active();

        // 添加灯光
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene.scene);
        this.scene.addLight('light1', light);

        // 添加球体
        const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene.scene);
        sphere.position.y = 1;

        // 添加平面
        const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene.scene);
        ground.position.y = 0.1;

        // var sceneIn = new BABYLON.SceneInstrumentation(this.scene.scene);

        const model = this.scene.insertMesh('bee', {
            rayID: 1,
            modelName: null,
            path: '../../resource/model/Bee/',
            /**
             * 要加载的模型的资源文件名称
             * * 资源文件名称
             */
            fileName: 'Bee.babylon',
            /**
             * 加载成功的回调
             */
            insertedCall: (model: InsertModelObj) => {
                console.warn(`Insert Scuccess.`);
                this.scene.activeCamera = camera;
            }
        });

        model.setPostion([0, 0.1, 0.1]);
    }
    public static createEngine(canvas: HTMLCanvasElement) {
        return new BABYLON.Engine(canvas, true);
    }
}