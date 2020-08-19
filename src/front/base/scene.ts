// tslint:disable-next-line:no-reference
/**
 * scene
 */
import { BABYLONLoading } from './babylondownload';
import { SceneInstance3D } from './scene_struct';
import { SceneRenderFlags } from './base';
import { FactoryEngine } from './base_factory';

// tslint:disable-next-line:interface-name
interface ISceneManagerData {
    canvas: HTMLCanvasElement | undefined;
    /**
     * 当前活动场景
     */
    mainscene: SceneInstance3D | undefined;
    engine: BABYLON.Engine;
    sceneMap: Map<string, SceneInstance3D>;
}

// type HookCall = (f: (e: PointerEvent) => void) => void;

export const SceneManagerData: ISceneManagerData = <any>{
    canvas: undefined,
    mainscene: undefined,
    engine: undefined,
    sceneMap: new Map()
};

// tslint:disable-next-line:no-unnecessary-class
export class SceneManager {
    public static lastTime: number = 0;
    public static fpsStartTime: number = 0;
    public static curFPS: number = 30;
    public static timeByTimes: number = 0;
    public static limitFrame: boolean = true;
    // 帧数限制
    public static FPSLimit: number = 30;
    public static beforeRenderCallList: (() => void)[] = [];
    public static afterRenderCallList: (() => void)[] = [];
    /**
     * 初始化 渲染管理
     * @param cb 渲染创建后的回调
     */
    public static init(canvas: HTMLCanvasElement, cb?: Function) {

        // initExtends();

        SceneManagerData.canvas = canvas;

        SceneManagerData.engine = FactoryEngine(SceneManagerData.canvas);
        SceneManagerData.engine.loadingScreen = new BABYLONLoading();

        cb && cb();
    }

    /**
     * 返回游戏的刷新率
     */
    public static getFPS() {
        return SceneManager.curFPS;
    }

    public static getFlushTerm() {
        const curTime = Date.now();
        //  限制帧数
        if (curTime - SceneManager.lastTime < 1000 / SceneManager.FPSLimit && SceneManager.limitFrame) {
            return true;
        }
        SceneManager.timeByTimes++;
        // 控制显示的帧数
        SceneManager.fpsStartTime = SceneManager.fpsStartTime || curTime;
        SceneManager.lastTime = curTime;
        if (curTime - SceneManager.fpsStartTime >= 1000) {
            SceneManager.curFPS = SceneManager.timeByTimes;
            SceneManager.timeByTimes = 0;
            SceneManager.fpsStartTime = curTime;
        }

        return false;
    }

    /**
     * 主场景渲染循环
     * @项目逻辑不可控制
     * @状态为暂停时不渲染
     */
    public static renderLoop = () => {
        let scene: SceneInstance3D | undefined;
        scene = SceneManagerData.mainscene;

        SceneManager.beforeRenderCallList.forEach((f) => f());

        if (scene && scene.renderFlag === SceneRenderFlags.pause) {
            // 
        } else {
            if (scene) {

                scene.render();

            } else {
                SceneManagerData.engine && SceneManagerData.engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true, true);
            }
        }

        SceneManager.afterRenderCallList.forEach((f) => f());
    }

    /**
     * 创建场景后清理 babylon底层为场景绑定的事件监听
     * @param scene 目标场景
     */
    public static formatScenePointerEvent(scene: SceneInstance3D) {
        if (SceneManagerData.canvas) {
            SceneManagerData.canvas.removeEventListener('pointerdown',  (<any>scene.impl)._inputManager._onPointerDown);
            SceneManagerData.canvas.removeEventListener('pointermove',  (<any>scene.impl)._inputManager._onPointerMove);
            SceneManagerData.canvas.removeEventListener('pointerup',    (<any>scene.impl)._inputManager._onPointerUp);
        }
    }

    /**
     * 渲染主场景以外的场景
     * @状态为暂停时不渲染
     * @项目逻辑控制何时渲染
     * @param sceneName 场景名称
     */
    public static renderOtherScene(sceneName: string) {
        if (!SceneManagerData.mainscene || sceneName !== SceneManagerData.mainscene.name) {
            const scene = SceneManagerData.sceneMap.get(sceneName);

            if (scene) {
                scene.render();
            }
        }
    }

    /**
     * 创建 一个 场景数据， 并记录在管理器中
     * @param sceneName 场景名称
     */
    public static createScene(sceneName: string) {
        let sceneStruct: SceneInstance3D;
        const temp = SceneManagerData.sceneMap.get(sceneName);
        if (temp) {
            sceneStruct = temp;
        } else {
            sceneStruct = new SceneInstance3D(sceneName, SceneManagerData.engine);
            sceneStruct.impl && (sceneStruct.impl.useConstantAnimationDeltaTime = false);

            BABYLON.Scene.MinDeltaTime = 50;
            BABYLON.Scene.MaxDeltaTime = 200;

            SceneManager.recordScene(sceneStruct);
        }

        return sceneStruct;
    }

    /**
     * 设置主场景
     * @param scene 目标场景
     * @param sceneName 目标场景名称，如果指定则忽略第一个参数
     */
    public static setMainScene(scene: SceneInstance3D | undefined, sceneName?: string) {
        if (sceneName) {
            scene = SceneManagerData.sceneMap.get(sceneName);
            SceneManagerData.mainscene = scene;
        } else {
            SceneManagerData.mainscene = scene;
        }
    }

    /**
     * 记录刚创建的目标场景
     * @param sceneStruct 目标场景
     */
    public static recordScene(sceneStruct: SceneInstance3D) {
        if (!!sceneStruct.name) {
            SceneManagerData.sceneMap.set(sceneStruct.name, sceneStruct);
        } else {
            // BabylonLogTool.warn(`SceneStruct Name: ${sceneStruct.name} 无效！`);
        }
    }

    public static beforeSceneDestroy() {
        // BabylonLogTool.log('destory hook');
    }

    /**
     * 销毁指定名称的场景
     * @param sceneName 场景名称
     */
    public static disposeScene(sceneName: string) {
        const sceneStruct = SceneManagerData.sceneMap.get(sceneName);
        if (sceneStruct) {
            if (sceneStruct === SceneManagerData.mainscene) {
                SceneManagerData.mainscene = undefined;
            }

            sceneStruct.dispose();
        }
        SceneManagerData.sceneMap.delete(sceneName);
    }

    public static createFBO(gl: WebGLRenderingContext) {
        const fbo = gl.createFramebuffer();
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return fbo;
    }

    public static registerBeforeRenderCall(f: () => void) {
        if (this.beforeRenderCallList.indexOf(f) < 0) {
            this.beforeRenderCallList.push(f);
        }
    }
    public static unregisterBeforeRenderCall(f: () => void) {
        const index = this.beforeRenderCallList.indexOf(f);
        if (index >= 0) {
            this.beforeRenderCallList.splice(index, 1);
        }
    }
    public static registerAfterRenderCall(f: () => void) {
        if (this.afterRenderCallList.indexOf(f) < 0) {
            this.afterRenderCallList.push(f);
        }
    }
    public static unregisterAfterRenderCall(f: () => void) {
        const index = this.afterRenderCallList.indexOf(f);
        if (index >= 0) {
            this.afterRenderCallList.splice(index, 1);
        }
    }
}