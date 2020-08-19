import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { SceneStruct } from "../pi_babylon/scene_base";

export namespace DemoActionHome {
    export function init(canvas: HTMLCanvasElement) {
        DemoActionList.registDemoAction({
            aname: 'home',
            desc: `返回首页 - (${canvas.width}-${canvas.height})`,
            initCall,
            uninitCall
        });

        function initCall(canvas: HTMLCanvasElement) {
            open('./index.html', '_self');
        }
        function uninitCall() {
        }
    }
}