import { SceneInstance, SceneInstance3D } from "./scene_instance";
import { RenderFlags } from "./scene_base";

/**
 * 项目层 封装 Engin 实例
 * * 控制 引擎实例是否 渲染
 * * 控制 多场景的 渲染顺序
 * // TODO
 * * 控制 多场景的 渲染前处理
 *      * 是否清屏
 *      * 清屏参数
 */
export class EngineInstance {
    /**
     * Engine 实例
     */
    public readonly engine: BABYLON.Engine;
    /**
     * 名称
     */
    public readonly name: string;
    /**
     * 多场景实例 堆
     */
    public readonly sceneMap: Map<string, SceneInstance> = new Map();
    /**
     * 多场景的渲染顺序配置
     */
    public readonly renderSceneOrder: string[] = [];
    /**
     * Engine 实例渲染状态
     */
    private renderFlag: RenderFlags = RenderFlags.pause;
    constructor(ename: string, canvas: HTMLCanvasElement) {
        this.name   = ename;
        this.engine = new BABYLON.Engine(canvas);
        this.activeRenderLoop();
    }
    /**
     * 场景一般场景
     * @param sname 场景名称
     * @param opt 场景参数
     * * 不能导入模型
     * * 不能插入模型
     */
    public createScene(sname: string, opt?: BABYLON.SceneOptions) {
        let scene: SceneInstance = <SceneInstance>this.sceneMap.get(sname);

        if (!scene) {
            scene = new SceneInstance(sname, this.engine, opt);
            this.sceneMap.set(sname, scene);
        }

        return scene;
    }
    /**
     * 创建 3D 场景
     * @param sname 场景名称
     * @param opt 场景参数
     * * 正常的 3D 功能
     */
    public createScene3D(sname: string, opt?: BABYLON.SceneOptions) {
        let scene: SceneInstance3D = <SceneInstance3D>this.sceneMap.get(sname);

        if (!scene) {
            scene = new SceneInstance3D(sname, this.engine, opt);
            this.sceneMap.set(sname, scene);
        }

        return scene;
    }
    /**
     * 激活
     */
    public active() {
        this.renderFlag = RenderFlags.active;
    }
    /**
     * 暂停
     */
    public pause() {
        this.renderFlag = RenderFlags.pause;
    }
    /**
     * 启动引擎实例循环
     */
    private activeRenderLoop() {
        this.engine.runRenderLoop(this.renderLoop);
    }
    /**
     * 引擎内场景控制
     */
    private renderLoop = () => {
        if (this.renderFlag === RenderFlags.active) {
            if (this.renderSceneOrder.length > 0) {
                this.renderSceneOrder.forEach((sname) => {
                    const scene = this.sceneMap.get(sname);
                    scene && scene.scene.render();
                });
            } else {
                this.sceneMap.forEach((scene: SceneInstance) => {
                    scene.scene.render();
                });
            }
        }
    }
}