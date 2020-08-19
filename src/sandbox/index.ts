import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { getGlobal } from "../pi_sys/util/frame_mgr";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { Stats } from "../common/stats";
import { DemoAction00 } from "./demo00";
import { LoaderTool } from "../pi_babylon/scene_tool";
import { DemoActionHome } from "./home";

/**
 * Demo 入口
 * * 初始化 场景
 */

const initDemos = () => {
    const canvas = document.getElementsByTagName('canvas')[0];

    initScene(canvas);

    DemoActionList.Init(canvas);

    DemoActionHome.init(canvas);

    const func = DemoAction00.init();
    func(canvas);
 };

function initScene(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);

    // 场景资源目录
    // ResPath = 'app_scene/scene_res/res/';
    LoaderTool.getResPath = () => {
        return 'app_scene/scene_res/res/';
    }
    // 初始化
    SceneManager.init(canvas);

    // 场景的渲染调用时机
    getGlobal().setPermanentBefore(SceneManager.renderLoop);
    getGlobal().setInterval(1000 / 30);

    BABYLON.PiEffectMaterial.AlwaysEnable = true;

    const stats = new Stats();
    getGlobal().setPermanent(() => { stats.update(); });
    document.body.appendChild(stats.dom);
}

export const init = () => {
    initDemos();
}