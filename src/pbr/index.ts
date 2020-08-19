
import { Stats } from "../common/stats";
import { LoaderTool } from "../pi_babylon/scene_tool";
import { DemoActionHome } from "./home";
import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { getGlobal } from "../pi_sys/util/frame_mgr";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { DemoActionPBR00 } from "./pbr0";
import { DemoActionPBR01 } from "./pbr01";
import { DemoActionPBRMR00 } from "./pbr_metallic_roughness00";
import { DemoActionPBRSG00 } from "./pbr_specular_glossiness00";
import { DemoActionStandardFresnel } from "./standard_fresnel";
import { DemoActionPBR02 } from "./pbr02";

const initDemos = () => {
    const canvas = document.getElementsByTagName('canvas')[0];

    initScene(canvas);
    
    DemoActionList.Init(canvas, 200);

    DemoActionHome.init(canvas);

    DemoActionStandardFresnel.init();
    
    DemoActionPBRMR00.init();
    DemoActionPBRSG00.init();

    DemoActionPBR00.init();
    DemoActionPBR01.init();
    DemoActionPBR02.init();
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
    getGlobal().setPermanentBefore(SceneManager.renderLoop);

    BABYLON.PiEffectMaterial.AlwaysEnable = true;

    const stats = new Stats();
    getGlobal().setPermanent(() => { stats.update(); });
    document.body.appendChild(stats.dom);
}

export const init = () => {
    initDemos();
}