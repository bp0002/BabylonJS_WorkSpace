import { DemoActionList } from "../common/demo_action_list";
import { SceneManager } from "../pi_babylon/scene";
import { SceneStruct, ModelObj, ModelResPath, AppendModelObj } from "../pi_babylon/scene_base";
import { resolve } from "dns";
import { OfflineProvider } from "../pi_babylon/render3d/offline_provider";
import { loadImageRes } from 'pi_sys/device/image';
import { utf8Decode } from 'pi_sys/util/util';
import { RES_TYPE_FILE } from 'pi_sys/device/file';
import { url } from "inspector";
import { BABYLON } from "../pi_babylon/render3d/babylon";
import { LoaderTool } from "../pi_babylon/scene_tool";
import { SelectPanel } from "../common/select_panel";

export namespace DemoAction00 {
    export function init() {
        DemoActionList.registDemoAction({
            aname: 'demo00',
            desc: 'Sandbox',
            initCall,
            uninitCall
        });

        let isActive: boolean = false;
        let isListen: boolean = false;
        let _scene: SceneStruct;
        let fileMap: Map<string, ArrayBuffer> = new Map();
        let urlMap: Map<string, string> = new Map();
        let lockDiv: HTMLDivElement;
        let gltfName: string;
        let model: AppendModelObj;
        let _model: ModelObj;
        let _camera: BABYLON.ArcRotateCamera;
        function initCall(canvas: HTMLCanvasElement) {
            isActive = true;

            if (!isListen) {
                isListen = true;
                canvas.addEventListener("dragenter", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);

                canvas.addEventListener("dragover", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);

                canvas.addEventListener('drop', dropCall);
            }

            initScene(canvas);

            OfflineProvider.prototype.loadImage = function(url: string, image: HTMLImageElement, callBack?: (img: HTMLImageElement) => void) {
                    // TODO：将url转成小游戏
                    const _u = url;
                    const _window = <any>window;

                    const tempUrl = url.slice(1);
                    if (urlMap.has(tempUrl)) {
                        if (image) {
                            image.src = urlMap.get(tempUrl);
                        }
                        else {
                            image = new Image();
                            image.src = urlMap.get(tempUrl);
                        }
                        image.onload = () => {
                            callBack && callBack(image);
                        }
                    }
                    else {
                        loadImageRes(this.resTab, url, [image])
                            .then((res) => {
                                if (res.link) {
                                    callBack && callBack(res.link);
                                    this.resTab.delete(res);
                                } else {
                                    console.error("OfflineProvider.loadImage Error");
                                }
                            });
                    }
            };
            OfflineProvider.prototype.loadFile = function(url: string, sceneLoaded: (data: any) => void, _progressCallBack?: (data: any) => void, errorCallback?: () => void, _useArrayBuffer?: boolean) {
                const restype = RES_TYPE_FILE;
                // if (url.endsWith('.png') || url.endsWith('.jpg')) {
                //     restype = 'image';
                // } else {
                //     restype = RES_TYPE_FILE;
                // }

                const tempUrl = url.slice(1);
                if (fileMap.has(tempUrl)) {
                    if (url.endsWith('.gltf')) {
                        sceneLoaded(utf8Decode(fileMap.get(tempUrl)));
                    } else {
                        sceneLoaded(fileMap.get(tempUrl));
                    }
                }
                else {
                    this.resTab.load(restype, url, [url])
                        .then(
                            (r) => {
                                if (url.endsWith('.gltf')) {
                                    sceneLoaded(utf8Decode(r.link));
                                } else {
                                    sceneLoaded(r.link);
                                }
                            }
                        )
                        .catch(errorCallback);
                }
            };
        }
        function uninitCall() {
            // 销毁指定场景
            SceneManager.disposeScene(_scene.name);
            isActive = false;
            _scene = undefined;
        }
        function initScene(canvas: HTMLCanvasElement) {
            _remove();

            // 创建一个场景
            _scene = SceneManager.createScene('mainScene');
            // 导入模型必须的设置 - 设置场景为左手坐标系
            if (!_scene.impl.metadata) {
                _scene.impl.metadata = {};
            }
            _scene.impl.metadata.gltfAsLeftHandedSystem = true;
            (<any>window).scene = _scene;
            _camera = undefined;

            _camera = new BABYLON.ArcRotateCamera('cc', 1, 1, 20, BABYLON.Vector3.Zero(), _scene.impl);
            _camera.attachControl(canvas, true);

            _scene.addCamera(_camera);
            _scene.setCurrCamera(_camera.name);
            _scene.active();

            // 设置场景管理器主场景
            SceneManager.setMainScene(_scene);
        }
        function dropCall(e: DragEvent) {
            e.preventDefault();
            e.stopPropagation();

            _remove();
            if (isActive) {
                _dropCall(e);
            }
        }
        function _dropCall(e: DragEvent) {
            const len = e.dataTransfer.items.length;

            const arr = [];

            for (let i = 0; i < len; i++) {
                const entry = e.dataTransfer.items[i].webkitGetAsEntry();
                if (entry.isFile) {
                    console.log(entry);
                    const file = e.dataTransfer.files[i];
                    arr.push(_readFile(e.dataTransfer.files[i], entry));
                } else if (entry.isDirectory) {
                    console.log(entry);
                    entry.copyTo(entry.filesystem.root, entry.name, (e) => {
                        console.log(e);
                    }, (err) => {
                        console.log(err);
                    });
                }
            }

            _lockScreen();
            Promise.all(arr).then(() => {
                _loadModel();
            });
        }
        function _readFile(file: File, entry) {
            return new Promise((resolve, reject) => {
                if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        const result = event.target.result;

                        const blob = new Blob([<ArrayBuffer>result], { type: 'image/jpeg' });
                        const bloblurl = URL.createObjectURL(blob);
                        urlMap.set(file.name, bloblurl);
                        resolve();
                    });
                    reader.readAsArrayBuffer(file);
                }
                else {
                    if (file.name.endsWith('.gltf')) {
                        gltfName = file.name.slice(0, file.name.length - 5);
                    }
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        const result = event.target.result;
                        fileMap.set(file.name, <ArrayBuffer>result);
                        resolve();
                    });

                    reader.readAsArrayBuffer(file);
                }
            });
        }
        function _lockScreen() {
            lockDiv = document.createElement('div');
            lockDiv.style.height = '100%';
            lockDiv.style.width = '100%';
            lockDiv.style.position = 'absolute';
            lockDiv.style.backgroundColor = '#00229955';
            lockDiv.innerHTML = '加载中...';
        }
        function _unlockScreen() {
            lockDiv.remove();
        }
        function _remove() {
            fileMap.clear();
            urlMap.clear();
            if (model) {
                model.dispose();
                model = undefined;
            }
            gltfName = "";
        }
        function _loadModel() {
            if (gltfName && _scene) {
                // model = new AppendModelObj(gltfName, _scene, {
                //     path: "",
                //     fileName: "",
                //     animDefault: true,
                //     particleAutoStart: true
                // });
                // LoaderTool.loadSceneAsync(model, "/", gltfName + '.gltf').then(() => {
                //     _unlockScreen();
                // });

                _model = new ModelObj(gltfName, _scene, {
                    path: "",
                    fileName: "",
                    animDefault: true,
                    particleAutoStart: true
                });
                LoaderTool.insertMeshAsync(_model, "/", gltfName + '.gltf').then(() => {
                    _unlockScreen();
                });
            }
        }

        function _animDisplay() {
            // if (_model) {
            //     _model.
            // }
            // TODO
            SelectPanel.init([
                // ['eff_char_008_hurt', () => {
                //     newModel('eff_char_008_hurt');
                // }],
            ]);
        }

        function animeAll() {

        }
    }
}