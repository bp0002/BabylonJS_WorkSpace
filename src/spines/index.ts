
import { Stats } from "../common/stats";
import { DemoActionHome } from "../common/home";
import { DemoActionList } from "../common/demo_action_list";
import { DemoActionSpine01 } from "./spine01";
import { SpineModel } from "../lib/spine/src/spine_model";
import { SpineManager } from "../lib/spine/src/spine_manager";
import { FrameMgr } from "../common/frame_mgr";

function initDemos() {
    const canvas = document.getElementsByTagName('canvas')[0];

    initScene(canvas);

    DemoActionList.Init(canvas, 200);

    DemoActionHome.init(canvas);

    DemoActionSpine01.init();
}

function initScene(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);

    // 初始化
    SpineModel.SpineResPath = 'resource/spines/';
    SpineManager.init(canvas);
    FrameMgr.setPermanent(SpineManager.renderLoop);

    const stats = new Stats();
    FrameMgr.setPermanent(() => { stats.update(); });
    document.body.appendChild(stats.dom);
}

export function init() {
    initDemos();
}