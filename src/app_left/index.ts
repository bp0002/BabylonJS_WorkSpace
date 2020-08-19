import { DemoActionList } from "../common/demo_action_list";
import { ResPath } from "../pi_babylon/scene_base";
import { SceneManager } from "../pi_babylon/scene";
import { getGlobal } from "../pi_sys/util/frame_mgr";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { DemoAction01 } from "./demo01";
import { DemoAction02 } from "./demo02";
import { DemoAction03 } from "./demo03";
import { DemoAction04 } from "./demo04";
import { DemoAction05 } from "./demo05";
import { DemoAction06 } from "./demo06";
import { DemoAction07 } from "./demo07";
import { DemoAction08 } from "./demo08";
import { DemoAction09 } from "./demo09";
import { DemoAction10 } from "./demo10";
import { DemoAction11 } from "./demo11";
import { DemoActionNext001 } from "./demo_next_001";
import { DemoActionNext002 } from "./demo_next_002";
import { DemoActionNext003 } from "./demo_next_003";
import { DemoActionNext004 } from "./demo_next_004";
import { DemoActionNext005 } from "./demo_next_005";
import { DemoActionNext006 } from "./demo_next_006";
import { DemoActionNext007 } from "./demo_next_007";
import { DemoActionNext008 } from "./demo_next_008";
import { DemoActionNext009 } from "./demo_next_009";
import { DemoActionNext010 } from "./demo_next_010";
import { Stats } from "../common/stats";
import { DemoActionNext011 } from "./demo_next_011";
import { DemoAction00 } from "./demo00";
import { LoaderTool } from "../pi_babylon/scene_tool";
import { DemoActionHome } from "./home";
import { DemoActionNext012 } from "./demo_next_012";
import { DemoAction12 } from "./demo12";
import { DemoActionNext013 } from "./demo_next_013";
import { DemoActionNext014 } from "./demo_next_014";

/**
 * Demo 入口
 * * 初始化 场景
 */

const initDemos = () => {
    const canvas = document.getElementsByTagName('canvas')[0];

    initScene(canvas);
    
    DemoActionList.Init(canvas);

    DemoActionHome.init(canvas);

    DemoAction00.init();
    DemoAction01.init();
    DemoAction02.init();
    DemoAction03.init();
    DemoAction04.init();
    DemoAction05.init();
    DemoAction06.init();
    DemoAction07.init();
    DemoAction08.init();
    DemoAction09.init();
    DemoAction10.init();
    DemoAction11.init();
    DemoAction12.init();

    DemoActionNext001.init();
    DemoActionNext002.init();
    DemoActionNext003.init();
    DemoActionNext004.init();
    DemoActionNext005.init();
    DemoActionNext006.init();
    DemoActionNext007.init();
    DemoActionNext008.init();
    DemoActionNext009.init();
    DemoActionNext010.init();
    DemoActionNext011.init();
    DemoActionNext012.init();
    DemoActionNext013.init();
    DemoActionNext014.init();
    // DemoActionMajiang1000.init();
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
    getGlobal().setInterval(1000/30)

    BABYLON.PiEffectMaterial.AlwaysEnable = true;
        
    const stats = new Stats();
    getGlobal().setPermanent(() => { stats.update(); });
    document.body.appendChild(stats.dom);
}

export const init = () => {
    initDemos();
}