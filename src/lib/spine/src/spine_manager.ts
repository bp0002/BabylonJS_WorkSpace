import { SpineScene, SpineRenderOpt } from "./spine_scene";
import { SpineOption, SpineFiles, SpineModel } from "./spine_model";

export class SpineManager {
    public static sceneMap: Map<string, SpineScene> = new Map();
    public static mainScene: SpineScene;
    public static canvas: HTMLCanvasElement;
    public static gl: WebGLRenderingContext;
    public static spineImagesMap: Map<string, string[]> = new Map();
    /**
     * 初始化,设置默认渲染目标 - canvas
     * @param canvas 主canvas
     */
    public static init(canvas: HTMLCanvasElement) {
        SpineManager.canvas = canvas;
        SpineManager.gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    }
    /**
     * 添加spine的图片文件列表配置
     * @param spineName spine名称
     * @param images 图片列表,位于该spine文件夹下的相对路径
     */
    public static addSpineImageInfo(spineName: string, images: string[]) {
        SpineManager.spineImagesMap.set(spineName, images);
    }
    /**
     * 添加spine的图片文件列表配置
     * @param cfg [spine名称,[图片列表]]
     */
    public static addSpineImageInfos(cfg: [string, string[]][]) {
        cfg.forEach((info) => {
            SpineManager.spineImagesMap.set(info[0], info[1]);
        });
    }
    /**
     * 创建一个渲染场景
     * @param sceneName 指定场景名称
     * @param opt 如果不直接渲染到初始化时的canvas则需要指定该配置
     */
    public static createScene(sceneName: string, opt?: SpineRenderOpt) {
        let scene = SpineManager.sceneMap.get(sceneName);
        if (scene) {
            console.warn(`${sceneName} 场景已创建.`);
        } else {
            if (opt) {
                scene = new SpineScene(sceneName, opt);
            } else {
                scene = new SpineScene(sceneName, {
                    canvas: SpineManager.canvas,
                    gl: SpineManager.gl,
                    width: SpineManager.canvas.width,
                    height: SpineManager.canvas.height
                });
            }
            if (scene) {
                this.sceneMap.set(sceneName, scene);
            }
        }
        return scene;
    }
    /**
     * (切换)激活场景渲染
     * @param sceneName 指定场景名称
     */
    public static activeScene(sceneName: string) {
        const scene = SpineManager.sceneMap.get(sceneName);
        if (scene) {
            SpineManager.mainScene = scene;
        }

        return scene;
    }
    /**
     * 销毁场景
     * @param sceneName 指定场景名称
     */
    public static destroyScene(sceneName: string) {
        const scene = SpineManager.sceneMap.get(sceneName);

        if (scene === SpineManager.mainScene) {
            SpineManager.mainScene = undefined;
        }

        if (scene) {
            scene.destroy();
            SpineManager.sceneMap.delete(sceneName);
        }

        return scene;
    }
    /**
     * 暂停场景渲染(已指定的主场景)
     */
    public static pauseScene() {
        SpineManager.mainScene = undefined;
    }
    /**
     * 创建一个spine模型
     * @param sceneName 指定场景名称
     * @param spineName 模型名称 - 对应保存的文件夹，同时也是配置文件名称
     * @param opt spine配置
     * @param files spine文件列表
     */
    public static createSpine(sceneName: string, spineName: string, opt: SpineOption, files?: SpineFiles) {
        let model: SpineModel;
        const scene = SpineManager.sceneMap.get(sceneName);
        if (scene) {
            if (files) {
                model = new SpineModel(spineName, scene, opt, files);
            } else {
                let images: string[];
                images = SpineManager.spineImagesMap.get(spineName);

                if (!images) {
                    images = [`${spineName}.png`];
                }

                model = new SpineModel(spineName, scene, opt, {
                    json: `${spineName}.json`,
                    atlas: `${spineName}.atlas`,
                    images
                });
            }
            if (model) {
                scene.spineModels.push(model);
            }
        }

        return model;
    }
    /**
     * 主场景的渲染循环
     * @PS 外部设置调用时机
     */
    public static renderLoop = () => {
        if (SpineManager.mainScene) {
            SpineManager.mainScene.render();
        }
    }
}