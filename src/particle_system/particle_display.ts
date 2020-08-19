import { DemoActionList } from '../common/demo_action_list';
import { SelectPanel } from '../common/select_panel';
import { SceneInstance3D } from '../front/base/scene_struct';
import { InsertModelObj } from '../front/base/model_obj';
import { SceneManager } from '../front/base/scene';
import { CameraTool } from '../front/base/scene_tool';

export namespace DemoActionParticleDisplay {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: desc,
            initCall: initCall,
            uninitCall: uninitCall
        });
    }

    const name = 'ParticleDisplay';
    const desc = '导入已制作的粒子';

    let _canvas: HTMLCanvasElement;
    let _scene: SceneInstance3D;
    let _camera: BABYLON.FreeCamera;
    let _modelInsert: InsertModelObj;

    const cfg: any = {
        eff_char_008_hurt: ['eff_char_008_hurt', 'eff_char_008_hurt/'],
        eff_char_007_hurt: ['eff_char_007_hurt', 'eff_char_007_hurt/'],
        eff_char_007_attack: ['eff_char_007_attack', 'eff_char_007_attack/'],
        eff_char_006_attack: ['eff_char_006_attack', 'eff_char_006_attack/'],
        eff_char_006_hurt: ['eff_char_006_hurt', 'eff_char_006_hurt/'],
        eff_char_007_hurt_ps: ['eff_char_007_hurt_ps', 'eff_char_007_hurt_ps/'],
        eff_ui_baoxiang: ['eff_ui_baoxiang', 'eff_ui_baoxiang/'],
        eff_ui_yanhua_ll_001: ['eff_ui_yanhua_ll_001', 'eff_ui_yanhua_ll_001/'],
        smoke02: ['smoke02', 'smoke02/'],
        eff_ui_wjgqchuansong01: ['eff_ui_wjgqchuansong01', 'eff_ui_wjgqchuansong01/'],
        eff_ui_wjgqchuansong02: ['eff_ui_wjgqchuansong02', 'eff_ui_wjgqchuansong02/'],
        sce_wjgq: ['sce_wjgq', 'sce_wjgq/'],
        guangyun02: ['guangyun02', 'guangyun02/']
    };

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;

        initScene();

        // TODO
        SelectPanel.init([
            ['eff_char_008_hurt', () => {
                newModel('eff_char_008_hurt');
            }],
            ['eff_char_007_attack', () => {
                newModel('eff_char_007_attack');
            }],
            ['eff_char_007_hurt', () => {
                newModel('eff_char_007_hurt');
            }],
            ['eff_char_006_attack', () => {
                newModel('eff_char_006_attack');
            }],
            ['eff_char_006_hurt', () => {
                newModel('eff_char_006_hurt');
            }],
            ['eff_char_007_hurt_ps', () => {
                newModel('eff_char_007_hurt_ps');
            }],
            ['eff_ui_baoxiang', () => {
                newModel('eff_ui_baoxiang');
            }],
            ['eff_ui_yanhua_ll_001', () => {
                newModel('eff_ui_yanhua_ll_001');
            }],
            ['smoke02', () => {
                newModel('smoke02');
            }],
            ['eff_ui_wjgqchuansong01', () => {
                newModel('eff_ui_wjgqchuansong01');
            }],
            ['eff_ui_wjgqchuansong02', () => {
                newModel('eff_ui_wjgqchuansong02');
            }],
            ['sce_wjgq', () => {
                newModel('sce_wjgq');
            }],
            ['guangyun02', () => {
                newModel('guangyun02');
            }],
        ]);
    }

    function uninitCall() {
        SelectPanel.uninit();

        // TODO
        _modelInsert && _modelInsert.dispose();

        SceneManager.disposeScene(_scene.name);
    }

    function initScene() {
        _scene = SceneManager.createScene('mainScene');
        if (!_scene.impl.metadata) {
            _scene.impl.metadata = {};
        }
        _scene.impl.metadata.gltfAsLeftHandedSystem = true;
        _scene.impl.imageProcessingConfiguration.exposure = 4;

        // TODO
        _camera = new BABYLON.FreeCamera('camera', BABYLON.Vector3.Zero(), _scene.impl);
        _camera.mode = BABYLON.FreeCamera.ORTHOGRAPHIC_CAMERA;
        // _camera.attachControl(_canvas, true);
        _scene.addCamera(_camera);
        _scene.setCurrCamera(_camera.name);
        _scene.active();

        CameraTool.changeCameraOrth(_camera, 6.5, _canvas.width, _canvas.height, false);

        const node = new BABYLON.TransformNode('F', _scene.impl);
        node.position.copyFromFloats(0, 6, 14);
        node.rotation = new BABYLON.Vector3(15 / 180 * 3.14, 3.14, 0);
        _camera.parent = node;

        (<any>window).scene = _scene;
        // 设置场景管理器主场景
        SceneManager.setMainScene(_scene);
    }

    function newModel(name: string) {
        const files = cfg[name];

        let flag = false;

        if (_modelInsert) {
            if (_modelInsert.name !== name) {
                _modelInsert.dispose();
                flag = true;
            }
        } else {
            flag = true;
        }

        if (flag) {
            // 场景内插入模型
            _modelInsert = new InsertModelObj(name, _scene, {
                fileName: files[0],
                path: files[1],
                particleAutoStart: true,
                animDefault: true,
                insertedCall: () => {
                    console.log(`${name} 创建成功`);
                }
            });
            (<any>window).model = _modelInsert;
        }
        
    }

}