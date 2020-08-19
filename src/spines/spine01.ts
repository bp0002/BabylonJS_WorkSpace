import { DemoActionList } from '../common/demo_action_list';
import { SelectPanel } from '../common/select_panel';
import { SpineScene } from '../lib/spine/src/spine_scene';
import { SpineModel, SpineFiles } from '../lib/spine/src/spine_model';
import { SpineManager } from '../lib/spine/src/spine_manager';

export namespace DemoActionSpine01 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: name,
            desc: desc,
            initCall: initCall,
            uninitCall: uninitCall
        });
    }

    const name = 'Spine01';
    const desc = 'Spine 导入';

    let _canvas: HTMLCanvasElement;
    let _scene: SpineScene;
    let _model: SpineModel;
    const cfg: {[index: string]: SpineFiles} = {
        dianji: {
            json: 'xiulian_dianji.spinejson',
            atlas: 'xiulian_dianji.atlas',
            images: ['xiulian_dianji.png']
        },
        dujie: {
            json: 'dujie.spinejson',
            atlas: 'dujie.atlas',
            images: ['dujie.png', 'dujie2.png', 'dujie3.png', 'dujie4.png', 'dujie5.png', 'dujie6.png', 'dujie7.png', 'dujie8.png', 'dujie9.png', 'dujie10.png', 'dujie11.png',
                'dujie12.png', 'dujie13.png', 'dujie14.png', 'dujie15.png', 'dujie16.png', 'dujie17.png', 'dujie18.png', 'dujie19.png'
            ]
        },
        meichaofeng: {
            json: 'meichaofeng.spinejson',
            atlas: 'meichaofeng.atlas',
            images: ['meichaofeng.png', 'meichaofeng2.png']
        },
        tongyi: {
            json: 'tongyi.spinejson',
            atlas: 'tongyi.atlas',
            images: ['tongyi.png', 'tongyi2.png']
        },
        wanzhuqian: {
            json: 'wanzhuqian.spinejson',
            atlas: 'wanzhuqian.atlas',
            images: ['wanzhuqian.png', 'wanzhuqian2.png']
        },
        xiulian: {
            json: 'xiulian.spinejson',
            atlas: 'xiulian.atlas',
            images: ['xiulian.png', 'xiulian2.png']
        },
        yanqiuhong: {
            json: 'yanqiuhong.spinejson',
            atlas: 'yanqiuhong.atlas',
            images: ['yanqiuhong.png', 'yanqiuhong2.png']
        },
    };

    const animCfg = {
        dianji: 'xiulian-dianji',
        dujie: 'dujie',
        meichaofeng: 'BL_WX',
        tongyi: 'TY_AJ',
        wanzhuqian: 'WSQ_AR',
        xiulian: 'xiulian',
        yanqiuhong: 'YQH_HX',
    };

    function initCall(canvas: HTMLCanvasElement) {
        _canvas = canvas;
        initScene();

        SelectPanel.init([
            [
                'dianji',
                () => {
                    createSpine('dianji');
                }
            ],
            [
                'dujie',
                () => {
                    createSpine('dujie');
                }
            ],
            [
                'meichaofeng',
                () => {
                    createSpine('meichaofeng');
                }
            ],
            [
                'tongyi',
                () => {
                    createSpine('tongyi');
                }
            ],
            [
                'wanzhuqian',
                () => {
                    createSpine('wanzhuqian');
                }
            ],
            [
                'xiulian',
                () => {
                    createSpine('xiulian');
                }
            ],
            [
                'yanqiuhong',
                () => {
                    createSpine('yanqiuhong');
                }
            ]
        ]);

        // TODO
    }

    function uninitCall() {

        // 销毁模型
        _model && _scene.removeSpine(_model);

        // 销毁场景
        SpineManager.destroyScene(_scene.name);
    }
    function initScene() {
        // 创建场景
        _scene = SpineManager.createScene(name);
        // 渲染前是否清空屏幕
        _scene.autoClear = true;

        // 指定主场景 - 将由 SpineManager 自动调用渲染
        SpineManager.mainScene = _scene;
    }
    function createSpine(spineName: string) {
        let flag = false;

        if (_model) {
            if (_model.name !== spineName) {
                flag = true;
                _scene.removeSpine(_model);
            }
        } else {
            flag = true;
        }

        if (flag) {
            const files = cfg[spineName];

            // 创建模型
            _model = SpineManager.createSpine(
                _scene.name,
                // 模型名称 - 模型文件所在文件夹名称
                spineName,
                {
                    // 是否自动适配canvas大小
                    autofit: true,
                    // 指定播放动画
                    animations: [
                        {
                            aname: (<any>animCfg)[spineName],
                            isLoop: true
                        }
                    ]
                },
                // 模型文件配置
                files
            );

            (<any>window).spine = _model;
        }
    }
}