
import { Stats } from "../common/stats";
import { DemoActionHome } from "./home";
import { DemoActionList } from "../common/demo_action_list";
import { DemoActionParticle01 } from "./particle01";
import { DemoActionParticleDisplay } from "./particle_display";
import { DemoActionParticle02 } from "./particle02";
import { LoaderTool } from "../front/base/scene_tool";
import { SceneManager } from "../front/base/scene";
import { FrameMgr } from "../common/frame_mgr";

const initDemos = () => {
    const canvas = document.getElementsByTagName('canvas')[0];

    initScene(canvas);

    DemoActionList.Init(canvas, 200);

    DemoActionHome.init(canvas);

    DemoActionParticleDisplay.init();
    DemoActionParticle01.init();
    DemoActionParticle02.init();
}

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
    FrameMgr.setPermanent(SceneManager.renderLoop);

    // BABYLON.PiEffectMaterial.AlwaysEnable = true;

    const stats = new Stats();
    FrameMgr.setPermanent(() => { stats.update(); });
    document.body.appendChild(stats.dom);
}

export const init = () => {
    initDemos();
}