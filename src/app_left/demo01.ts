import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { SceneStruct } from "../pi_babylon/scene_base";

export namespace DemoAction01 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: 'demo01',
            desc: '场景 创建/销毁',
            initCall,
            uninitCall
        });

        let _scene: SceneStruct;
        function initCall(canvas: HTMLCanvasElement) {
            initScene(canvas);
        }
        function uninitCall() {
            // 销毁指定场景
            SceneManager.disposeScene(_scene.name);
        }
        function initScene(canvas: HTMLCanvasElement) {
            // 创建一个场景
            _scene = SceneManager.createScene('mainScene');
            (<any>window).scene = _scene;
        }
    }
}