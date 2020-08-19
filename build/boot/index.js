(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../front/main");
window.addEventListener('DOMContentLoaded', main_1.InitOk);
},{"../front/main":12}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scene_1 = require("../../base/scene");
/**
 * 功能模块
 * * 主功能，babylon 3D demo
 */
class Index {
    /**
     * 初始化时，创建一个简单的完整的场景展示
     * * 相机
     * * 灯光
     * * 球体
     * * 平面
     * @param canvas 目标 canvas
     */
    static init(canvas) {
        this.canvas = canvas;
        scene_1.SceneManager.init(canvas);
        const func = () => {
            scene_1.SceneManager.renderLoop();
            requestAnimationFrame(func);
        };
        requestAnimationFrame(func);
        // 创建场景
        this.scene = scene_1.SceneManager.createScene('test');
        const camera = new BABYLON.ArcRotateCamera('camera1', 1, 1, 10, BABYLON.Vector3.Zero(), this.scene.impl);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        // 添加相机
        this.scene.addCamera(camera);
        // 设置活动相机
        this.scene.setCurrCamera(camera.name);
        // 可以激活场景
        this.scene.active();
        scene_1.SceneManager.setMainScene(this.scene);
        // 添加灯光
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene.impl);
        // this.scene.addLight('light1', light);
        // // 添加球体
        // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene.scene);
        // sphere.position.y = 1;
        // // 添加平面
        // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene.scene);
        // ground.position.y = 0.1;
        // var sceneIn = new BABYLON.SceneInstrumentation(this.scene.scene);
        const model = this.scene.insertMesh('buster_drone', {
            rayID: 1,
            modelName: undefined,
            path: '../../resource/model/buster_drone/',
            /**
             * 要加载的模型的资源文件名称
             * * 资源文件名称
             */
            fileName: 'scene',
            /**
             * 加载成功的回调
             */
            insertedCall: (model) => {
                console.warn(`Insert Scuccess.`);
                // this.scene.activeCamera = camera;
                let span = document.createElement('a');
                document.body.appendChild(span);
                span.innerText = `GLTF Model From: LaVADraGoN's <Buster Drone>`;
                span.style.cssText = 'position:absolute;height:24px;color:red;z-index:10000000;';
                span.href = 'https://sketchfab.com/3d-models/buster-drone-294e79652f494130ad2ab00a13fdbafd';
            }
        });
        model.setPostion([0, 0.0, 0.0]);
        model.setScale([0.01, 0.01, 0.01]);
        model.setAnim({ animName: 'CINEMA_4D_Basis', isLoop: true });
    }
    static createEngine(canvas) {
        return new BABYLON.Engine(canvas, true);
    }
}
exports.Index = Index;
},{"../../base/scene":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationGroupChange;
(function (AnimationGroupChange) {
    const cfgMap = new Map();
    function animChangeTo(modelName, changeName, animationGroupMap, curAnim, startCall, endCall) {
        let nextAnim = undefined;
        const cfg = cfgMap.get(modelName);
        if (cfg) {
            nextAnim = changeTo(changeName, animationGroupMap, cfg, curAnim, startCall, endCall);
        }
        return nextAnim;
    }
    AnimationGroupChange.animChangeTo = animChangeTo;
    function changeTo(changeName, animationGroupMap, cfg, curAnim, startCall, endCall) {
        let nextAnim = undefined;
        const info = cfg[changeName];
        if (info) {
            nextAnim = animationGroupMap.get(info.to);
            curAnim && (curAnim.loopAnimation = false);
            if (curAnim && curAnim.isPlaying) {
                curAnim.onAnimationGroupEndObservable.addOnce(() => {
                    try {
                        startCall && startCall();
                    }
                    catch (err) {
                    }
                });
            }
            else {
                if (nextAnim) {
                    nextAnim.onAnimationGroupEndObservable.addOnce(() => {
                        try {
                            endCall && endCall();
                        }
                        catch (err) {
                        }
                    });
                    nextAnim.play(info.isLoop);
                }
            }
        }
        return nextAnim;
    }
    AnimationGroupChange.changeTo = changeTo;
    function registAnimationGroupChnageCfg(modelName, cfg) {
        cfgMap.set(modelName, cfg);
    }
    AnimationGroupChange.registAnimationGroupChnageCfg = registAnimationGroupChnageCfg;
    function getAnimationGroupChnageCfg(modelName) {
        return cfgMap.get(modelName);
    }
    AnimationGroupChange.getAnimationGroupChnageCfg = getAnimationGroupChnageCfg;
})(AnimationGroupChange = exports.AnimationGroupChange || (exports.AnimationGroupChange = {}));
},{}],4:[function(require,module,exports){
"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BABYLONLoading {
    constructor() {
        this.loadingUIBackgroundColor = 'gold';
        this.loadingUIText = '';
    }
    displayLoadingUI() {
        //
    }
    hideLoadingUI() {
        //
    }
}
exports.BABYLONLoading = BABYLONLoading;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CAMERATYPES;
(function (CAMERATYPES) {
    CAMERATYPES["ArcRotateCamera"] = "ArcRotateCamera";
    CAMERATYPES["UniversalCamera"] = "UniversalCamera";
    CAMERATYPES["TargetCamera"] = "TargetCamera";
})(CAMERATYPES = exports.CAMERATYPES || (exports.CAMERATYPES = {}));
var SceneRenderFlags;
(function (SceneRenderFlags) {
    SceneRenderFlags["active"] = "active";
    SceneRenderFlags["pause"] = "pause";
    SceneRenderFlags["dispose"] = "dispose";
})(SceneRenderFlags = exports.SceneRenderFlags || (exports.SceneRenderFlags = {}));
var LIGHTTYPES;
(function (LIGHTTYPES) {
    LIGHTTYPES["HemisphericLight"] = "HemisphericLight";
})(LIGHTTYPES = exports.LIGHTTYPES || (exports.LIGHTTYPES = {}));
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactorySceneGUI = (engine) => {
    return new BABYLON.Scene(engine);
};
exports.FactoryScene3D = (engine) => {
    return new BABYLON.Scene(engine);
};
exports.FactoryEngineOnlyGUI = (canvas) => {
    // 引擎创建 - 注意参数配置
    return new BABYLON.Engine(canvas, false, {
        disableWebGL2Support: true
    }, false);
};
exports.FactoryEngine = (canvas) => {
    // 资源管理
    // const resTab = new ResTab();
    // resTab.timeout = 5000;
    // Engine.prepare(resTab);
    // const width = canvas.width;
    // const height = canvas.height;
    // 引擎创建 - 注意参数配置
    const engine = new BABYLON.Engine(canvas, false, {
    // disableWebGL2Support: true
    // stencil: true
    }, false);
    // engine.setSize(width, height);
    engine.doNotHandleContextLost = true; // Handling WebGL context lost
    engine.enableOfflineSupport = true; // 该值设置为true时才能支持外部脱机资源接管
    engine.disableManifestCheck = true;
    return engine;
};
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const animation_group_change_1 = require("./animation_group_change");
const scene_tool_1 = require("./scene_tool");
class AppendModelObj {
    /**
     * 创建模型
     * @param meshName 模型对象命名
     * @param scene 目标场景
     * @param opt 模型配置 - 可以不传，后续通过 loadAsync 加载
     */
    constructor(meshName, scene, opt = {}) {
        this.rayID = -1;
        // public impl: BABYLON.AbstractMesh;
        this.rootImpl = undefined;
        this.isDisposed = false;
        this.isLoaded = false;
        this.loadPromise = undefined;
        this.appened = (scene) => {
            if (!this.isDisposed) {
                this.isLoaded = true;
                this.loadedCall && this.loadedCall(this);
            }
        };
        this.name = meshName;
        this.scene = scene;
        this.path = opt.path || '';
        this.fileName = opt.fileName;
        this.modelName = opt.modelName;
        this.loadedCall = opt.loadedCall;
        if (this.fileName) {
            scene_tool_1.LoaderTool.loadScene(this);
        }
    }
    get isReady() {
        return this.rootImpl && this.rootImpl.isReady;
    }
    dispose() {
        if (this.isLoaded) {
            this.rootImpl && this.rootImpl.dispose();
        }
        this.scene = undefined;
        this.loadPromise = undefined;
        this.isDisposed = true;
    }
    /**
     * 返回 Promise
     * @param opt
     */
    loadAsync(opt) {
        if (!this.fileName) {
            this.path = opt.path || '';
            this.fileName = opt.fileName;
            this.modelName = opt.modelName;
            // this.loadedCall = opt.loadedCall;
            this.loadPromise = new Promise((resolve, reject) => {
                scene_tool_1.LoaderTool.loadSceneAsync(this).then(() => {
                    resolve(this);
                })
                    .catch(reject);
            });
        }
        else {
            this.loadPromise = Promise.reject(`已在创建时进行加载`);
        }
        return this.loadPromise;
    }
}
exports.AppendModelObj = AppendModelObj;
class InsertModelObj {
    constructor(meshName, scene, opt = {}) {
        this.isDisposed = false;
        this.isLoaded = false;
        this.isVisible = false;
        this.alpha = 1;
        /**
         * 导入的动画是否默认播放
         */
        this.animDefault = false;
        this.particleAutoStart = true;
        /**
         * 切换动画时是否平滑过渡
         */
        this.changeAnimEnableBlending = false;
        /**
         * 切换动画时过渡速度 默认 0.01
         */
        this.changeAnimBlendSpeed = 0.01;
        this.workWithAnimationGroupChange = false;
        this.needDepthPrePass = false;
        // public readonly rayID: number;
        this._rayID = -1;
        // public readonly name: string;
        this._name = "";
        this.meshMap = new Map();
        this.skeletonMap = new Map();
        this.animationMap = new Map();
        this.particleSysMap = new Map();
        this.particleSysList = [];
        this.attachOptList = [];
        this.childOptList = [];
        /**
         * 当前动画是否循环播放
         */
        this.isAnimationLoop = false;
        this.dispose = () => {
            if (this.isDisposed === true) {
                return;
            }
            this.loadPromise = undefined;
            this.isDisposed = true;
            this.animationMap.forEach((animGroup) => {
                animGroup.stop();
                animGroup.dispose();
            });
            this.animationMap.clear();
            this.particleSysList.forEach((ps) => {
                ps.disposeOnStop = true;
                ps.stop();
                ps.dispose();
            });
            this.childOptList.forEach((opt) => {
                opt.isFinished = true;
                if (opt.model !== undefined) {
                    opt.model.dispose();
                }
                else if (opt.mesh !== undefined) {
                    opt.mesh.dispose();
                }
            });
            this.attachOptList.length = 0;
            this.childOptList.length = 0;
            this.particleSysList.length = 0;
            if (this.isLoaded) {
                this.rootImpl && this.rootImpl.dispose(false, true);
                this.rootImpl && (this.rootImpl.parent = null);
            }
            this.meshMap.clear();
            this.skeletonMap.clear();
            this.particleSysMap.clear();
            this.animationMap.clear();
            this.animation = undefined;
            this._parent = undefined;
            this.rootImpl = undefined;
            this.lookAt = undefined;
            this.rotate = undefined;
            this.position = undefined;
            this.scale = undefined;
            this.insertedCall = undefined;
        };
        // tslint:disable-next-line:max-line-length
        this.loaded = (meshes, particleSystems, skeletons, animationGroups) => {
            if (this.isDisposed) {
                meshes[0].dispose();
                return;
            }
            this.isLoaded = true;
            this.rootImpl = meshes[0];
            if (meshes !== undefined) {
                meshes.forEach((mesh) => {
                    this.meshMap.set(mesh.id, mesh);
                    mesh.rayID = this.rayID;
                    if (mesh.material) {
                        mesh.material.needDepthPrePass = this.needDepthPrePass;
                    }
                });
            }
            if (animationGroups !== undefined) {
                this.animation = animationGroups[0];
                animationGroups.forEach((animGroup) => {
                    this.animationMap.set(animGroup.name, animGroup);
                });
            }
            if (skeletons !== undefined) {
                skeletons.forEach((skeleton) => {
                    this.skeletonMap.set(skeleton.id, skeleton);
                });
            }
            if (particleSystems !== undefined) {
                particleSystems.forEach((particleSys) => {
                    if (this.particleAutoStart) {
                        particleSys.start();
                    }
                    this.particleSysList.push(particleSys);
                    this.particleSysMap.set(particleSys.id, particleSys);
                });
            }
            this.changePostion();
            this.changeScale();
            this.changeRotate();
            this.changeLookAt();
            this.changeAlpha();
            this.changeEnable();
            this.updateAttach();
            this.updateAttachOpt();
            this.updateChildOpt();
            if (this.animDefault && animationGroups[0]) {
                animationGroups[0].start(!0);
            }
            else if (!this.animDefault) {
                this.changeAnim();
            }
            if (this.insertedCall) {
                this.insertedCall(this);
            }
        };
        this.animEndCall = () => {
            if (this.animEndCB !== undefined) {
                /**
                 * 使用外部设置的回调时，
                 * 注意: 这个回调运行逻辑中可能会重新设置,因此需要将本身要做的修改在回调调用前运行
                 * 可以将该属性修改为 属性代理方式设置，不会出现问题
                 */
                const func = this.animEndCB;
                this.animEndCB = undefined;
                func();
            }
        };
        /**
         * 更改模型动画
         * @param animName 目标动画名称
         * @param isLoop 是否循环播放
         * @param stopFlag 动画停止配置
         * @param endCall 动画结束回调
         */
        this.changeAnimation = () => {
            if (this.animOpt) {
                const speed = this.animOpt.speed === undefined ? 1 : this.animOpt.speed;
                const animName = this.animOpt.animName;
                const endCall = this.animOpt.endCall;
                const isLoop = this.animOpt.isLoop;
                const animGroup = this.animationMap.get(animName);
                if (animGroup !== undefined) {
                    if (this.changeAnimEnableBlending) {
                        animGroup.targetedAnimations.forEach((anim) => {
                            anim.animation.enableBlending = true;
                            anim.animation.blendingSpeed = this.changeAnimBlendSpeed;
                        });
                    }
                    if (animGroup.isStarted && isLoop) {
                        console.warn(`${animName} 动画已经执行！`);
                        animGroup.onAnimationGroupEndObservable.clear();
                        animGroup.stop();
                    }
                    animGroup.onAnimationGroupEndObservable.clear();
                    endCall && animGroup.onAnimationGroupEndObservable.add(endCall);
                    animGroup.start(isLoop, speed);
                    if (this.animOpt.goEnd) { // 是否跳转到动画最后一帧(非循环动画设置)
                        animGroup.goToFrame(animGroup.to);
                    }
                }
                else {
                    console.warn(`${animName} 动画不存在！`);
                }
                // this.animEndCB = endCall;
                this.animation = animGroup;
                this.isAnimationLoop = isLoop;
            }
        };
        this.stopAnimation = () => {
            if (this.animation && this.changeAnimEnableBlending && this.animation.isStarted) {
                this.animation.loopAnimation = false;
                this.animation.targetedAnimations.forEach((anim) => {
                    anim.animation.enableBlending = true;
                    anim.animation.blendingSpeed = this.changeAnimBlendSpeed;
                });
            }
            else {
                if (this.animation) {
                    this.animation.onAnimationGroupEndObservable.clear();
                    this.animation.stop();
                }
            }
        };
        this.pauseAnimation = () => {
            this.animation && this.animation.pause();
        };
        this.scene = scene;
        this._name = meshName;
        this._parent = opt.parent;
        this._rayID = opt.rayID || -1;
        this._path = opt.path || '';
        this._fileName = opt.fileName;
        this._modelName = opt.modelName;
        this.insertedCall = opt.insertedCall;
        this.animDefault = !!opt.animDefault;
        this.particleAutoStart = !!opt.particleAutoStart;
        this.isEnabled = true;
        this.imageSolts = opt.imageSolts;
        this.materialSolts = opt.materialSolts;
        this.needDepthPrePass = !!opt.needDepthPrePass;
        this.workWithAnimationGroupChange = !!opt.workWithAnimationGroupChange;
        if (this.fileName) {
            if (!opt.isEffect) {
                this.loadPromise = new Promise((resolve, reject) => {
                    scene_tool_1.LoaderTool.insertMeshAsync(this).then(() => {
                        resolve(this);
                    });
                });
            }
            else {
                this.loadPromise = new Promise((resolve, reject) => {
                    scene_tool_1.LoaderTool.insertEffectAsync(this).then(() => {
                        resolve(this);
                    });
                });
            }
        }
    }
    get parent() {
        return this._parent;
    }
    get rayID() {
        return this._rayID;
    }
    get name() {
        return this._name;
    }
    get path() {
        return this._path;
    }
    get fileName() {
        return this._fileName;
    }
    get modelName() {
        return this._modelName;
    }
    get isReady() {
        return this.rootImpl && this.rootImpl.isReady;
    }
    /**
     * 添加动画事件监听
     * @param key 动画事件关键字
     * @param func 监听 - 返回值为 true 表示该监听仅生效一次
     */
    addAnimationEventListen(key, func) {
        // if (this.loadPromise) {
        if (this.loadPromise && !1) {
            return this.loadPromise.then(() => {
                this.initAnimationEventMap();
                if (this.animEventMap) {
                    const event = this.animEventMap.get(key);
                    if (event) {
                        if (event._pi_listenList.includes(func)) {
                            console.warn(`再次相同监听 AnimationEvent - ${key}, 被忽略`);
                        }
                        else {
                            event._pi_addListen(func);
                        }
                        return;
                    }
                }
                console.warn(`AnimationEvent Not Found - ${key}`);
            });
        }
        else {
            return Promise.reject("未创建");
        }
    }
    /**
     * 返回 Promise
     * @param opt
     */
    loadAsync(opt) {
        if (this.fileName) {
            this._parent = opt.parent;
            this._rayID = opt.rayID || -1;
            this._path = opt.path || '';
            this._fileName = opt.fileName;
            this._modelName = opt.modelName;
            // this.insertedCall = opt.insertedCall;
            this.animDefault = !!opt.animDefault;
            this.particleAutoStart = !!opt.particleAutoStart;
            this.isEnabled = true;
            this.imageSolts = opt.imageSolts;
            this.materialSolts = opt.materialSolts;
            this.needDepthPrePass = !!opt.needDepthPrePass;
            this.workWithAnimationGroupChange = !!opt.workWithAnimationGroupChange;
            this.loadPromise = new Promise((resolve, reject) => {
                if (!opt.isEffect) {
                    scene_tool_1.LoaderTool.insertMeshAsync(this).then(() => {
                        resolve(this);
                    }).catch(reject);
                }
                else {
                    scene_tool_1.LoaderTool.insertEffectAsync(this).then(() => {
                        resolve(this);
                    }).catch(reject);
                }
            });
        }
        else {
            this.loadPromise = Promise.reject(`已在创建时进行加载`);
        }
        return this.loadPromise;
    }
    setAttach(opt) {
        this.attachOptList.push(opt);
        if (opt.modelOpt !== undefined) {
            opt.modelOpt.insertedCall = () => {
                if (opt.model) {
                    opt.mesh = opt.model.rootImpl;
                    if (this.isLoaded) {
                        this.updateAttachOpt();
                    }
                }
            };
            opt.model = this.scene.insertMesh(opt.name, opt.modelOpt);
        }
        else if (opt.model !== undefined) {
            opt.mesh = opt.model.rootImpl;
            if (this.isLoaded) {
                this.updateAttachOpt();
            }
        }
        else if (opt.mesh !== undefined) {
            if (this.isLoaded) {
                this.updateAttachOpt();
            }
        }
    }
    setChildModelOpt(opt) {
        this.childOptList.push(opt);
        if (opt.modelOpt !== undefined) {
            opt.modelOpt.insertedCall = () => {
                if (this.isLoaded) {
                    this.updateChildOpt();
                }
                opt.successCall && opt.successCall(opt);
            };
            opt.model = this.scene.insertMesh(opt.name, opt.modelOpt);
        }
        else if (opt.model !== undefined) {
            if (this.isLoaded) {
                this.updateChildOpt();
            }
        }
        else if (opt.mesh !== undefined) {
            if (this.isLoaded) {
                this.updateChildOpt();
            }
        }
    }
    setAlpha(data) {
        this.alpha = data;
        if (this.isLoaded) {
            this.changeAlpha();
        }
    }
    setPostion(data) {
        this.position = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changePostion();
        }
    }
    setScale(data) {
        this.scale = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeScale();
        }
    }
    setRotate(data) {
        this.rotate = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeRotate();
        }
    }
    setLookAt(data) {
        this.lookAt = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeLookAt();
        }
    }
    setVisible(data) {
        this.isVisible = data;
        if (this.isLoaded) {
            this.changeVisible();
        }
    }
    setEnabled(isEnabled) {
        this.isEnabled = isEnabled;
        if (this.isLoaded && this.isEnabled !== undefined) {
            this.changeEnable();
        }
    }
    setAnim(animOpt) {
        this.animOpt = animOpt;
        if (this.isLoaded) {
            this.changeAnim();
        }
    }
    stopAnim() {
        if (this.workWithAnimationGroupChange) {
            return;
        }
        if (this.isLoaded) {
            this.stopAnimation();
        }
        else {
            this.animOpt = undefined;
        }
    }
    pauseAnim() {
        if (this.isLoaded) {
            this.pauseAnimation();
        }
        else {
            this.animOpt = undefined;
        }
    }
    changeAlpha() {
        if (this.alpha !== undefined && this.alpha !== null && this.rootImpl) {
            this.rootImpl.getChildMeshes().forEach((mesh) => {
                if (mesh.material) {
                    mesh.material.alpha = this.alpha;
                }
            });
        }
    }
    changePostion() {
        if (this.position && this.rootImpl) {
            scene_tool_1.NodeTools.positNode(this.rootImpl, this.position);
        }
    }
    changeScale() {
        if (this.scale && this.rootImpl) {
            scene_tool_1.NodeTools.scaleNode(this.rootImpl, this.scale);
        }
    }
    changeRotate() {
        if (this.rotate && this.rootImpl) {
            scene_tool_1.NodeTools.rotateNode(this.rootImpl, this.rotate);
        }
    }
    changeLookAt() {
        if (this.lookAt && this.rootImpl) {
            scene_tool_1.NodeTools.nodeLookAt(this.rootImpl, this.lookAt);
        }
    }
    changeVisible() {
        if (this.isVisible !== undefined && this.rootImpl) {
            this.rootImpl.isVisible = this.isVisible;
        }
    }
    changeEnable() {
        if (this.isEnabled !== undefined && this.rootImpl) {
            this.rootImpl.setEnabled(this.isEnabled);
        }
    }
    updateAttachOpt() {
        let useCount = 0;
        let tempIndex = 0;
        let newListLen = 0;
        if (this.attachOptList) {
            const listLen = this.attachOptList.length;
            for (let len = listLen - 1; len >= 0; len--) {
                const opt = this.attachOptList[len];
                if (!opt) {
                    continue;
                }
                if (opt.mesh !== undefined) {
                    const skeleton = this.skeletonMap.get(opt.skeletonName);
                    if (skeleton !== undefined) {
                        const boneIndex = skeleton.getBoneIndexByName(opt.boneName);
                        if (boneIndex >= 0) {
                            this.rootImpl && opt.mesh.attachToBone(skeleton.bones[boneIndex], this.rootImpl);
                            opt.transform && scene_tool_1.NodeTools.nodeTransform(opt.mesh, opt.transform);
                        }
                    }
                    this.attachOptList[len] = undefined;
                    useCount++;
                }
            }
            newListLen = listLen - useCount;
            for (let i = 0, k = listLen - useCount; i < k; i++) {
                while (this.attachOptList[tempIndex] === undefined && tempIndex < listLen) {
                    tempIndex++;
                }
                if (this.attachOptList[tempIndex] !== undefined) {
                    this.attachOptList[i] = this.attachOptList[tempIndex];
                }
            }
            this.attachOptList.length = newListLen;
        }
    }
    updateChildOpt() {
        this.childOptList.forEach((opt) => {
            if (opt.isFinished !== true) {
                if (opt.model !== undefined) {
                    if (opt.model.rootImpl !== undefined) {
                        opt.isFinished = true;
                        this.rootImpl && (opt.model.rootImpl.parent = this.rootImpl);
                        opt.transform && scene_tool_1.NodeTools.nodeTransform(opt.model.rootImpl, opt.transform);
                    }
                }
                else if (opt.mesh !== undefined) {
                    opt.isFinished = true;
                    this.rootImpl && (opt.mesh.parent = this.rootImpl);
                    opt.transform && scene_tool_1.NodeTools.nodeTransform(opt.mesh, opt.transform);
                }
            }
        });
    }
    updateAttach() {
        //
    }
    changeAnim() {
        if (this.workWithAnimationGroupChange) {
            if (this.animOpt) {
                this.animation = animation_group_change_1.AnimationGroupChange.animChangeTo(this.name, this.animOpt.animName, this.animationMap, this.animation, this.animOpt ? this.animOpt.startCall : undefined, this.animOpt ? this.animOpt.endCall : undefined);
            }
        }
        else {
            this.stopAnimation();
            if (this.animOpt) {
                this.changeAnimation();
            }
        }
    }
    initAnimationEventMap() {
        // 动画事件
        this.animationMap.forEach((ag) => {
            if (ag.animatables) {
                ag.animatables.forEach(at => {
                    const list = at.getAnimations();
                    list && list.forEach((a) => {
                        const events = a._events;
                        events.forEach((event) => {
                            if (!this.animEventMap) {
                                this.animEventMap = new Map();
                            }
                            this.animEventMap.set(event._pi_eventKey, event);
                        });
                    });
                });
            }
        });
    }
}
exports.InsertModelObj = InsertModelObj;
},{"./animation_group_change":3,"./scene_tool":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-reference
/**
 * scene
 */
const babylondownload_1 = require("./babylondownload");
const scene_struct_1 = require("./scene_struct");
const base_1 = require("./base");
const base_factory_1 = require("./base_factory");
// type HookCall = (f: (e: PointerEvent) => void) => void;
exports.SceneManagerData = {
    canvas: undefined,
    mainscene: undefined,
    engine: undefined,
    sceneMap: new Map()
};
// tslint:disable-next-line:no-unnecessary-class
class SceneManager {
    /**
     * 初始化 渲染管理
     * @param cb 渲染创建后的回调
     */
    static init(canvas, cb) {
        // initExtends();
        exports.SceneManagerData.canvas = canvas;
        exports.SceneManagerData.engine = base_factory_1.FactoryEngine(exports.SceneManagerData.canvas);
        exports.SceneManagerData.engine.loadingScreen = new babylondownload_1.BABYLONLoading();
        cb && cb();
    }
    /**
     * 返回游戏的刷新率
     */
    static getFPS() {
        return SceneManager.curFPS;
    }
    static getFlushTerm() {
        const curTime = Date.now();
        //  限制帧数
        if (curTime - SceneManager.lastTime < 1000 / SceneManager.FPSLimit && SceneManager.limitFrame) {
            return true;
        }
        SceneManager.timeByTimes++;
        // 控制显示的帧数
        SceneManager.fpsStartTime = SceneManager.fpsStartTime || curTime;
        SceneManager.lastTime = curTime;
        if (curTime - SceneManager.fpsStartTime >= 1000) {
            SceneManager.curFPS = SceneManager.timeByTimes;
            SceneManager.timeByTimes = 0;
            SceneManager.fpsStartTime = curTime;
        }
        return false;
    }
    /**
     * 创建场景后清理 babylon底层为场景绑定的事件监听
     * @param scene 目标场景
     */
    static formatScenePointerEvent(scene) {
        if (exports.SceneManagerData.canvas) {
            exports.SceneManagerData.canvas.removeEventListener('pointerdown', scene.impl._inputManager._onPointerDown);
            exports.SceneManagerData.canvas.removeEventListener('pointermove', scene.impl._inputManager._onPointerMove);
            exports.SceneManagerData.canvas.removeEventListener('pointerup', scene.impl._inputManager._onPointerUp);
        }
    }
    /**
     * 渲染主场景以外的场景
     * @状态为暂停时不渲染
     * @项目逻辑控制何时渲染
     * @param sceneName 场景名称
     */
    static renderOtherScene(sceneName) {
        if (!exports.SceneManagerData.mainscene || sceneName !== exports.SceneManagerData.mainscene.name) {
            const scene = exports.SceneManagerData.sceneMap.get(sceneName);
            if (scene) {
                scene.render();
            }
        }
    }
    /**
     * 创建 一个 场景数据， 并记录在管理器中
     * @param sceneName 场景名称
     */
    static createScene(sceneName) {
        let sceneStruct;
        const temp = exports.SceneManagerData.sceneMap.get(sceneName);
        if (temp) {
            sceneStruct = temp;
        }
        else {
            sceneStruct = new scene_struct_1.SceneInstance3D(sceneName, exports.SceneManagerData.engine);
            sceneStruct.impl && (sceneStruct.impl.useConstantAnimationDeltaTime = false);
            BABYLON.Scene.MinDeltaTime = 50;
            BABYLON.Scene.MaxDeltaTime = 200;
            SceneManager.recordScene(sceneStruct);
        }
        return sceneStruct;
    }
    /**
     * 设置主场景
     * @param scene 目标场景
     * @param sceneName 目标场景名称，如果指定则忽略第一个参数
     */
    static setMainScene(scene, sceneName) {
        if (sceneName) {
            scene = exports.SceneManagerData.sceneMap.get(sceneName);
            exports.SceneManagerData.mainscene = scene;
        }
        else {
            exports.SceneManagerData.mainscene = scene;
        }
    }
    /**
     * 记录刚创建的目标场景
     * @param sceneStruct 目标场景
     */
    static recordScene(sceneStruct) {
        if (!!sceneStruct.name) {
            exports.SceneManagerData.sceneMap.set(sceneStruct.name, sceneStruct);
        }
        else {
            // BabylonLogTool.warn(`SceneStruct Name: ${sceneStruct.name} 无效！`);
        }
    }
    static beforeSceneDestroy() {
        // BabylonLogTool.log('destory hook');
    }
    /**
     * 销毁指定名称的场景
     * @param sceneName 场景名称
     */
    static disposeScene(sceneName) {
        const sceneStruct = exports.SceneManagerData.sceneMap.get(sceneName);
        if (sceneStruct) {
            if (sceneStruct === exports.SceneManagerData.mainscene) {
                exports.SceneManagerData.mainscene = undefined;
            }
            sceneStruct.dispose();
        }
        exports.SceneManagerData.sceneMap.delete(sceneName);
    }
    static createFBO(gl) {
        const fbo = gl.createFramebuffer();
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }
    static registerBeforeRenderCall(f) {
        if (this.beforeRenderCallList.indexOf(f) < 0) {
            this.beforeRenderCallList.push(f);
        }
    }
    static unregisterBeforeRenderCall(f) {
        const index = this.beforeRenderCallList.indexOf(f);
        if (index >= 0) {
            this.beforeRenderCallList.splice(index, 1);
        }
    }
    static registerAfterRenderCall(f) {
        if (this.afterRenderCallList.indexOf(f) < 0) {
            this.afterRenderCallList.push(f);
        }
    }
    static unregisterAfterRenderCall(f) {
        const index = this.afterRenderCallList.indexOf(f);
        if (index >= 0) {
            this.afterRenderCallList.splice(index, 1);
        }
    }
}
SceneManager.lastTime = 0;
SceneManager.fpsStartTime = 0;
SceneManager.curFPS = 30;
SceneManager.timeByTimes = 0;
SceneManager.limitFrame = true;
// 帧数限制
SceneManager.FPSLimit = 30;
SceneManager.beforeRenderCallList = [];
SceneManager.afterRenderCallList = [];
/**
 * 主场景渲染循环
 * @项目逻辑不可控制
 * @状态为暂停时不渲染
 */
SceneManager.renderLoop = () => {
    let scene;
    scene = exports.SceneManagerData.mainscene;
    SceneManager.beforeRenderCallList.forEach((f) => f());
    if (scene && scene.renderFlag === base_1.SceneRenderFlags.pause) {
        // 
    }
    else {
        if (scene) {
            scene.render();
        }
        else {
            exports.SceneManagerData.engine && exports.SceneManagerData.engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true, true);
        }
    }
    SceneManager.afterRenderCallList.forEach((f) => f());
};
exports.SceneManager = SceneManager;
},{"./babylondownload":4,"./base":5,"./base_factory":6,"./scene_struct":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scene_struct_base_1 = require("./scene_struct_base");
const base_1 = require("./base");
const model_obj_1 = require("./model_obj");
const base_factory_1 = require("./base_factory");
/**
 * 项目应用层的场景数据结构
 */
class SceneInstance3D extends scene_struct_base_1.SceneStructBase {
    /**
     *
     * @param sceneName 场景命名
     * @param engine 引擎
     */
    constructor(sceneName, engine) {
        super(sceneName, engine);
        this.viewportX = 0;
        /**
         * 场景内渲染光表
         */
        this.lightMap = new Map();
        /**
         * 场景内 场景环境级别节点表
         */
        this.appendMeshMap = new Map();
        this.pointerDownListenMap = new Map();
        this.pointerMoveListenMap = new Map();
        this.pointerUpListenMap = new Map();
        this.pointerClickListenMap = new Map();
        this.addDownListen = (listener) => {
            this.pointerDownListenMap.set(listener, listener);
        };
        this.removeDownListen = (listener) => {
            this.pointerDownListenMap.delete(listener);
        };
        this.addUpListen = (listener) => {
            this.pointerUpListenMap.set(listener, listener);
        };
        this.removeUpListen = (listener) => {
            this.pointerUpListenMap.delete(listener);
        };
        this.addMoveListen = (listener) => {
            this.pointerMoveListenMap.set(listener, listener);
        };
        this.removeMoveListen = (listener) => {
            this.pointerMoveListenMap.delete(listener);
        };
        this.addClickListen = (listener) => {
            this.pointerClickListenMap.set(listener, listener);
        };
        this.removeClickListen = (listener) => {
            this.pointerClickListenMap.delete(listener);
        };
        this.onPointerDown = (e) => {
            this.impl._inputManager._onPointerDown(e);
        };
        this.onPointerMove = (e) => {
            this.impl._inputManager._onPointerMove(e);
        };
        this.onPointerUp = (e) => {
            this.impl._inputManager._onPointerUp(e);
        };
        this.onPointerClick = (e) => {
            if (this.impl) {
                const rayInfo = this.impl.pick(e.x, e.y);
                this.pointerClickListenMap.forEach((func) => {
                    func({ rayInfo, e, s: undefined });
                });
            }
        };
    }
    create(engine) {
        const impl = base_factory_1.FactoryScene3D(engine);
        impl.renderTargetsEnabled = true;
        return impl;
    }
    /**
     * 导入场景模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    importScene(objName, opt = {}) {
        const model = new model_obj_1.AppendModelObj(objName, this, opt);
        this.appendMeshMap.set(objName, model);
    }
    /**
     * 插入模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    insertMesh(objName, opt = {}) {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const model = new model_obj_1.InsertModelObj(objName, this, opt);
        return model;
    }
    /**
     * 销毁
     */
    dispose() {
        this.camera && this.disposeObserver(this.camera);
        this.appendMeshMap.clear();
        this.impl && this.impl.dispose();
        this.camera = undefined;
        this.renderFlag = base_1.SceneRenderFlags.dispose;
    }
    /**
     * 停止所有动画
     */
    stopAnim() {
        this.impl && this.impl.stopAllAnimations();
    }
}
exports.SceneInstance3D = SceneInstance3D;
},{"./base":5,"./base_factory":6,"./model_obj":7,"./scene_struct_base":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const base_factory_1 = require("./base_factory");
class SceneStructBase {
    /**
     *
     * @param sceneName 场景命名
     * @param engine 引擎
     */
    constructor(sceneName, engine) {
        /**
         * 场景渲染状态
         */
        this.renderFlag = base_1.SceneRenderFlags.pause;
        /**
         * 场景内相机表
         */
        this.cameraMap = new Map();
        this.beforeRenderCallList = [];
        this.afterRenderCallList = [];
        this.render = () => {
            if (this.renderFlag === base_1.SceneRenderFlags.active) {
                if (this.impl) {
                    const gl = this.impl.getEngine()._gl;
                    gl.disable(gl.SCISSOR_TEST);
                    this.beforeRenderCallList.forEach((f) => f(this));
                    this.impl.render();
                    this.impl.getEngine().wipeCaches(true);
                    this.afterRenderCallList.forEach((f) => f(this));
                }
            }
        };
        this.activeObserver = (camera) => {
            console.warn(`Scene ${this.name} active!`);
        };
        this.disposeObserver = (camera) => {
            console.warn(`Scene ${this.name} dispose!`);
        };
        this.changeCameraObserver = (camera) => {
            console.log(`Scene ${this.name} camera change!`);
        };
        this.removeCameraObserver = (camera) => {
            console.log(`Scene ${this.name} camera change!`);
        };
        this.pickCall = (e, s) => {
            // 由子类实现
        };
        /**
         * 暂停渲染
         */
        this.pause = () => {
            this.renderFlag = base_1.SceneRenderFlags.pause;
            this.impl && this.impl.onPointerObservable.removeCallback(this.pickCall);
        };
        /**
         * 激活渲染
         */
        this.active = () => {
            if (this.camera !== undefined) {
                if (this.renderFlag !== base_1.SceneRenderFlags.dispose) {
                    if (this.impl && !this.impl.onPointerObservable.hasObservers()) {
                        this.impl.onPointerObservable.add(this.pickCall);
                    }
                    this.renderFlag = base_1.SceneRenderFlags.active;
                    this.activeObserver(this.camera);
                }
            }
        };
        this.name = sceneName;
        this.engine = engine;
        this.impl = this.create(engine);
    }
    create(engine) {
        return base_factory_1.FactorySceneGUI(engine);
    }
    /**
     * 设置当前活动相机
     * @param cameraName 目标相机名称
     * * 在场景内部相机表中查找
     */
    setCurrCamera(cameraName) {
        const camera = this.cameraMap.get(cameraName);
        if (!!camera && this.impl) {
            this.camera = camera;
            this.impl.activeCamera = camera;
            this.changeCameraObserver(this.camera);
        }
        else {
            console.warn(`SceneStruct.setCurrCamera：目标场景没有Name为${cameraName}的相机`);
        }
    }
    /**
     * 销毁相机
     * @param cameraName 目标相机名称
     */
    removeCamera(cameraName) {
        const camera = this.cameraMap.get(cameraName);
        if (camera !== undefined) {
            if (this.camera === camera) {
                this.removeCameraObserver(this.camera);
                this.camera = undefined;
                this.renderFlag = base_1.SceneRenderFlags.pause;
            }
            this.cameraMap.delete(cameraName);
            camera.dispose();
        }
    }
    /**
     * 添加相机
     * @param camera 目标相机对象
     */
    addCamera(camera) {
        this.cameraMap.set(camera.name, camera);
    }
    /**
     * 销毁
     */
    dispose() {
        this.camera && this.disposeObserver(this.camera);
        this.impl && this.impl.dispose();
        this.camera = undefined;
        this.renderFlag = base_1.SceneRenderFlags.dispose;
    }
    registerBeforeRenderCall(f) {
        if (this.beforeRenderCallList.indexOf(f) < 0) {
            this.beforeRenderCallList.push(f);
        }
    }
    unregisterBeforeRenderCall(f) {
        const index = this.beforeRenderCallList.indexOf(f);
        if (index >= 0) {
            this.beforeRenderCallList.splice(index, 1);
        }
    }
    registerAfterRenderCall(f) {
        if (this.afterRenderCallList.indexOf(f) < 0) {
            this.afterRenderCallList.push(f);
        }
    }
    unregisterAfterRenderCall(f) {
        const index = this.afterRenderCallList.indexOf(f);
        if (index >= 0) {
            this.afterRenderCallList.splice(index, 1);
        }
    }
}
exports.SceneStructBase = SceneStructBase;
},{"./base":5,"./base_factory":6}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-unnecessary-class
class NodeTools {
    /**
     * 旋转 Mesh - 自转
     * @param mesh 目标mesh
     * @param rotate 旋转参数： [ x, y, z ]
     */
    static rotateNode(node, rotate) {
        // if (!node.rotationQuaternion) {
        //     node.rotationQuaternion = new BABYLON.Quaternion();
        // }
        // NodeTools.rotateQuaternion(node.rotationQuaternion, rotate);
    }
    /**
     * 旋转 Mesh - 自转
     * @param quaternion 目标 Quaternion
     * @param rotate 旋转参数： [ x, y, z ]
     */
    static rotateQuaternion(quaternion, rotate) {
        // YXZ
        if (NodeTools.sceneAsRightHand) {
            BABYLON.Quaternion.RotationYawPitchRollToRef(rotate[1] - Math.PI, rotate[0], -rotate[2], quaternion);
        }
        else {
            BABYLON.Quaternion.RotationYawPitchRollToRef(rotate[1], rotate[0], rotate[2], quaternion);
        }
    }
    static positNode(node, data) {
        if (NodeTools.sceneAsRightHand) {
            node.position.set(-data[0], data[1], -data[2]);
        }
        else {
            node.position.set(data[0], data[1], data[2]);
        }
    }
    static scaleNode(node, data) {
        if (NodeTools.sceneAsRightHand) {
            node.scaling = new BABYLON.Vector3(data[0], data[1], -data[2]);
        }
        else {
            node.scaling = new BABYLON.Vector3(data[0], data[1], data[2]);
        }
    }
    static nodeLookAt(node, data) {
        if (NodeTools.sceneAsRightHand) {
            node.lookAt(new BABYLON.Vector3(data[0], data[1], -data[2]));
        }
        else {
            node.lookAt(new BABYLON.Vector3(data[0], data[1], data[2]));
        }
    }
    static nodeTransform(node, transform) {
        if (transform !== undefined) {
            if (transform.position) {
                NodeTools.positNode(node, transform.position);
            }
            if (transform.scale) {
                NodeTools.scaleNode(node, transform.scale);
            }
            if (transform.rotate) {
                NodeTools.rotateNode(node, transform.rotate);
            }
        }
    }
}
NodeTools.sceneAsRightHand = false;
exports.NodeTools = NodeTools;
// tslint:disable-next-line:no-unnecessary-class
class CameraTool {
    /**
     * 修改 正交相机视角
     * @param size 正交相机视角大小
     */
    static changeCameraOrth(camera, size, width, height, sizeForWidth = false) {
        const yDistance = sizeForWidth ? Math.round(size / width / height * 100) / 100 : size;
        const xDistance = sizeForWidth ? size : Math.round(size * width / height * 100) / 100;
        camera.orthoLeft = -xDistance;
        camera.orthoRight = xDistance;
        camera.orthoTop = yDistance;
        camera.orthoBottom = -yDistance;
    }
    static getAccurateSize(xDistance, w, h) {
        return xDistance / (w / h);
    }
}
exports.CameraTool = CameraTool;
// tslint:disable-next-line:no-unnecessary-class
var LoaderTool;
(function (LoaderTool) {
    let _ResPath = '';
    let _SceneResPath = '';
    let _ModelResPath = '';
    let _NodeResPath = '';
    let _EffectResPath = '';
    LoaderTool.getResPath = () => {
        return _ResPath;
    };
    LoaderTool.getSceneResPath = () => {
        return _SceneResPath;
    };
    LoaderTool.getModelResPath = () => {
        return _ModelResPath;
    };
    LoaderTool.getNodeResPath = () => {
        return _NodeResPath;
    };
    LoaderTool.getEffectResPath = () => {
        return _EffectResPath;
    };
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    function loadScene(model, targetPath, targetFile) {
        if (!model.scene) {
            return undefined;
        }
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;
        targetPath = targetPath ? targetPath : `${LoaderTool.getResPath()}${LoaderTool.getSceneResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;
        return BABYLON.SceneLoader.Append(targetPath, targetFile, sceneImpl, model.appened, (e) => {
            console.log(e);
        });
    }
    LoaderTool.loadScene = loadScene;
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    function loadSceneAsync(model, targetPath, targetFile) {
        if (!model.scene) {
            return Promise.reject("loadSceneAsync Error: not get scene");
        }
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;
        targetPath = targetPath ? targetPath : `${LoaderTool.getResPath()}${LoaderTool.getSceneResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;
        return BABYLON.SceneLoader.AppendAsync(targetPath, targetFile, sceneImpl, (e) => {
            console.log(e);
        }).then((res) => {
            model.appened(res);
        });
    }
    LoaderTool.loadSceneAsync = loadSceneAsync;
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    function insertMesh(model, targetPath, targetFile) {
        if (!model.scene) {
            return undefined;
        }
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;
        targetPath = targetPath ? targetPath : `${LoaderTool.getResPath()}${LoaderTool.getModelResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;
        // return BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, (e) => {
        //     console.log(e);
        // }, undefined, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts });
        return BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, (e) => {
            console.log(e);
        }, undefined, undefined);
    }
    LoaderTool.insertMesh = insertMesh;
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    function insertMeshAsync(model, targetPath, targetFile) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;
        targetPath = targetPath ? targetPath : `${LoaderTool.getResPath()}${LoaderTool.getModelResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;
        // return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, (e) => {
        //     console.log(e);
        // }, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts }).then(
        //         (res) => {
        //             model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
        //         }
        //     );
        return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, (e) => {
            console.log(e);
        }, undefined).then((res) => {
            model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
        });
    }
    LoaderTool.insertMeshAsync = insertMeshAsync;
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    function insertEffect(model, targetPath, targetFile) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;
        targetPath = targetPath ? targetPath : `${LoaderTool.getResPath()}${LoaderTool.getEffectResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;
        // BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, undefined, undefined, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts });
        BABYLON.SceneLoader.ImportMesh(modelName, targetPath, targetFile, sceneImpl, model.loaded, undefined, undefined, undefined);
    }
    LoaderTool.insertEffect = insertEffect;
    /**
     *
     * @param model 目标模型
     * @param targetPath 如果赋值(完整路径)将忽略 model 配置的路径
     * @param targetFile 如果赋值(完整路径)将忽略 model 配置的路径
     */
    function insertEffectAsync(model, targetPath, targetFile) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.impl;
        targetPath = targetPath ? targetPath : `${LoaderTool.getResPath()}${LoaderTool.getEffectResPath()}${path}`;
        targetFile = targetFile ? targetFile : `${fileName}.gltf`;
        // return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, undefined, undefined, { imageSolts: model.imageSolts, materialSolts: model.materialSolts })
        //     .then(
        //         (res) => {
        //             model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
        //         }
        //     );
        return BABYLON.SceneLoader.ImportMeshAsync(modelName, targetPath, targetFile, sceneImpl, undefined, undefined)
            .then((res) => {
            model.loaded(res.meshes, res.particleSystems, res.skeletons, res.animationGroups);
        });
    }
    LoaderTool.insertEffectAsync = insertEffectAsync;
})(LoaderTool = exports.LoaderTool || (exports.LoaderTool = {}));
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demo000_1 = require("./app/demo000");
exports.InitOk = () => {
    demo000_1.Index.init(document.getElementsByTagName('canvas')[0]);
};
},{"./app/demo000":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYm9vdC9pbmRleC50cyIsInNyYy9mcm9udC9hcHAvZGVtbzAwMC9pbmRleC50cyIsInNyYy9mcm9udC9iYXNlL2FuaW1hdGlvbl9ncm91cF9jaGFuZ2UudHMiLCJzcmMvZnJvbnQvYmFzZS9iYWJ5bG9uZG93bmxvYWQudHMiLCJzcmMvZnJvbnQvYmFzZS9iYXNlLnRzIiwic3JjL2Zyb250L2Jhc2UvYmFzZV9mYWN0b3J5LnRzIiwic3JjL2Zyb250L2Jhc2UvbW9kZWxfb2JqLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmUudHMiLCJzcmMvZnJvbnQvYmFzZS9zY2VuZV9zdHJ1Y3QudHMiLCJzcmMvZnJvbnQvYmFzZS9zY2VuZV9zdHJ1Y3RfYmFzZS50cyIsInNyYy9mcm9udC9iYXNlL3NjZW5lX3Rvb2wudHMiLCJzcmMvZnJvbnQvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsd0NBQXVDO0FBRXZDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxhQUFNLENBQUMsQ0FBQzs7OztBQ0ZwRCw0Q0FBZ0Q7QUFJaEQ7OztHQUdHO0FBQ0gsTUFBYSxLQUFLO0lBR2Q7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBeUI7UUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsb0JBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO1lBQ2Qsb0JBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMxQixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFDRCxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixPQUFPO1FBQ1AsSUFBSSxDQUFDLEtBQUssR0FBSSxvQkFBWSxDQUFDLFdBQVcsQ0FBQyxN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RUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUNKLENBQUM7SUFDVixDQUFDO0lBdEJlLDRCQUFpQixvQkFzQmhDLENBQUE7QUFDTCxDQUFDLEVBckxnQixVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQXFMMUI7Ozs7QUNoUkQsMkNBQXNDO0FBRXpCLFFBQUEsTUFBTSxHQUFHLEdBQUcsRUFBRTtJQUN2QixlQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IEluaXRPayB9IGZyb20gXCIuLi9mcm9udC9tYWluXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIEluaXRPayk7IiwiaW1wb3J0IHsgU2NlbmVNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2Jhc2Uvc2NlbmVcIjtcclxuaW1wb3J0IHsgU2NlbmVJbnN0YW5jZTNEIH0gZnJvbSBcIi4uLy4uL2Jhc2Uvc2NlbmVfc3RydWN0XCI7XHJcbmltcG9ydCB7IEluc2VydE1vZGVsT2JqIH0gZnJvbSBcIi4uLy4uL2Jhc2UvbW9kZWxfb2JqXCI7XHJcblxyXG4vKipcclxuICog5Yqf6IO95qih5Z2XXHJcbiAqICog5Li75Yqf6IO977yMYmFieWxvbiAzRCBkZW1vXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSW5kZXgge1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2VuZTogU2NlbmVJbnN0YW5jZTNEO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbml7bvvIzliJvlu7rkuIDkuKrnroDljZXnmoTlrozmlbTnmoTlnLrmma/lsZXnpLpcclxuICAgICAqICog55u45py6XHJcbiAgICAgKiAqIOeBr+WFiVxyXG4gICAgICogKiDnkIPkvZNcclxuICAgICAqICog5bmz6Z2iXHJcbiAgICAgKiBAcGFyYW0gY2FudmFzIOebruaghyBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICBTY2VuZU1hbmFnZXIuaW5pdChjYW52YXMpO1xyXG4gICAgICAgIGNvbnN0IGZ1bmMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5yZW5kZXJMb29wKCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmMpO1xyXG4gICAgICAgIC8vIOWIm+W7uuWcuuaZr1xyXG4gICAgICAgIHRoaXMuc2NlbmUgID0gU2NlbmVNYW5hZ2VyLmNyZWF0ZVNjZW5lKCd0ZXN0Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBCQUJZTE9OLkFyY1JvdGF0ZUNhbWVyYSgnY2FtZXJhMScsIDEsIDEsIDEwLCBCQUJZTE9OLlZlY3RvcjMuWmVybygpLCB0aGlzLnNjZW5lLmltcGwpO1xyXG4gICAgICAgIGNhbWVyYS5zZXRUYXJnZXQoQkFCWUxPTi5WZWN0b3IzLlplcm8oKSk7XHJcbiAgICAgICAgY2FtZXJhLmF0dGFjaENvbnRyb2woY2FudmFzLCB0cnVlKTtcclxuICAgICAgICAvLyDmt7vliqDnm7jmnLpcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZENhbWVyYShjYW1lcmEpO1xyXG4gICAgICAgIC8vIOiuvue9rua0u+WKqOebuOaculxyXG4gICAgICAgIHRoaXMuc2NlbmUuc2V0Q3VyckNhbWVyYShjYW1lcmEubmFtZSk7XHJcbiAgICAgICAgLy8g5Y+v5Lul5r+A5rS75Zy65pmvXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hY3RpdmUoKTtcclxuXHJcbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNldE1haW5TY2VuZSh0aGlzLnNjZW5lKTtcclxuXHJcbiAgICAgICAgLy8g5re75Yqg54Gv5YWJXHJcbiAgICAgICAgY29uc3QgbGlnaHQgPSBuZXcgQkFCWUxPTi5IZW1pc3BoZXJpY0xpZ2h0KCdsaWdodDEnLCBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDEsIDApLCB0aGlzLnNjZW5lLmltcGwpO1xyXG4gICAgICAgIC8vIHRoaXMuc2NlbmUuYWRkTGlnaHQoJ2xpZ2h0MScsIGxpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gLy8g5re75Yqg55CD5L2TXHJcbiAgICAgICAgLy8gY29uc3Qgc3BoZXJlID0gQkFCWUxPTi5NZXNoLkNyZWF0ZVNwaGVyZSgnc3BoZXJlMScsIDE2LCAyLCB0aGlzLnNjZW5lLnNjZW5lKTtcclxuICAgICAgICAvLyBzcGhlcmUucG9zaXRpb24ueSA9IDE7XHJcblxyXG4gICAgICAgIC8vIC8vIOa3u+WKoOW5s+mdolxyXG4gICAgICAgIC8vIGNvbnN0IGdyb3VuZCA9IEJBQllMT04uTWVzaC5DcmVhdGVHcm91bmQoJ2dyb3VuZDEnLCA2LCA2LCAyLCB0aGlzLnNjZW5lLnNjZW5lKTtcclxuICAgICAgICAvLyBncm91bmQucG9zaXRpb24ueSA9IDAuMTtcclxuXHJcbiAgICAgICAgLy8gdmFyIHNjZW5lSW4gPSBuZXcgQkFCWUxPTi5TY2VuZUluc3RydW1lbnRhdGlvbih0aGlzLnNjZW5lLnNjZW5lKTtcclxuXHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSB0aGlzLnNjZW5lLmluc2VydE1lc2goJ2J1c3Rlcl9kcm9uZScsIHtcclxuICAgICAgICAgICAgcmF5SUQ6IDEsXHJcbiAgICAgICAgICAgIG1vZGVsTmFtZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBwYXRoOiAnLi4vLi4vcmVzb3VyY2UvbW9kZWwvYnVzdGVyX2Ryb25lLycsXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDopoHliqDovb3nmoTmqKHlnovnmoTotYTmupDmlofku7blkI3np7BcclxuICAgICAgICAgICAgICogKiDotYTmupDmlofku7blkI3np7BcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiAnc2NlbmUnLFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICog5Yqg6L295oiQ5Yqf55qE5Zue6LCDXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpbnNlcnRlZENhbGw6IChtb2RlbDogSW5zZXJ0TW9kZWxPYmopID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgSW5zZXJ0IFNjdWNjZXNzLmApO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5zY2VuZS5hY3RpdmVDYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICAgICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9IGBHTFRGIE1vZGVsIEZyb206IExhVkFEcmFHb04ncyA8QnVzdGVyIERyb25lPmAgO1xyXG4gICAgICAgICAgICAgICAgc3Bhbi5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoyNHB4O2NvbG9yOnJlZDt6LWluZGV4OjEwMDAwMDAwOyc7XHJcbiAgICAgICAgICAgICAgICBzcGFuLmhyZWYgPSAnaHR0cHM6Ly9za2V0Y2hmYWIuY29tLzNkLW1vZGVscy9idXN0ZXItZHJvbmUtMjk0ZTc5NjUyZjQ5NDEzMGFkMmFiMDBhMTNmZGJhZmQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG1vZGVsLnNldFBvc3Rpb24oWzAsIDAuMCwgMC4wXSk7XHJcbiAgICAgICAgbW9kZWwuc2V0U2NhbGUoWzAuMDEsIDAuMDEsIDAuMDFdKTtcclxuICAgICAgICBtb2RlbC5zZXRBbmltKHsgYW5pbU5hbWU6ICdDSU5FTUFfNERfQmFzaXMnLCBpc0xvb3A6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUVuZ2luZShjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBCQUJZTE9OLkVuZ2luZShjYW52YXMsIHRydWUpO1xyXG4gICAgfVxyXG59IiwiXHJcbmV4cG9ydCBuYW1lc3BhY2UgQW5pbWF0aW9uR3JvdXBDaGFuZ2Uge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25Hcm91cENoYW5nZUNmZyB7XHJcbiAgICAgICAgW2NoYW5nZU5hbWU6IHN0cmluZ106IEFuaW1hdGlvbkdyb3VwQ2hhbmdlSW5mbztcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uR3JvdXBDaGFuZ2VJbmZvIHtcclxuICAgICAgICBmcm9tOiBzdHJpbmc7XHJcbiAgICAgICAgdG86IHN0cmluZztcclxuICAgICAgICBpc0xvb3A6IGJvb2xlYW47XHJcbiAgICB9XHJcbiAgICBjb25zdCBjZmdNYXA6IE1hcDxzdHJpbmcsIEFuaW1hdGlvbkdyb3VwQ2hhbmdlQ2ZnPiA9IG5ldyBNYXAoKTtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBhbmltQ2hhbmdlVG8obW9kZWxOYW1lOiBzdHJpbmcsIGNoYW5nZU5hbWU6IHN0cmluZywgYW5pbWF0aW9uR3JvdXBNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uQW5pbWF0aW9uR3JvdXA+LCBjdXJBbmltOiBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwIHwgdW5kZWZpbmVkLCBzdGFydENhbGw6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkLCBlbmRDYWxsOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBuZXh0QW5pbTogQkFCWUxPTi5BbmltYXRpb25Hcm91cCB8IHVuZGVmaW5lZCAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3QgY2ZnID0gY2ZnTWFwLmdldChtb2RlbE5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoY2ZnKSB7XHJcbiAgICAgICAgICAgIG5leHRBbmltID0gY2hhbmdlVG8oY2hhbmdlTmFtZSwgYW5pbWF0aW9uR3JvdXBNYXAsIGNmZywgY3VyQW5pbSwgc3RhcnRDYWxsLCBlbmRDYWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXh0QW5pbTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VUbyhjaGFuZ2VOYW1lOiBzdHJpbmcsIGFuaW1hdGlvbkdyb3VwTWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwPiwgY2ZnOiBBbmltYXRpb25Hcm91cENoYW5nZUNmZywgY3VyQW5pbTogQkFCWUxPTi5BbmltYXRpb25Hcm91cCB8IHVuZGVmaW5lZCwgc3RhcnRDYWxsOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCwgZW5kQ2FsbDogRnVuY3Rpb24gfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgbmV4dEFuaW06IEJBQllMT04uQW5pbWF0aW9uR3JvdXAgfCB1bmRlZmluZWQgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSBjZmdbY2hhbmdlTmFtZV07XHJcblxyXG4gICAgICAgIGlmIChpbmZvKSB7XHJcbiAgICAgICAgICAgIG5leHRBbmltID0gYW5pbWF0aW9uR3JvdXBNYXAuZ2V0KGluZm8udG8pO1xyXG4gICAgICAgICAgICBjdXJBbmltICYmICgoPGFueT5jdXJBbmltKS5sb29wQW5pbWF0aW9uID0gZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAoY3VyQW5pbSAmJiBjdXJBbmltLmlzUGxheWluZykge1xyXG4gICAgICAgICAgICAgICAgY3VyQW5pbS5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydENhbGwgJiYgc3RhcnRDYWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRBbmltKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dEFuaW0ub25BbmltYXRpb25Hcm91cEVuZE9ic2VydmFibGUuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRDYWxsICYmIGVuZENhbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dEFuaW0ucGxheShpbmZvLmlzTG9vcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXh0QW5pbTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZWdpc3RBbmltYXRpb25Hcm91cENobmFnZUNmZyhtb2RlbE5hbWU6IHN0cmluZywgY2ZnOiBBbmltYXRpb25Hcm91cENoYW5nZUNmZykge1xyXG4gICAgICAgIGNmZ01hcC5zZXQobW9kZWxOYW1lLCBjZmcpO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEFuaW1hdGlvbkdyb3VwQ2huYWdlQ2ZnKG1vZGVsTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGNmZ01hcC5nZXQobW9kZWxOYW1lKTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKlxyXG4gKi9cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5pbnRlcmZhY2UgSUxvYWRpbmdTY3JlZW4ge1xyXG4gICAgLy8gZGVmYXVsdCBsb2FkZXIgc3VwcG9ydC4gT3B0aW9uYWwhXHJcbiAgICBsb2FkaW5nVUlCYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxuICAgIGxvYWRpbmdVSVRleHQ6IHN0cmluZztcclxuICAgIC8vIFdoYXQgaGFwcGVucyB3aGVuIGxvYWRpbmcgc3RhcnRzXHJcbiAgICBkaXNwbGF5TG9hZGluZ1VJKCk6IHZvaWQ7XHJcbiAgICAvLyBXaGF0IGhhcHBlbnMgd2hlbiBsb2FkaW5nIHN0b3BzXHJcbiAgICBoaWRlTG9hZGluZ1VJKCk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCQUJZTE9OTG9hZGluZyBpbXBsZW1lbnRzIElMb2FkaW5nU2NyZWVuIHtcclxuICAgIHB1YmxpYyBsb2FkaW5nVUlCYWNrZ3JvdW5kQ29sb3I6IHN0cmluZyA9ICdnb2xkJztcclxuICAgIHB1YmxpYyBsb2FkaW5nVUlUZXh0OiBzdHJpbmcgPSAnJztcclxuICAgIHB1YmxpYyBkaXNwbGF5TG9hZGluZ1VJKCkge1xyXG4gICAgICAgIC8vXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGlkZUxvYWRpbmdVSSgpIHtcclxuICAgICAgICAvL1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSW5zZXJ0TW9kZWxPYmosIEFwcGVuZE1vZGVsT2JqIH0gZnJvbSBcIi4vbW9kZWxfb2JqXCI7XHJcbmltcG9ydCB7IFNjZW5lSW5zdGFuY2UzRCB9IGZyb20gXCIuL3NjZW5lX3N0cnVjdFwiO1xyXG5cclxuLyoqXHJcbiAqIOmhueebruahhuaetuS4iyAtIOWcuuaZr+S4reaVsOaNrue7k+aehFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZTNERXZlbnRJbmZvIHtcclxuICAgIHJheUluZm86IGFueTtcclxuICAgIGU6IEJBQllMT04uUG9pbnRlckluZm87XHJcbiAgICBzOiBCQUJZTE9OLkV2ZW50U3RhdGUgfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIENBTUVSQVRZUEVTIHtcclxuICAgIEFyY1JvdGF0ZUNhbWVyYSA9ICdBcmNSb3RhdGVDYW1lcmEnLFxyXG4gICAgVW5pdmVyc2FsQ2FtZXJhID0gJ1VuaXZlcnNhbENhbWVyYScsXHJcbiAgICBUYXJnZXRDYW1lcmEgPSAnVGFyZ2V0Q2FtZXJhJ1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBTY2VuZVJlbmRlckZsYWdzIHtcclxuICAgIGFjdGl2ZSA9ICdhY3RpdmUnLFxyXG4gICAgcGF1c2UgPSAncGF1c2UnLFxyXG4gICAgZGlzcG9zZSA9ICdkaXNwb3NlJ1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBMSUdIVFRZUEVTIHtcclxuICAgIEhlbWlzcGhlcmljTGlnaHQgPSAnSGVtaXNwaGVyaWNMaWdodCdcclxufVxyXG5cclxuLyoqXHJcbiAqIFvoh6rlrprkuYnlkI3np7AsIOimgeS/ruaUueeahGdsdGYuaW1hZ2VzIOWIl+ihqOW6j+WPtywg55uu5qCH5Zu+54mH55u45a+55qih5Z6L5paH5Lu255qE6Lev5b6ELCDlm77niYflj5jnurnnkIbml7bmmK/lkKbpnIDopoHlj43ovaxZ6L20XVxyXG4gKi9cclxuZXhwb3J0IHR5cGUgSUltYWdlU29sdCA9IFtzdHJpbmcsIG51bWJlciwgc3RyaW5nLCBib29sZWFuP107XHJcbi8qKlxyXG4gKiBb6Ieq5a6a5LmJ5ZCN56ewLCDopoHkv67mlLnnmoRnbHRmLm1hdGVyaWFscyDliJfooajluo/lj7csIFvlr7nlupRleHRlbnNpb24uUElfbWF0ZXJpYWwg55qE5bGe5oCn5ZCNLOWxnuaAp+WAvF0gXVxyXG4gKi9cclxuZXhwb3J0IHR5cGUgSU1hdGVyaWFsU29sdCA9IFtzdHJpbmcsIG51bWJlciwgW3N0cmluZywgYW55XVtdXTtcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2Zvcm1PYmoge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnlrprkvY1cclxuICAgICAqL1xyXG4gICAgcG9zaXRpb246IEJBQllMT04uVmVjdG9yMztcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55peL6L2sXHJcbiAgICAgKi9cclxuICAgIHJvdGF0aW9uPzogQkFCWUxPTi5WZWN0b3IzO1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnnvKnmlL5cclxuICAgICAqL1xyXG4gICAgc2NhbGluZz86IEJBQllMT04uVmVjdG9yMztcclxufVxyXG4vKipcclxuICogM0Qg6IqC54K55Y+Y5o2i6YWN572uXHJcbiAqL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6aW50ZXJmYWNlLW5hbWVcclxuZXhwb3J0IGludGVyZmFjZSBJVHJhbnNmb3JtQ2ZnIHtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55a6a5L2NXHJcbiAgICAgKi9cclxuICAgIHBvc2l0aW9uPzogbnVtYmVyW107XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rFxyXG4gICAgICovXHJcbiAgICByb3RhdGU/OiBudW1iZXJbXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxlPzogbnVtYmVyW107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovliqDovb3phY3nva5cclxuICovXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbE9wdCB7XHJcbiAgICAvKipcclxuICAgICAqIOeItuiKgueCuVxyXG4gICAgICovXHJcbiAgICBwYXJlbnQ/OiBJbnNlcnRNb2RlbE9iajtcclxuICAgIC8qKlxyXG4gICAgICogcmF5SURcclxuICAgICAqL1xyXG4gICAgcmF5SUQ/OiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOimgeWKoOi9veeahOaooeWei+WQjeensFxyXG4gICAgICogKiDnvo7mnK/otYTmupAoR0xURikg5Lit5a6a5LmJ55qE5qih5Z6L5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIG1vZGVsTmFtZT86IHN0cmluZyB8IHN0cmluZ1tdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDopoHliqDovb3nmoTmqKHlnovlnKjmiYDlsZ7otYTmupDnrqHnkIbot6/lvoTkuIvnmoTlrZDot6/lvoRcclxuICAgICAqICog6LWE5rqQ5paH5Lu25a2Q6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIHBhdGg/OiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOimgeWKoOi9veeahOaooeWei+eahOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICogKiDotYTmupDmlofku7blkI3np7BcclxuICAgICAqL1xyXG4gICAgZmlsZU5hbWU/OiBzdHJpbmc7XHJcbiAgICBpc0VmZmVjdD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOiHquWKqOaSreaUvuWKqOeUuyAtIOm7mOiupOS4uuesrOS4gOS4qlxyXG4gICAgICovXHJcbiAgICBhbmltRGVmYXVsdD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOiHquWKqOaSreaUvueykuWtkFxyXG4gICAgICovXHJcbiAgICBwYXJ0aWNsZUF1dG9TdGFydD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOS9v+eUqOa3seW6pumihOmAmui/h1xyXG4gICAgICovXHJcbiAgICBuZWVkRGVwdGhQcmVQYXNzPzogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICog5o6n5Yi25b2T5YmN5Yqo55S75a6M5YWo57uT5p2f5omN5Lya5YiH5o2i5Yiw55uu5qCH5Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHdvcmtXaXRoQW5pbWF0aW9uR3JvdXBDaGFuZ2U/OiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnovnurnnkIbmp73mlbDmja5cclxuICAgICAqL1xyXG4gICAgaW1hZ2VTb2x0cz86IHN0cmluZ1tdIHwgSUltYWdlU29sdFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnovnurnnkIbmp73mlbDmja5cclxuICAgICAqL1xyXG4gICAgbWF0ZXJpYWxTb2x0cz86IHN0cmluZ1tdIHwgSU1hdGVyaWFsU29sdFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3miJDlip/nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgbG9hZGVkQ2FsbD8obW9kZWw6IEFwcGVuZE1vZGVsT2JqKTogYW55O1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3miJDlip/nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgaW5zZXJ0ZWRDYWxsPyhtb2RlbDogSW5zZXJ0TW9kZWxPYmopOiBhbnk7XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbENoaWxkT3B0IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5Yqg6L295Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIG1vZGVsT3B0PzogSU1vZGVsT3B0O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnotcclxuICAgICAqL1xyXG4gICAgbW9kZWw/OiBJbnNlcnRNb2RlbE9iajtcclxuICAgIC8qKlxyXG4gICAgICogTUVTSFxyXG4gICAgICovXHJcbiAgICBtZXNoPzogQkFCWUxPTi5BYnN0cmFjdE1lc2g7XHJcbiAgICAvKipcclxuICAgICAqIOWPmOaNouiuvue9rlxyXG4gICAgICovXHJcbiAgICB0cmFuc2Zvcm0/OiBJVHJhbnNmb3JtQ2ZnO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmYTliqDmiJDlip/moIfor4ZcclxuICAgICAqL1xyXG4gICAgaXNGaW5pc2hlZD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOWKoOi8ieWlveeahOWLleeVq+eLgOaFi1xyXG4gICAgICovXHJcbiAgICBpc0xvb3A/OiBib29sZWFuO1xyXG5cclxuICAgIHN1Y2Nlc3NDYWxsPyhPUFQ6IElNb2RlbENoaWxkT3B0KSA6IHZvaWQ7XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbEF0dGFjaE9wdCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOaooeWei+WKoOi9veWPguaVsFxyXG4gICAgICovXHJcbiAgICBtb2RlbE9wdD86IElNb2RlbE9wdDtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6LXHJcbiAgICAgKi9cclxuICAgIG1vZGVsPzogSW5zZXJ0TW9kZWxPYmo7XHJcbiAgICAvKipcclxuICAgICAqIE1FU0hcclxuICAgICAqL1xyXG4gICAgbWVzaD86IEJBQllMT04uQWJzdHJhY3RNZXNoO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmYTliqDliLDnm67moIcgc2tlbGV0b25cclxuICAgICAqL1xyXG4gICAgc2tlbGV0b25OYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOmZhOWKoOWIsOebruaghyDpqqjlpLRcclxuICAgICAqL1xyXG4gICAgYm9uZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5Y+Y5o2i6K6+572uXHJcbiAgICAgKi9cclxuICAgIHRyYW5zZm9ybT86IElUcmFuc2Zvcm1DZmc7XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbEFuaW1PcHQge1xyXG4gICAgYW5pbU5hbWU6IHN0cmluZztcclxuICAgIGdvRW5kPzogYm9vbGVhbjtcclxuICAgIGlzTG9vcDogYm9vbGVhbjtcclxuICAgIHN0b3BGbGFnPzogbnVtYmVyO1xyXG4gICAgZW5kQ2FsbD86IEZ1bmN0aW9uO1xyXG4gICAgc3RhcnRDYWxsPzogRnVuY3Rpb247XHJcbiAgICBzcGVlZD86IG51bWJlcjtcclxuICAgIG5lZWRTdG9wPzogYm9vbGVhbjsgLy8g5piv5ZCm6KaB5YGc5q2i5YmN5LiA5Liq5Yqo55S7XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTppbnRlcmZhY2UtbmFtZVxyXG5leHBvcnQgaW50ZXJmYWNlIElOb2RlT2JqIGV4dGVuZHMgSVNjZW5lT2JqIHtcclxuICAgIHJheUlEOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDlrZDot6/lvoRcclxuICAgICAqL1xyXG4gICAgcGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICovXHJcbiAgICBmaWxlTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOi1hOa6kOaWh+S7tuS4reaooeWei+WQjeensFxyXG4gICAgICovXHJcbiAgICBtb2RlbE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOi1hOa6kOWKoOi9veaIkOWKn+Wbnuiwg1xyXG4gICAgICovXHJcbiAgICBsb2FkZWRDYWxsPzogRnVuY3Rpb247XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg6LWE5rqQ5Yqg6L295oiQ5Yqf5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGluc2VydGVkQ2FsbD86IEZ1bmN0aW9uO1xyXG59XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6aW50ZXJmYWNlLW5hbWVcclxuZXhwb3J0IGludGVyZmFjZSBJU2NlbmVPYmoge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnmiYDlnKjlnLrmma9cclxuICAgICAqL1xyXG4gICAgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRCB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K56ZSA5q+B5o6l5Y+jXHJcbiAgICAgKi9cclxuICAgIGRpc3Bvc2U6IEZ1bmN0aW9uO1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnlj5jmjaLlsZ7mgKdcclxuICAgICAqL1xyXG4gICAgcm9vdEltcGw6IElUcmFuc2Zvcm1PYmogfCB1bmRlZmluZWQ7XHJcbn0iLCJcclxuZXhwb3J0IGNvbnN0IEZhY3RvcnlTY2VuZUdVSSA9IChlbmdpbmU6IEJBQllMT04uRW5naW5lKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBGYWN0b3J5U2NlbmUzRCA9IChlbmdpbmU6IEJBQllMT04uRW5naW5lKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBGYWN0b3J5RW5naW5lT25seUdVSSA9IChjYW52YXM6IGFueSkgPT4ge1xyXG4gICAgLy8g5byV5pOO5Yib5bu6IC0g5rOo5oSP5Y+C5pWw6YWN572uXHJcbiAgICByZXR1cm4gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgZmFsc2UsIHtcclxuICAgICAgICBkaXNhYmxlV2ViR0wyU3VwcG9ydDogdHJ1ZVxyXG4gICAgfSwgZmFsc2UpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEZhY3RvcnlFbmdpbmUgPSAoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkgPT4ge1xyXG4gICAgLy8g6LWE5rqQ566h55CGXHJcbiAgICAvLyBjb25zdCByZXNUYWIgPSBuZXcgUmVzVGFiKCk7XHJcbiAgICAvLyByZXNUYWIudGltZW91dCA9IDUwMDA7XHJcbiAgICAvLyBFbmdpbmUucHJlcGFyZShyZXNUYWIpO1xyXG5cclxuICAgIC8vIGNvbnN0IHdpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgLy8gY29uc3QgaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuICAgIC8vIOW8leaTjuWIm+W7uiAtIOazqOaEj+WPguaVsOmFjee9rlxyXG4gICAgY29uc3QgZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgZmFsc2UsIHtcclxuICAgICAgICAvLyBkaXNhYmxlV2ViR0wyU3VwcG9ydDogdHJ1ZVxyXG4gICAgICAgIC8vIHN0ZW5jaWw6IHRydWVcclxuICAgIH0sIGZhbHNlKTtcclxuICAgIC8vIGVuZ2luZS5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgIGVuZ2luZS5kb05vdEhhbmRsZUNvbnRleHRMb3N0ID0gdHJ1ZTsgLy8gSGFuZGxpbmcgV2ViR0wgY29udGV4dCBsb3N0XHJcbiAgICBlbmdpbmUuZW5hYmxlT2ZmbGluZVN1cHBvcnQgPSB0cnVlOyAvLyDor6XlgLzorr7nva7kuLp0cnVl5pe25omN6IO95pSv5oyB5aSW6YOo6ISx5py66LWE5rqQ5o6l566hXHJcbiAgICBlbmdpbmUuZGlzYWJsZU1hbmlmZXN0Q2hlY2sgPSB0cnVlO1xyXG5cclxuICAgIHJldHVybiBlbmdpbmU7XHJcbn07XHJcbiIsImltcG9ydCB7IEFuaW1hdGlvbkdyb3VwQ2hhbmdlIH0gZnJvbSBcIi4vYW5pbWF0aW9uX2dyb3VwX2NoYW5nZVwiO1xyXG5pbXBvcnQgeyBOb2RlVG9vbHMsIExvYWRlclRvb2wgfSBmcm9tIFwiLi9zY2VuZV90b29sXCI7XHJcbmltcG9ydCB7IElNb2RlbEFuaW1PcHQsIElNb2RlbENoaWxkT3B0LCBJTW9kZWxBdHRhY2hPcHQsIElNb2RlbE9wdCwgSUltYWdlU29sdCwgSU1hdGVyaWFsU29sdCwgSU5vZGVPYmogfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7IFNjZW5lSW5zdGFuY2UzRCB9IGZyb20gXCIuL3NjZW5lX3N0cnVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcGVuZE1vZGVsT2JqIGltcGxlbWVudHMgSU5vZGVPYmoge1xyXG4gICAgcHVibGljIHJheUlEOiBudW1iZXIgPSAtMTtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nO1xyXG4gICAgcHVibGljIGZpbGVOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbW9kZWxOYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBsb2FkZWRDYWxsOiAoKG1vZGVsOiBBcHBlbmRNb2RlbE9iaikgPT4gYW55KSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBzY2VuZTogU2NlbmVJbnN0YW5jZTNEIHwgdW5kZWZpbmVkO1xyXG4gICAgLy8gcHVibGljIGltcGw6IEJBQllMT04uQWJzdHJhY3RNZXNoO1xyXG4gICAgcHVibGljIHJvb3RJbXBsOiBCQUJZTE9OLkFic3RyYWN0TWVzaCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc0Rpc3Bvc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNMb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbG9hZFByb21pc2U6IFByb21pc2U8QXBwZW5kTW9kZWxPYmo+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGdldCBpc1JlYWR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvb3RJbXBsICYmIHRoaXMucm9vdEltcGwuaXNSZWFkeTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gbWVzaE5hbWUg5qih5Z6L5a+56LGh5ZG95ZCNXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUg55uu5qCH5Zy65pmvXHJcbiAgICAgKiBAcGFyYW0gb3B0IOaooeWei+mFjee9riAtIOWPr+S7peS4jeS8oO+8jOWQjue7remAmui/hyBsb2FkQXN5bmMg5Yqg6L29XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1lc2hOYW1lOiBzdHJpbmcsIHNjZW5lOiBTY2VuZUluc3RhbmNlM0QsIG9wdDogSU1vZGVsT3B0ID0ge30pIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBtZXNoTmFtZTtcclxuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gb3B0LnBhdGggfHwgJyc7XHJcbiAgICAgICAgdGhpcy5maWxlTmFtZSA9IG9wdC5maWxlTmFtZTtcclxuICAgICAgICB0aGlzLm1vZGVsTmFtZSA9IG9wdC5tb2RlbE5hbWU7XHJcbiAgICAgICAgdGhpcy5sb2FkZWRDYWxsID0gb3B0LmxvYWRlZENhbGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmZpbGVOYW1lKSB7XHJcbiAgICAgICAgICAgIExvYWRlclRvb2wubG9hZFNjZW5lKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEltcGwgJiYgdGhpcy5yb290SW1wbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjZW5lID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRQcm9taXNlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYXBwZW5lZCA9IChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZENhbGwgJiYgdGhpcy5sb2FkZWRDYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6L+U5ZueIFByb21pc2VcclxuICAgICAqIEBwYXJhbSBvcHQgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkQXN5bmMob3B0OiBJTW9kZWxPcHQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZU5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXRoID0gb3B0LnBhdGggfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsZU5hbWUgPSBvcHQuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWxOYW1lID0gb3B0Lm1vZGVsTmFtZTtcclxuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZWRDYWxsID0gb3B0LmxvYWRlZENhbGw7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBMb2FkZXJUb29sLmxvYWRTY2VuZUFzeW5jKHRoaXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFByb21pc2UgPSBQcm9taXNlLnJlamVjdChg5bey5Zyo5Yib5bu65pe26L+b6KGM5Yqg6L29YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkUHJvbWlzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc2VydE1vZGVsT2JqIGltcGxlbWVudHMgSU5vZGVPYmoge1xyXG4gICAgcHVibGljIHJvb3RJbXBsOiBCQUJZTE9OLkFic3RyYWN0TWVzaCB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc0Rpc3Bvc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNMb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBwb3NpdGlvbjogbnVtYmVyW10gfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgc2NhbGU6IG51bWJlcltdIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHJvdGF0ZTogbnVtYmVyW10gfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbG9va0F0OiBudW1iZXJbXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBhbHBoYTogbnVtYmVyID0gMTtcclxuICAgIHB1YmxpYyBhbmltT3B0OiBJTW9kZWxBbmltT3B0IHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGlzRW5hYmxlZDogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICog5a+85YWl55qE5Yqo55S75piv5ZCm6buY6K6k5pKt5pS+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhbmltRGVmYXVsdDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBhcnRpY2xlQXV0b1N0YXJ0OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBpbWFnZVNvbHRzOiBzdHJpbmdbXSB8IElJbWFnZVNvbHRbXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBtYXRlcmlhbFNvbHRzOiBzdHJpbmdbXSB8IElNYXRlcmlhbFNvbHRbXSB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5YiH5o2i5Yqo55S75pe25piv5ZCm5bmz5ruR6L+H5rihXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjaGFuZ2VBbmltRW5hYmxlQmxlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICog5YiH5o2i5Yqo55S75pe26L+H5rih6YCf5bqmIOm7mOiupCAwLjAxXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjaGFuZ2VBbmltQmxlbmRTcGVlZDogbnVtYmVyID0gMC4wMTtcclxuICAgIHB1YmxpYyB3b3JrV2l0aEFuaW1hdGlvbkdyb3VwQ2hhbmdlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbmVlZERlcHRoUHJlUGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNjZW5lOiBTY2VuZUluc3RhbmNlM0Q7XHJcbiAgICAvKipcclxuICAgICAqIOeItuiKgueCuVxyXG4gICAgICovXHJcbiAgICAvLyBwdWJsaWMgcGFyZW50OiBNb2RlbE9iajtcclxuICAgIHByaXZhdGUgX3BhcmVudDogSW5zZXJ0TW9kZWxPYmogfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgZ2V0IHBhcmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHJlYWRvbmx5IHJheUlEOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9yYXlJRDogbnVtYmVyID0gLTE7XHJcbiAgICBwdWJsaWMgZ2V0IHJheUlEKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYXlJRDtcclxuICAgIH1cclxuICAgIC8vIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3BhdGg6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBnZXQgcGF0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICAgIH1cclxuICAgIC8vIHB1YmxpYyByZWFkb25seSBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZmlsZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBnZXQgZmlsZU5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbGVOYW1lO1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHJlYWRvbmx5IG1vZGVsTmFtZTogc3RyaW5nIHwgc3RyaW5nW107XHJcbiAgICBwcml2YXRlIF9tb2RlbE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGdldCBtb2RlbE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsTmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpbnNlcnRlZENhbGw6ICgobW9kZWw6IEluc2VydE1vZGVsT2JqKSA9PiBhbnkpIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG1lc2hNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uQWJzdHJhY3RNZXNoPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBza2VsZXRvbk1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5Ta2VsZXRvbj4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYW5pbWF0aW9uTWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwYXJ0aWNsZVN5c01hcDogTWFwPHN0cmluZywgQkFCWUxPTi5JUGFydGljbGVTeXN0ZW0+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhcnRpY2xlU3lzTGlzdDogQkFCWUxPTi5JUGFydGljbGVTeXN0ZW1bXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dGFjaE9wdExpc3Q6IChJTW9kZWxBdHRhY2hPcHQgfCB1bmRlZmluZWQpW10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSBjaGlsZE9wdExpc3Q6IElNb2RlbENoaWxkT3B0W10gPSBbXTtcclxuICAgIC8qKlxyXG4gICAgICog5Yqo55S75omn6KGM57uT5p2f55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbUVuZENCOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5b2T5YmN5Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3liqjnlLvmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc0FuaW1hdGlvbkxvb3A6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbG9hZFByb21pc2U6IFByb21pc2U8SW5zZXJ0TW9kZWxPYmo+IHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBhbmltRXZlbnRNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uQW5pbWF0aW9uRXZlbnQ+IHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGdldCBpc1JlYWR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvb3RJbXBsICYmIHRoaXMucm9vdEltcGwuaXNSZWFkeTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKG1lc2hOYW1lOiBzdHJpbmcsIHNjZW5lOiBTY2VuZUluc3RhbmNlM0QsIG9wdDogSU1vZGVsT3B0ID0ge30pIHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG1lc2hOYW1lO1xyXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IG9wdC5wYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5fcmF5SUQgPSBvcHQucmF5SUQgfHwgLTE7XHJcbiAgICAgICAgdGhpcy5fcGF0aCA9IG9wdC5wYXRoIHx8ICcnO1xyXG4gICAgICAgIHRoaXMuX2ZpbGVOYW1lID0gb3B0LmZpbGVOYW1lO1xyXG4gICAgICAgIHRoaXMuX21vZGVsTmFtZSA9IG9wdC5tb2RlbE5hbWU7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRlZENhbGwgPSBvcHQuaW5zZXJ0ZWRDYWxsO1xyXG4gICAgICAgIHRoaXMuYW5pbURlZmF1bHQgPSAhIW9wdC5hbmltRGVmYXVsdDtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlQXV0b1N0YXJ0ID0gISFvcHQucGFydGljbGVBdXRvU3RhcnQ7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VTb2x0cyA9IG9wdC5pbWFnZVNvbHRzO1xyXG4gICAgICAgIHRoaXMubWF0ZXJpYWxTb2x0cyA9IG9wdC5tYXRlcmlhbFNvbHRzO1xyXG4gICAgICAgIHRoaXMubmVlZERlcHRoUHJlUGFzcyA9ICEhb3B0Lm5lZWREZXB0aFByZVBhc3M7XHJcbiAgICAgICAgdGhpcy53b3JrV2l0aEFuaW1hdGlvbkdyb3VwQ2hhbmdlID0gISFvcHQud29ya1dpdGhBbmltYXRpb25Hcm91cENoYW5nZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsZU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCFvcHQuaXNFZmZlY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyVG9vbC5pbnNlcnRNZXNoQXN5bmModGhpcykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyVG9vbC5pbnNlcnRFZmZlY3RBc3luYyh0aGlzKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDliqjnlLvkuovku7bnm5HlkKxcclxuICAgICAqIEBwYXJhbSBrZXkg5Yqo55S75LqL5Lu25YWz6ZSu5a2XXHJcbiAgICAgKiBAcGFyYW0gZnVuYyDnm5HlkKwgLSDov5Tlm57lgLzkuLogdHJ1ZSDooajnpLror6Xnm5HlkKzku4XnlJ/mlYjkuIDmrKFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEFuaW1hdGlvbkV2ZW50TGlzdGVuKGtleTogc3RyaW5nLCBmdW5jOiAoY3VyRnJhbWU/OiBudW1iZXIpID0+IGJvb2xlYW4pIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5sb2FkUHJvbWlzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmxvYWRQcm9taXNlICYmICExKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRQcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uRXZlbnRNYXAoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1FdmVudE1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5hbmltRXZlbnRNYXAuZ2V0KGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoPGFueT5ldmVudCkuX3BpX2xpc3Rlbkxpc3QuaW5jbHVkZXMoZnVuYykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihg5YaN5qyh55u45ZCM55uR5ZCsIEFuaW1hdGlvbkV2ZW50IC0gJHtrZXl9LCDooqvlv73nlaVgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICg8YW55PmV2ZW50KS5fcGlfYWRkTGlzdGVuKGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEFuaW1hdGlvbkV2ZW50IE5vdCBGb3VuZCAtICR7a2V5fWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCLmnKrliJvlu7pcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm54gUHJvbWlzZVxyXG4gICAgICogQHBhcmFtIG9wdCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxvYWRBc3luYyhvcHQ6IElNb2RlbE9wdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbGVOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IG9wdC5wYXJlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3JheUlEID0gb3B0LnJheUlEIHx8IC0xO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXRoID0gb3B0LnBhdGggfHwgJyc7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbGVOYW1lID0gb3B0LmZpbGVOYW1lO1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbE5hbWUgPSBvcHQubW9kZWxOYW1lO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmluc2VydGVkQ2FsbCA9IG9wdC5pbnNlcnRlZENhbGw7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbURlZmF1bHQgPSAhIW9wdC5hbmltRGVmYXVsdDtcclxuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZUF1dG9TdGFydCA9ICEhb3B0LnBhcnRpY2xlQXV0b1N0YXJ0O1xyXG4gICAgICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VTb2x0cyA9IG9wdC5pbWFnZVNvbHRzO1xyXG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFsU29sdHMgPSBvcHQubWF0ZXJpYWxTb2x0cztcclxuICAgICAgICAgICAgdGhpcy5uZWVkRGVwdGhQcmVQYXNzID0gISFvcHQubmVlZERlcHRoUHJlUGFzcztcclxuICAgICAgICAgICAgdGhpcy53b3JrV2l0aEFuaW1hdGlvbkdyb3VwQ2hhbmdlID0gISFvcHQud29ya1dpdGhBbmltYXRpb25Hcm91cENoYW5nZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdC5pc0VmZmVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIExvYWRlclRvb2wuaW5zZXJ0TWVzaEFzeW5jKHRoaXMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyVG9vbC5pbnNlcnRFZmZlY3RBc3luYyh0aGlzKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRQcm9taXNlID0gUHJvbWlzZS5yZWplY3QoYOW3suWcqOWIm+W7uuaXtui/m+ihjOWKoOi9vWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZFByb21pc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZGlzcG9zZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3Bvc2VkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFByb21pc2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuZm9yRWFjaCgoYW5pbUdyb3VwKSA9PiB7XHJcbiAgICAgICAgICAgIGFuaW1Hcm91cC5zdG9wKCk7XHJcbiAgICAgICAgICAgIGFuaW1Hcm91cC5kaXNwb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c0xpc3QuZm9yRWFjaCgocHMpID0+IHtcclxuICAgICAgICAgICAgcHMuZGlzcG9zZU9uU3RvcCA9IHRydWU7XHJcbiAgICAgICAgICAgIHBzLnN0b3AoKTtcclxuICAgICAgICAgICAgcHMuZGlzcG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkT3B0TGlzdC5mb3JFYWNoKChvcHQpID0+IHtcclxuICAgICAgICAgICAgb3B0LmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5tb2RlbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0Lm1lc2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgb3B0Lm1lc2guZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c0xpc3QubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbCAmJiB0aGlzLnJvb3RJbXBsLmRpc3Bvc2UoZmFsc2UsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RJbXBsICYmICh0aGlzLnJvb3RJbXBsLnBhcmVudCA9IG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tZXNoTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvbk1hcC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXNNYXAuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbk1hcC5jbGVhcigpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb290SW1wbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxvb2tBdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnJvdGF0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRlZENhbGwgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICBwdWJsaWMgbG9hZGVkID0gKG1lc2hlczogQkFCWUxPTi5BYnN0cmFjdE1lc2hbXSwgcGFydGljbGVTeXN0ZW1zOiBCQUJZTE9OLklQYXJ0aWNsZVN5c3RlbVtdLCBza2VsZXRvbnM6IEJBQllMT04uU2tlbGV0b25bXSwgYW5pbWF0aW9uR3JvdXBzOiBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwW10pID0+IHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwb3NlZCkge1xyXG4gICAgICAgICAgICBtZXNoZXNbMF0uZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEltcGwgPSBtZXNoZXNbMF07XHJcblxyXG4gICAgICAgIGlmIChtZXNoZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBtZXNoZXMuZm9yRWFjaCgobWVzaCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNoTWFwLnNldChtZXNoLmlkLCBtZXNoKTtcclxuICAgICAgICAgICAgICAgICg8YW55Pm1lc2gpLnJheUlEID0gdGhpcy5yYXlJRDtcclxuICAgICAgICAgICAgICAgIGlmIChtZXNoLm1hdGVyaWFsKXtcclxuICAgICAgICAgICAgICAgICAgICBtZXNoLm1hdGVyaWFsLm5lZWREZXB0aFByZVBhc3MgPSB0aGlzLm5lZWREZXB0aFByZVBhc3M7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkdyb3VwcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uR3JvdXBzWzBdO1xyXG4gICAgICAgICAgICBhbmltYXRpb25Hcm91cHMuZm9yRWFjaCgoYW5pbUdyb3VwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk1hcC5zZXQoYW5pbUdyb3VwLm5hbWUsIGFuaW1Hcm91cCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNrZWxldG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNrZWxldG9ucy5mb3JFYWNoKChza2VsZXRvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5za2VsZXRvbk1hcC5zZXQoc2tlbGV0b24uaWQsIHNrZWxldG9uKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFydGljbGVTeXN0ZW1zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGFydGljbGVTeXN0ZW1zLmZvckVhY2goKHBhcnRpY2xlU3lzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZUF1dG9TdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlU3lzLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3lzTGlzdC5wdXNoKHBhcnRpY2xlU3lzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVTeXNNYXAuc2V0KHBhcnRpY2xlU3lzLmlkLCBwYXJ0aWNsZVN5cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VQb3N0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTY2FsZSgpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlUm90YXRlKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VMb29rQXQoKTtcclxuICAgICAgICB0aGlzLmNoYW5nZUFscGhhKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VFbmFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBdHRhY2goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbURlZmF1bHQgJiYgYW5pbWF0aW9uR3JvdXBzWzBdKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbkdyb3Vwc1swXS5zdGFydCghMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5hbmltRGVmYXVsdCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW0oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmluc2VydGVkQ2FsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydGVkQ2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYW5pbUVuZENhbGwgPSAoKSA9PiB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFuaW1FbmRDQiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDkvb/nlKjlpJbpg6jorr7nva7nmoTlm57osIPml7bvvIxcclxuICAgICAgICAgICAgICog5rOo5oSPOiDov5nkuKrlm57osIPov5DooYzpgLvovpHkuK3lj6/og73kvJrph43mlrDorr7nva4s5Zug5q2k6ZyA6KaB5bCG5pys6Lqr6KaB5YGa55qE5L+u5pS55Zyo5Zue6LCD6LCD55So5YmN6L+Q6KGMXHJcbiAgICAgICAgICAgICAqIOWPr+S7peWwhuivpeWxnuaAp+S/ruaUueS4uiDlsZ7mgKfku6PnkIbmlrnlvI/orr7nva7vvIzkuI3kvJrlh7rnjrDpl67pophcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSB0aGlzLmFuaW1FbmRDQjtcclxuICAgICAgICAgICAgdGhpcy5hbmltRW5kQ0IgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0QXR0YWNoKG9wdDogSU1vZGVsQXR0YWNoT3B0KSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0LnB1c2gob3B0KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdC5tb2RlbE9wdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdC5tb2RlbE9wdC5pbnNlcnRlZENhbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0Lm1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0Lm1lc2ggPSBvcHQubW9kZWwucm9vdEltcGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBdHRhY2hPcHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBvcHQubW9kZWwgPSB0aGlzLnNjZW5lLmluc2VydE1lc2gob3B0Lm5hbWUsIG9wdC5tb2RlbE9wdCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHQubW9kZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHQubWVzaCA9IG9wdC5tb2RlbC5yb290SW1wbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0YWNoT3B0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0YWNoT3B0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0Q2hpbGRNb2RlbE9wdChvcHQ6IElNb2RlbENoaWxkT3B0KSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZE9wdExpc3QucHVzaChvcHQpO1xyXG5cclxuICAgICAgICBpZiAob3B0Lm1vZGVsT3B0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0Lm1vZGVsT3B0Lmluc2VydGVkQ2FsbCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDaGlsZE9wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3B0LnN1Y2Nlc3NDYWxsICYmIG9wdC5zdWNjZXNzQ2FsbChvcHQpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgb3B0Lm1vZGVsID0gdGhpcy5zY2VuZS5pbnNlcnRNZXNoKG9wdC5uYW1lLCBvcHQubW9kZWxPcHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm1lc2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDaGlsZE9wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBbHBoYShkYXRhOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFscGhhID0gZGF0YTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFscGhhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFBvc3Rpb24oZGF0YTogbnVtYmVyW10pIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gW2RhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl1dO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUG9zdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRTY2FsZShkYXRhOiBudW1iZXJbXSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTY2FsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRSb3RhdGUoZGF0YTogbnVtYmVyW10pIHtcclxuICAgICAgICB0aGlzLnJvdGF0ZSA9IFtkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdXTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVJvdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRMb29rQXQoZGF0YTogbnVtYmVyW10pIHtcclxuICAgICAgICB0aGlzLmxvb2tBdCA9IFtkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdXTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUxvb2tBdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRWaXNpYmxlKGRhdGE6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGRhdGE7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRFbmFibGVkKGlzRW5hYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gaXNFbmFibGVkO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkICYmIHRoaXMuaXNFbmFibGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VFbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEFuaW0oYW5pbU9wdDogSU1vZGVsQW5pbU9wdCkge1xyXG4gICAgICAgIHRoaXMuYW5pbU9wdCA9IGFuaW1PcHQ7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VBbmltKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0b3BBbmltKCkge1xyXG4gICAgICAgIGlmICh0aGlzLndvcmtXaXRoQW5pbWF0aW9uR3JvdXBDaGFuZ2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1PcHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHBhdXNlQW5pbSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltT3B0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlQWxwaGEoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWxwaGEgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmFscGhhICE9PSBudWxsICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbC5nZXRDaGlsZE1lc2hlcygpLmZvckVhY2goKG1lc2gpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChtZXNoLm1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzaC5tYXRlcmlhbC5hbHBoYSA9IHRoaXMuYWxwaGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlUG9zdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5wb3NpdE5vZGUodGhpcy5yb290SW1wbCwgdGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VTY2FsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zY2FsZSAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5zY2FsZU5vZGUodGhpcy5yb290SW1wbCwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VSb3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm90YXRlICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgTm9kZVRvb2xzLnJvdGF0ZU5vZGUodGhpcy5yb290SW1wbCwgdGhpcy5yb3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlTG9va0F0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxvb2tBdCAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5ub2RlTG9va0F0KHRoaXMucm9vdEltcGwsIHRoaXMubG9va0F0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VWaXNpYmxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbC5pc1Zpc2libGUgPSB0aGlzLmlzVmlzaWJsZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VFbmFibGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yb290SW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RJbXBsLnNldEVuYWJsZWQodGhpcy5pc0VuYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlQXR0YWNoT3B0KCkge1xyXG4gICAgICAgIGxldCB1c2VDb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IHRlbXBJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld0xpc3RMZW4gPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmF0dGFjaE9wdExpc3QpIHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdExlbiA9IHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBsZW4gPSBsaXN0TGVuIC0gMTsgbGVuID49IDA7IGxlbi0tKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSB0aGlzLmF0dGFjaE9wdExpc3RbbGVuXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvcHQubWVzaCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tlbGV0b24gPSB0aGlzLnNrZWxldG9uTWFwLmdldChvcHQuc2tlbGV0b25OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNrZWxldG9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9uZUluZGV4ID0gc2tlbGV0b24uZ2V0Qm9uZUluZGV4QnlOYW1lKG9wdC5ib25lTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChib25lSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290SW1wbCAmJiBvcHQubWVzaC5hdHRhY2hUb0JvbmUoc2tlbGV0b24uYm9uZXNbYm9uZUluZGV4XSwgdGhpcy5yb290SW1wbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHQudHJhbnNmb3JtICYmIE5vZGVUb29scy5ub2RlVHJhbnNmb3JtKG9wdC5tZXNoLCBvcHQudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0W2xlbl0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlQ291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV3TGlzdExlbiA9IGxpc3RMZW4gLSB1c2VDb3VudDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGsgPSBsaXN0TGVuIC0gdXNlQ291bnQ7IGkgPCBrOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmF0dGFjaE9wdExpc3RbdGVtcEluZGV4XSA9PT0gdW5kZWZpbmVkICYmIHRlbXBJbmRleCA8IGxpc3RMZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wSW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hPcHRMaXN0W3RlbXBJbmRleF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdFtpXSA9IHRoaXMuYXR0YWNoT3B0TGlzdFt0ZW1wSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmF0dGFjaE9wdExpc3QubGVuZ3RoID0gbmV3TGlzdExlbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZUNoaWxkT3B0KCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0LmZvckVhY2goKG9wdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAob3B0LmlzRmluaXNoZWQgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHQubW9kZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQubW9kZWwucm9vdEltcGwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdEltcGwgJiYgKG9wdC5tb2RlbC5yb290SW1wbC5wYXJlbnQgPSB0aGlzLnJvb3RJbXBsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0LnRyYW5zZm9ybSAmJiBOb2RlVG9vbHMubm9kZVRyYW5zZm9ybShvcHQubW9kZWwucm9vdEltcGwsIG9wdC50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0Lm1lc2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5pc0ZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3RJbXBsICYmIChvcHQubWVzaC5wYXJlbnQgPSB0aGlzLnJvb3RJbXBsKTtcclxuICAgICAgICAgICAgICAgICAgICBvcHQudHJhbnNmb3JtICYmIE5vZGVUb29scy5ub2RlVHJhbnNmb3JtKG9wdC5tZXNoLCBvcHQudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVBdHRhY2goKSB7XHJcbiAgICAgICAgLy9cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlQW5pbSgpIHtcclxuICAgICAgICBpZiAodGhpcy53b3JrV2l0aEFuaW1hdGlvbkdyb3VwQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFuaW1PcHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gQW5pbWF0aW9uR3JvdXBDaGFuZ2UuYW5pbUNoYW5nZVRvKHRoaXMubmFtZSwgdGhpcy5hbmltT3B0LmFuaW1OYW1lLCB0aGlzLmFuaW1hdGlvbk1hcCwgdGhpcy5hbmltYXRpb24sIHRoaXMuYW5pbU9wdCA/IHRoaXMuYW5pbU9wdC5zdGFydENhbGwgOiB1bmRlZmluZWQsIHRoaXMuYW5pbU9wdCA/IHRoaXMuYW5pbU9wdC5lbmRDYWxsIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmltT3B0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW1hdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmm7TmlLnmqKHlnovliqjnlLtcclxuICAgICAqIEBwYXJhbSBhbmltTmFtZSDnm67moIfliqjnlLvlkI3np7BcclxuICAgICAqIEBwYXJhbSBpc0xvb3Ag5piv5ZCm5b6q546v5pKt5pS+XHJcbiAgICAgKiBAcGFyYW0gc3RvcEZsYWcg5Yqo55S75YGc5q2i6YWN572uXHJcbiAgICAgKiBAcGFyYW0gZW5kQ2FsbCDliqjnlLvnu5PmnZ/lm57osINcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjaGFuZ2VBbmltYXRpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbU9wdCkge1xyXG4gICAgICAgICAgICBjb25zdCBzcGVlZCA9IHRoaXMuYW5pbU9wdC5zcGVlZCA9PT0gdW5kZWZpbmVkID8gMSA6IHRoaXMuYW5pbU9wdC5zcGVlZDtcclxuICAgICAgICAgICAgY29uc3QgYW5pbU5hbWUgPSB0aGlzLmFuaW1PcHQuYW5pbU5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZENhbGwgPSB0aGlzLmFuaW1PcHQuZW5kQ2FsbDtcclxuICAgICAgICAgICAgY29uc3QgaXNMb29wID0gdGhpcy5hbmltT3B0LmlzTG9vcDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1Hcm91cCA9IHRoaXMuYW5pbWF0aW9uTWFwLmdldChhbmltTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5pbUdyb3VwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYW5nZUFuaW1FbmFibGVCbGVuZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Hcm91cC50YXJnZXRlZEFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltLmFuaW1hdGlvbi5lbmFibGVCbGVuZGluZyAgID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbS5hbmltYXRpb24uYmxlbmRpbmdTcGVlZCAgICA9IHRoaXMuY2hhbmdlQW5pbUJsZW5kU3BlZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYW5pbUdyb3VwLmlzU3RhcnRlZCAmJiBpc0xvb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7YW5pbU5hbWV9IOWKqOeUu+W3sue7j+aJp+ihjO+8gWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Hcm91cC5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Hcm91cC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYW5pbUdyb3VwLm9uQW5pbWF0aW9uR3JvdXBFbmRPYnNlcnZhYmxlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBlbmRDYWxsICYmIGFuaW1Hcm91cC5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5hZGQoPGFueT5lbmRDYWxsKTtcclxuICAgICAgICAgICAgICAgIGFuaW1Hcm91cC5zdGFydChpc0xvb3AsIHNwZWVkKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1PcHQuZ29FbmQpIHsgICAgICAgLy8g5piv5ZCm6Lez6L2s5Yiw5Yqo55S75pyA5ZCO5LiA5binKOmdnuW+queOr+WKqOeUu+iuvue9rilcclxuICAgICAgICAgICAgICAgICAgICBhbmltR3JvdXAuZ29Ub0ZyYW1lKGFuaW1Hcm91cC50byk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7YW5pbU5hbWV9IOWKqOeUu+S4jeWtmOWcqO+8gWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzLmFuaW1FbmRDQiA9IGVuZENhbGw7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbUdyb3VwO1xyXG4gICAgICAgICAgICB0aGlzLmlzQW5pbWF0aW9uTG9vcCA9IGlzTG9vcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0b3BBbmltYXRpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uICYmIHRoaXMuY2hhbmdlQW5pbUVuYWJsZUJsZW5kaW5nICYmIHRoaXMuYW5pbWF0aW9uLmlzU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAoPGFueT50aGlzLmFuaW1hdGlvbikubG9vcEFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi50YXJnZXRlZEFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYW5pbS5hbmltYXRpb24uZW5hYmxlQmxlbmRpbmcgICA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhbmltLmFuaW1hdGlvbi5ibGVuZGluZ1NwZWVkICAgID0gdGhpcy5jaGFuZ2VBbmltQmxlbmRTcGVlZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXVzZUFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiAmJiB0aGlzLmFuaW1hdGlvbi5wYXVzZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpbml0QW5pbWF0aW9uRXZlbnRNYXAoKSB7XHJcbiAgICAgICAgLy8g5Yqo55S75LqL5Lu2XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuZm9yRWFjaCgoYWcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGFnLmFuaW1hdGFibGVzKSB7XHJcbiAgICAgICAgICAgICAgICBhZy5hbmltYXRhYmxlcy5mb3JFYWNoKGF0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gYXQuZ2V0QW5pbWF0aW9ucygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgJiYgbGlzdC5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50cyA9ICg8QkFCWUxPTi5BbmltYXRpb25FdmVudFtdPig8YW55PmEpLl9ldmVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5hbmltRXZlbnRNYXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1FdmVudE1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbUV2ZW50TWFwLnNldCgoPGFueT5ldmVudCkuX3BpX2V2ZW50S2V5LCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCIvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcmVmZXJlbmNlXHJcbi8qKlxyXG4gKiBzY2VuZVxyXG4gKi9cclxuaW1wb3J0IHsgQkFCWUxPTkxvYWRpbmcgfSBmcm9tICcuL2JhYnlsb25kb3dubG9hZCc7XHJcbmltcG9ydCB7IFNjZW5lSW5zdGFuY2UzRCB9IGZyb20gJy4vc2NlbmVfc3RydWN0JztcclxuaW1wb3J0IHsgU2NlbmVSZW5kZXJGbGFncyB9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7IEZhY3RvcnlFbmdpbmUgfSBmcm9tICcuL2Jhc2VfZmFjdG9yeSc7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6aW50ZXJmYWNlLW5hbWVcclxuaW50ZXJmYWNlIElTY2VuZU1hbmFnZXJEYXRhIHtcclxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjea0u+WKqOWcuuaZr1xyXG4gICAgICovXHJcbiAgICBtYWluc2NlbmU6IFNjZW5lSW5zdGFuY2UzRCB8IHVuZGVmaW5lZDtcclxuICAgIGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XHJcbiAgICBzY2VuZU1hcDogTWFwPHN0cmluZywgU2NlbmVJbnN0YW5jZTNEPjtcclxufVxyXG5cclxuLy8gdHlwZSBIb29rQ2FsbCA9IChmOiAoZTogUG9pbnRlckV2ZW50KSA9PiB2b2lkKSA9PiB2b2lkO1xyXG5cclxuZXhwb3J0IGNvbnN0IFNjZW5lTWFuYWdlckRhdGE6IElTY2VuZU1hbmFnZXJEYXRhID0gPGFueT57XHJcbiAgICBjYW52YXM6IHVuZGVmaW5lZCxcclxuICAgIG1haW5zY2VuZTogdW5kZWZpbmVkLFxyXG4gICAgZW5naW5lOiB1bmRlZmluZWQsXHJcbiAgICBzY2VuZU1hcDogbmV3IE1hcCgpXHJcbn07XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktY2xhc3NcclxuZXhwb3J0IGNsYXNzIFNjZW5lTWFuYWdlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGxhc3RUaW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBmcHNTdGFydFRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGN1ckZQUzogbnVtYmVyID0gMzA7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRpbWVCeVRpbWVzOiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBsaW1pdEZyYW1lOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8vIOW4p+aVsOmZkOWItlxyXG4gICAgcHVibGljIHN0YXRpYyBGUFNMaW1pdDogbnVtYmVyID0gMzA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGJlZm9yZVJlbmRlckNhbGxMaXN0OiAoKCkgPT4gdm9pZClbXSA9IFtdO1xyXG4gICAgcHVibGljIHN0YXRpYyBhZnRlclJlbmRlckNhbGxMaXN0OiAoKCkgPT4gdm9pZClbXSA9IFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJYg5riy5p+T566h55CGXHJcbiAgICAgKiBAcGFyYW0gY2Ig5riy5p+T5Yib5bu65ZCO55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBjYj86IEZ1bmN0aW9uKSB7XHJcblxyXG4gICAgICAgIC8vIGluaXRFeHRlbmRzKCk7XHJcblxyXG4gICAgICAgIFNjZW5lTWFuYWdlckRhdGEuY2FudmFzID0gY2FudmFzO1xyXG5cclxuICAgICAgICBTY2VuZU1hbmFnZXJEYXRhLmVuZ2luZSA9IEZhY3RvcnlFbmdpbmUoU2NlbmVNYW5hZ2VyRGF0YS5jYW52YXMpO1xyXG4gICAgICAgIFNjZW5lTWFuYWdlckRhdGEuZW5naW5lLmxvYWRpbmdTY3JlZW4gPSBuZXcgQkFCWUxPTkxvYWRpbmcoKTtcclxuXHJcbiAgICAgICAgY2IgJiYgY2IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnua4uOaIj+eahOWIt+aWsOeOh1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEZQUygpIHtcclxuICAgICAgICByZXR1cm4gU2NlbmVNYW5hZ2VyLmN1ckZQUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEZsdXNoVGVybSgpIHtcclxuICAgICAgICBjb25zdCBjdXJUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAvLyAg6ZmQ5Yi25bin5pWwXHJcbiAgICAgICAgaWYgKGN1clRpbWUgLSBTY2VuZU1hbmFnZXIubGFzdFRpbWUgPCAxMDAwIC8gU2NlbmVNYW5hZ2VyLkZQU0xpbWl0ICYmIFNjZW5lTWFuYWdlci5saW1pdEZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTY2VuZU1hbmFnZXIudGltZUJ5VGltZXMrKztcclxuICAgICAgICAvLyDmjqfliLbmmL7npLrnmoTluKfmlbBcclxuICAgICAgICBTY2VuZU1hbmFnZXIuZnBzU3RhcnRUaW1lID0gU2NlbmVNYW5hZ2VyLmZwc1N0YXJ0VGltZSB8fCBjdXJUaW1lO1xyXG4gICAgICAgIFNjZW5lTWFuYWdlci5sYXN0VGltZSA9IGN1clRpbWU7XHJcbiAgICAgICAgaWYgKGN1clRpbWUgLSBTY2VuZU1hbmFnZXIuZnBzU3RhcnRUaW1lID49IDEwMDApIHtcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLmN1ckZQUyA9IFNjZW5lTWFuYWdlci50aW1lQnlUaW1lcztcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnRpbWVCeVRpbWVzID0gMDtcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLmZwc1N0YXJ0VGltZSA9IGN1clRpbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLvlnLrmma/muLLmn5Plvqrnjq9cclxuICAgICAqIEDpobnnm67pgLvovpHkuI3lj6/mjqfliLZcclxuICAgICAqIEDnirbmgIHkuLrmmoLlgZzml7bkuI3muLLmn5NcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZW5kZXJMb29wID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBzY2VuZTogU2NlbmVJbnN0YW5jZTNEIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyRGF0YS5tYWluc2NlbmU7XHJcblxyXG4gICAgICAgIFNjZW5lTWFuYWdlci5iZWZvcmVSZW5kZXJDYWxsTGlzdC5mb3JFYWNoKChmKSA9PiBmKCkpO1xyXG5cclxuICAgICAgICBpZiAoc2NlbmUgJiYgc2NlbmUucmVuZGVyRmxhZyA9PT0gU2NlbmVSZW5kZXJGbGFncy5wYXVzZSkge1xyXG4gICAgICAgICAgICAvLyBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY2VuZS5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXJEYXRhLmVuZ2luZSAmJiBTY2VuZU1hbmFnZXJEYXRhLmVuZ2luZS5jbGVhcihuZXcgQkFCWUxPTi5Db2xvcjQoMCwgMCwgMCwgMCksIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTY2VuZU1hbmFnZXIuYWZ0ZXJSZW5kZXJDYWxsTGlzdC5mb3JFYWNoKChmKSA9PiBmKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65Zy65pmv5ZCO5riF55CGIGJhYnlsb27lupXlsYLkuLrlnLrmma/nu5HlrprnmoTkuovku7bnm5HlkKxcclxuICAgICAqIEBwYXJhbSBzY2VuZSDnm67moIflnLrmma9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmb3JtYXRTY2VuZVBvaW50ZXJFdmVudChzY2VuZTogU2NlbmVJbnN0YW5jZTNEKSB7XHJcbiAgICAgICAgaWYgKFNjZW5lTWFuYWdlckRhdGEuY2FudmFzKSB7XHJcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlckRhdGEuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgICg8YW55PnNjZW5lLmltcGwpLl9pbnB1dE1hbmFnZXIuX29uUG9pbnRlckRvd24pO1xyXG4gICAgICAgICAgICBTY2VuZU1hbmFnZXJEYXRhLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsICAoPGFueT5zY2VuZS5pbXBsKS5faW5wdXRNYW5hZ2VyLl9vblBvaW50ZXJNb3ZlKTtcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyRGF0YS5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgICAgKDxhbnk+c2NlbmUuaW1wbCkuX2lucHV0TWFuYWdlci5fb25Qb2ludGVyVXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4suafk+S4u+WcuuaZr+S7peWklueahOWcuuaZr1xyXG4gICAgICogQOeKtuaAgeS4uuaaguWBnOaXtuS4jea4suafk1xyXG4gICAgICogQOmhueebrumAu+i+keaOp+WItuS9leaXtua4suafk1xyXG4gICAgICogQHBhcmFtIHNjZW5lTmFtZSDlnLrmma/lkI3np7BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZW5kZXJPdGhlclNjZW5lKHNjZW5lTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCFTY2VuZU1hbmFnZXJEYXRhLm1haW5zY2VuZSB8fCBzY2VuZU5hbWUgIT09IFNjZW5lTWFuYWdlckRhdGEubWFpbnNjZW5lLm5hbWUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NlbmUgPSBTY2VuZU1hbmFnZXJEYXRhLnNjZW5lTWFwLmdldChzY2VuZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICBzY2VuZS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uiDkuIDkuKog5Zy65pmv5pWw5o2u77yMIOW5tuiusOW9leWcqOeuoeeQhuWZqOS4rVxyXG4gICAgICogQHBhcmFtIHNjZW5lTmFtZSDlnLrmma/lkI3np7BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVTY2VuZShzY2VuZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBzY2VuZVN0cnVjdDogU2NlbmVJbnN0YW5jZTNEO1xyXG4gICAgICAgIGNvbnN0IHRlbXAgPSBTY2VuZU1hbmFnZXJEYXRhLnNjZW5lTWFwLmdldChzY2VuZU5hbWUpO1xyXG4gICAgICAgIGlmICh0ZW1wKSB7XHJcbiAgICAgICAgICAgIHNjZW5lU3RydWN0ID0gdGVtcDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzY2VuZVN0cnVjdCA9IG5ldyBTY2VuZUluc3RhbmNlM0Qoc2NlbmVOYW1lLCBTY2VuZU1hbmFnZXJEYXRhLmVuZ2luZSk7XHJcbiAgICAgICAgICAgIHNjZW5lU3RydWN0LmltcGwgJiYgKHNjZW5lU3RydWN0LmltcGwudXNlQ29uc3RhbnRBbmltYXRpb25EZWx0YVRpbWUgPSBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBCQUJZTE9OLlNjZW5lLk1pbkRlbHRhVGltZSA9IDUwO1xyXG4gICAgICAgICAgICBCQUJZTE9OLlNjZW5lLk1heERlbHRhVGltZSA9IDIwMDtcclxuXHJcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5yZWNvcmRTY2VuZShzY2VuZVN0cnVjdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2NlbmVTdHJ1Y3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7kuLvlnLrmma9cclxuICAgICAqIEBwYXJhbSBzY2VuZSDnm67moIflnLrmma9cclxuICAgICAqIEBwYXJhbSBzY2VuZU5hbWUg55uu5qCH5Zy65pmv5ZCN56ew77yM5aaC5p6c5oyH5a6a5YiZ5b+955Wl56ys5LiA5Liq5Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0TWFpblNjZW5lKHNjZW5lOiBTY2VuZUluc3RhbmNlM0QgfCB1bmRlZmluZWQsIHNjZW5lTmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIGlmIChzY2VuZU5hbWUpIHtcclxuICAgICAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXJEYXRhLnNjZW5lTWFwLmdldChzY2VuZU5hbWUpO1xyXG4gICAgICAgICAgICBTY2VuZU1hbmFnZXJEYXRhLm1haW5zY2VuZSA9IHNjZW5lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlckRhdGEubWFpbnNjZW5lID0gc2NlbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6w5b2V5Yia5Yib5bu655qE55uu5qCH5Zy65pmvXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVTdHJ1Y3Qg55uu5qCH5Zy65pmvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVjb3JkU2NlbmUoc2NlbmVTdHJ1Y3Q6IFNjZW5lSW5zdGFuY2UzRCkge1xyXG4gICAgICAgIGlmICghIXNjZW5lU3RydWN0Lm5hbWUpIHtcclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyRGF0YS5zY2VuZU1hcC5zZXQoc2NlbmVTdHJ1Y3QubmFtZSwgc2NlbmVTdHJ1Y3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEJhYnlsb25Mb2dUb29sLndhcm4oYFNjZW5lU3RydWN0IE5hbWU6ICR7c2NlbmVTdHJ1Y3QubmFtZX0g5peg5pWI77yBYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYmVmb3JlU2NlbmVEZXN0cm95KCkge1xyXG4gICAgICAgIC8vIEJhYnlsb25Mb2dUb29sLmxvZygnZGVzdG9yeSBob29rJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4HmjIflrprlkI3np7DnmoTlnLrmma9cclxuICAgICAqIEBwYXJhbSBzY2VuZU5hbWUg5Zy65pmv5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcG9zZVNjZW5lKHNjZW5lTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmVTdHJ1Y3QgPSBTY2VuZU1hbmFnZXJEYXRhLnNjZW5lTWFwLmdldChzY2VuZU5hbWUpO1xyXG4gICAgICAgIGlmIChzY2VuZVN0cnVjdCkge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmVTdHJ1Y3QgPT09IFNjZW5lTWFuYWdlckRhdGEubWFpbnNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXJEYXRhLm1haW5zY2VuZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2NlbmVTdHJ1Y3QuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTY2VuZU1hbmFnZXJEYXRhLnNjZW5lTWFwLmRlbGV0ZShzY2VuZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRkJPKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpIHtcclxuICAgICAgICBjb25zdCBmYm8gPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGNvbnN0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXgpO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgMiwgMiwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmYm8pO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4LCAwKTtcclxuXHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZibztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyQmVmb3JlUmVuZGVyQ2FsbChmOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYmVmb3JlUmVuZGVyQ2FsbExpc3QuaW5kZXhPZihmKSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5iZWZvcmVSZW5kZXJDYWxsTGlzdC5wdXNoKGYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdW5yZWdpc3RlckJlZm9yZVJlbmRlckNhbGwoZjogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5iZWZvcmVSZW5kZXJDYWxsTGlzdC5pbmRleE9mKGYpO1xyXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlUmVuZGVyQ2FsbExpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyQWZ0ZXJSZW5kZXJDYWxsKGY6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5hZnRlclJlbmRlckNhbGxMaXN0LmluZGV4T2YoZikgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsTGlzdC5wdXNoKGYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdW5yZWdpc3RlckFmdGVyUmVuZGVyQ2FsbChmOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmFmdGVyUmVuZGVyQ2FsbExpc3QuaW5kZXhPZihmKTtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbExpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTY2VuZVN0cnVjdEJhc2UgfSBmcm9tIFwiLi9zY2VuZV9zdHJ1Y3RfYmFzZVwiO1xyXG5pbXBvcnQgeyBTY2VuZTNERXZlbnRJbmZvLCBTY2VuZVJlbmRlckZsYWdzLCBJTW9kZWxPcHQgfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7IEFwcGVuZE1vZGVsT2JqLCBJbnNlcnRNb2RlbE9iaiB9IGZyb20gXCIuL21vZGVsX29ialwiO1xyXG5pbXBvcnQgeyBGYWN0b3J5U2NlbmUzRCB9IGZyb20gXCIuL2Jhc2VfZmFjdG9yeVwiO1xyXG5cclxuLyoqXHJcbiAqIOmhueebruW6lOeUqOWxgueahOWcuuaZr+aVsOaNrue7k+aehFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNjZW5lSW5zdGFuY2UzRCBleHRlbmRzIFNjZW5lU3RydWN0QmFzZSB7XHJcbiAgICBwdWJsaWMgdmlld3BvcnRYOiBudW1iZXIgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlnLrmma/lhoXmuLLmn5PlhYnooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGxpZ2h0TWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkxpZ2h0PiA9IG5ldyBNYXAoKTtcclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5YaFIOWcuuaZr+eOr+Wig+e6p+WIq+iKgueCueihqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXBwZW5kTWVzaE1hcDogTWFwPHN0cmluZywgQXBwZW5kTW9kZWxPYmo+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJEb3duTGlzdGVuTWFwOiBNYXA8RnVuY3Rpb24sIChpbmZvOiBTY2VuZTNERXZlbnRJbmZvKSA9PiBhbnk+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJNb3ZlTGlzdGVuTWFwOiBNYXA8RnVuY3Rpb24sIChpbmZvOiBTY2VuZTNERXZlbnRJbmZvKSA9PiBhbnk+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJVcExpc3Rlbk1hcDogTWFwPEZ1bmN0aW9uLCAoaW5mbzogU2NlbmUzREV2ZW50SW5mbykgPT4gYW55PiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwb2ludGVyQ2xpY2tMaXN0ZW5NYXA6IE1hcDxGdW5jdGlvbiwgKGluZm86IFNjZW5lM0RFdmVudEluZm8pID0+IGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVOYW1lIOWcuuaZr+WRveWQjVxyXG4gICAgICogQHBhcmFtIGVuZ2luZSDlvJXmk45cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Ioc2NlbmVOYW1lOiBzdHJpbmcsIGVuZ2luZTogQkFCWUxPTi5FbmdpbmUpIHtcclxuICAgICAgICBzdXBlcihzY2VuZU5hbWUsIGVuZ2luZSk7XHJcbiAgICAgICAgdGhpcy5vblBvaW50ZXJEb3duID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAoPGFueT50aGlzLmltcGwpLl9pbnB1dE1hbmFnZXIuX29uUG9pbnRlckRvd24oZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uUG9pbnRlck1vdmUgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuaW1wbCkuX2lucHV0TWFuYWdlci5fb25Qb2ludGVyTW92ZShlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25Qb2ludGVyVXAgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuaW1wbCkuX2lucHV0TWFuYWdlci5fb25Qb2ludGVyVXAoZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uUG9pbnRlckNsaWNrID0gKGU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXlJbmZvID0gdGhpcy5pbXBsLnBpY2soZS54LCBlLnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyQ2xpY2tMaXN0ZW5NYXAuZm9yRWFjaCgoZnVuYykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoeyByYXlJbmZvLCBlLCBzOiB1bmRlZmluZWQgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZShlbmdpbmU6IEJBQllMT04uRW5naW5lKSB7XHJcbiAgICAgICAgY29uc3QgaW1wbCA9IEZhY3RvcnlTY2VuZTNEKGVuZ2luZSk7XHJcbiAgICAgICAgaW1wbC5yZW5kZXJUYXJnZXRzRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIHJldHVybiBpbXBsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXlnLrmma/mqKHlnotcclxuICAgICAqIEBwYXJhbSBvYmpOYW1lIOaooeWei+WRveWQjVxyXG4gICAgICogKiDnlKjkuo7pobnnm67lsYLnrqHnkIZcclxuICAgICAqIEBwYXJhbSBvcHQg5qih5Z6L5Yqg6L296YWN572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbXBvcnRTY2VuZShvYmpOYW1lOiBzdHJpbmcsIG9wdDogSU1vZGVsT3B0ID0ge30pIHtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IG5ldyBBcHBlbmRNb2RlbE9iaihvYmpOYW1lLCB0aGlzLCBvcHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGVuZE1lc2hNYXAuc2V0KG9iak5hbWUsIG1vZGVsKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5o+S5YWl5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gb2JqTmFtZSDmqKHlnovlkb3lkI1cclxuICAgICAqICog55So5LqO6aG555uu5bGC566h55CGXHJcbiAgICAgKiBAcGFyYW0gb3B0IOaooeWei+WKoOi9vemFjee9rlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5zZXJ0TWVzaChvYmpOYW1lOiBzdHJpbmcsIG9wdDogSU1vZGVsT3B0ID0ge30pIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktbG9jYWwtdmFyaWFibGVcclxuICAgICAgICBjb25zdCBtb2RlbCA9IG5ldyBJbnNlcnRNb2RlbE9iaihvYmpOYW1lLCB0aGlzLCBvcHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHtcclxuICAgICAgICB0aGlzLmNhbWVyYSAmJiB0aGlzLmRpc3Bvc2VPYnNlcnZlcih0aGlzLmNhbWVyYSk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRNZXNoTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5pbXBsICYmIHRoaXMuaW1wbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJGbGFnID0gU2NlbmVSZW5kZXJGbGFncy5kaXNwb3NlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlgZzmraLmiYDmnInliqjnlLtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0b3BBbmltKCkge1xyXG4gICAgICAgIHRoaXMuaW1wbCAmJiB0aGlzLmltcGwuc3RvcEFsbEFuaW1hdGlvbnMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGREb3duTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogU2NlbmUzREV2ZW50SW5mbykgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93bkxpc3Rlbk1hcC5zZXQobGlzdGVuZXIsIGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVEb3duTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogU2NlbmUzREV2ZW50SW5mbykgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93bkxpc3Rlbk1hcC5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFVwTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogU2NlbmUzREV2ZW50SW5mbykgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyVXBMaXN0ZW5NYXAuc2V0KGxpc3RlbmVyLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlVXBMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBTY2VuZTNERXZlbnRJbmZvKSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJVcExpc3Rlbk1hcC5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZE1vdmVMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBTY2VuZTNERXZlbnRJbmZvKSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuTWFwLnNldChsaXN0ZW5lciwgbGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZU1vdmVMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBTY2VuZTNERXZlbnRJbmZvKSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuTWFwLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkQ2xpY2tMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBTY2VuZTNERXZlbnRJbmZvKSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJDbGlja0xpc3Rlbk1hcC5zZXQobGlzdGVuZXIsIGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVDbGlja0xpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IFNjZW5lM0RFdmVudEluZm8pID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckNsaWNrTGlzdGVuTWFwLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IFNjZW5lUmVuZGVyRmxhZ3MgfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7IEZhY3RvcnlTY2VuZUdVSSB9IGZyb20gXCIuL2Jhc2VfZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lU3RydWN0QmFzZSB7XHJcbiAgICBwdWJsaWMgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+WQjeensFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlupXlsYLlnLrmma/lr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGltcGw6IEJBQllMT04uU2NlbmU7XHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+a4suafk+eKtuaAgVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVuZGVyRmxhZzogc3RyaW5nID0gU2NlbmVSZW5kZXJGbGFncy5wYXVzZTtcclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5b2T5YmN5rS75Yqo55u45py6XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjYW1lcmE6IEJBQllMT04uQ2FtZXJhIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlnLrmma/lhoXnm7jmnLrooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbWVyYU1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5DYW1lcmE+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIGJlZm9yZVJlbmRlckNhbGxMaXN0OiAoKHNjZW5lOiBTY2VuZVN0cnVjdEJhc2UpID0+IHZvaWQpW10gPSBbXTtcclxuICAgIHB1YmxpYyBhZnRlclJlbmRlckNhbGxMaXN0OiAoKHNjZW5lOiBTY2VuZVN0cnVjdEJhc2UpID0+IHZvaWQpW10gPSBbXTtcclxuICAgIHB1YmxpYyBvblBvaW50ZXJVcDogKChlOiBQb2ludGVyRXZlbnQpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIG9uUG9pbnRlckNsaWNrOiAoKGU6IFBvaW50ZXJFdmVudCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgb25Qb2ludGVyTW92ZTogKChlOiBQb2ludGVyRXZlbnQpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIG9uUG9pbnRlckRvd246ICgoZTogUG9pbnRlckV2ZW50KSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzY2VuZU5hbWUg5Zy65pmv5ZG95ZCNXHJcbiAgICAgKiBAcGFyYW0gZW5naW5lIOW8leaTjlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihzY2VuZU5hbWU6IHN0cmluZywgZW5naW5lOiBCQUJZTE9OLkVuZ2luZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHNjZW5lTmFtZTtcclxuICAgICAgICB0aGlzLmVuZ2luZSA9IDxCQUJZTE9OLkVuZ2luZT5lbmdpbmU7XHJcbiAgICAgICAgdGhpcy5pbXBsID0gdGhpcy5jcmVhdGUoZW5naW5lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcmVhdGUoZW5naW5lOiBCQUJZTE9OLkVuZ2luZSkge1xyXG4gICAgICAgIHJldHVybiBGYWN0b3J5U2NlbmVHVUkoZW5naW5lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyRmxhZyA9PT0gU2NlbmVSZW5kZXJGbGFncy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCA9IDxhbnk+dGhpcy5pbXBsLmdldEVuZ2luZSgpLl9nbDtcclxuICAgICAgICAgICAgICAgIGdsLmRpc2FibGUoZ2wuU0NJU1NPUl9URVNUKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmVmb3JlUmVuZGVyQ2FsbExpc3QuZm9yRWFjaCgoZikgPT4gZih0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltcGwucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltcGwuZ2V0RW5naW5lKCkud2lwZUNhY2hlcyh0cnVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsTGlzdC5mb3JFYWNoKChmKSA9PiBmKHRoaXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBhY3RpdmVPYnNlcnZlciA9IChjYW1lcmE6IEJBQllMT04uQ2FtZXJhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBTY2VuZSAke3RoaXMubmFtZX0gYWN0aXZlIWApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGRpc3Bvc2VPYnNlcnZlciA9IChjYW1lcmE6IEJBQllMT04uQ2FtZXJhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBTY2VuZSAke3RoaXMubmFtZX0gZGlzcG9zZSFgKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGFuZ2VDYW1lcmFPYnNlcnZlciA9IChjYW1lcmE6IEJBQllMT04uQ2FtZXJhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFNjZW5lICR7dGhpcy5uYW1lfSBjYW1lcmEgY2hhbmdlIWApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZUNhbWVyYU9ic2VydmVyID0gKGNhbWVyYTogQkFCWUxPTi5DYW1lcmEpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgU2NlbmUgJHt0aGlzLm5hbWV9IGNhbWVyYSBjaGFuZ2UhYCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruW9k+WJjea0u+WKqOebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYU5hbWUg55uu5qCH55u45py65ZCN56ewXHJcbiAgICAgKiAqIOWcqOWcuuaZr+WGhemDqOebuOacuuihqOS4reafpeaJvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Q3VyckNhbWVyYShjYW1lcmFOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNhbWVyYU1hcC5nZXQoY2FtZXJhTmFtZSk7XHJcbiAgICAgICAgaWYgKCEhY2FtZXJhICYmIHRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLmFjdGl2ZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VDYW1lcmFPYnNlcnZlcih0aGlzLmNhbWVyYSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTY2VuZVN0cnVjdC5zZXRDdXJyQ2FtZXJh77ya55uu5qCH5Zy65pmv5rKh5pyJTmFtZeS4uiR7Y2FtZXJhTmFtZX3nmoTnm7jmnLpgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgeebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYU5hbWUg55uu5qCH55u45py65ZCN56ewXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVDYW1lcmEoY2FtZXJhTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdGhpcy5jYW1lcmFNYXAuZ2V0KGNhbWVyYU5hbWUpO1xyXG4gICAgICAgIGlmIChjYW1lcmEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYW1lcmEgPT09IGNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDYW1lcmFPYnNlcnZlcih0aGlzLmNhbWVyYSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFNjZW5lUmVuZGVyRmxhZ3MucGF1c2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYW1lcmFNYXAuZGVsZXRlKGNhbWVyYU5hbWUpO1xyXG4gICAgICAgICAgICBjYW1lcmEuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg55u45py6XHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIOebruagh+ebuOacuuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ2FtZXJhKGNhbWVyYTogQkFCWUxPTi5DYW1lcmEpIHtcclxuICAgICAgICB0aGlzLmNhbWVyYU1hcC5zZXQoY2FtZXJhLm5hbWUsIGNhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpY2tDYWxsID0gKGU6IEJBQllMT04uUG9pbnRlckluZm8sIHM6IEJBQllMT04uRXZlbnRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIC8vIOeUseWtkOexu+WunueOsFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4FcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEgJiYgdGhpcy5kaXNwb3NlT2JzZXJ2ZXIodGhpcy5jYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuaW1wbCAmJiB0aGlzLmltcGwuZGlzcG9zZSgpO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFNjZW5lUmVuZGVyRmxhZ3MuZGlzcG9zZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5pqC5YGc5riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnJlbmRlckZsYWcgPSBTY2VuZVJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgICAgIHRoaXMuaW1wbCAmJiB0aGlzLmltcGwub25Qb2ludGVyT2JzZXJ2YWJsZS5yZW1vdmVDYWxsYmFjayh0aGlzLnBpY2tDYWxsKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS75riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FtZXJhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyRmxhZyAhPT0gU2NlbmVSZW5kZXJGbGFncy5kaXNwb3NlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbXBsICYmICF0aGlzLmltcGwub25Qb2ludGVyT2JzZXJ2YWJsZS5oYXNPYnNlcnZlcnMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1wbC5vblBvaW50ZXJPYnNlcnZhYmxlLmFkZCh0aGlzLnBpY2tDYWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFNjZW5lUmVuZGVyRmxhZ3MuYWN0aXZlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVPYnNlcnZlcih0aGlzLmNhbWVyYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyQmVmb3JlUmVuZGVyQ2FsbChmOiAoc2NlbmU6IFNjZW5lU3RydWN0QmFzZSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmJlZm9yZVJlbmRlckNhbGxMaXN0LmluZGV4T2YoZikgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlUmVuZGVyQ2FsbExpc3QucHVzaChmKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdW5yZWdpc3RlckJlZm9yZVJlbmRlckNhbGwoZjogKHNjZW5lOiBTY2VuZVN0cnVjdEJhc2UpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYmVmb3JlUmVuZGVyQ2FsbExpc3QuaW5kZXhPZihmKTtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmJlZm9yZVJlbmRlckNhbGxMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckFmdGVyUmVuZGVyQ2FsbChmOiAoc2NlbmU6IFNjZW5lU3RydWN0QmFzZSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFmdGVyUmVuZGVyQ2FsbExpc3QuaW5kZXhPZihmKSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5hZnRlclJlbmRlckNhbGxMaXN0LnB1c2goZik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHVucmVnaXN0ZXJBZnRlclJlbmRlckNhbGwoZjogKHNjZW5lOiBTY2VuZVN0cnVjdEJhc2UpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYWZ0ZXJSZW5kZXJDYWxsTGlzdC5pbmRleE9mKGYpO1xyXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qKlxyXG4gKlxyXG4gKi9cclxuaW1wb3J0IHsgSVRyYW5zZm9ybUNmZywgSVRyYW5zZm9ybU9iaiB9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7IEFwcGVuZE1vZGVsT2JqLCBJbnNlcnRNb2RlbE9iaiB9IGZyb20gJy4vbW9kZWxfb2JqJztcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bm5lY2Vzc2FyeS1jbGFzc1xyXG5leHBvcnQgY2xhc3MgTm9kZVRvb2xzIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2NlbmVBc1JpZ2h0SGFuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDml4vovawgTWVzaCAtIOiHqui9rFxyXG4gICAgICogQHBhcmFtIG1lc2gg55uu5qCHbWVzaFxyXG4gICAgICogQHBhcmFtIHJvdGF0ZSDml4vovazlj4LmlbDvvJogWyB4LCB5LCB6IF1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVOb2RlKG5vZGU6IElUcmFuc2Zvcm1PYmosIHJvdGF0ZTogbnVtYmVyW10pIHtcclxuICAgICAgICAvLyBpZiAoIW5vZGUucm90YXRpb25RdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgLy8gICAgIG5vZGUucm90YXRpb25RdWF0ZXJuaW9uID0gbmV3IEJBQllMT04uUXVhdGVybmlvbigpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gTm9kZVRvb2xzLnJvdGF0ZVF1YXRlcm5pb24obm9kZS5yb3RhdGlvblF1YXRlcm5pb24sIHJvdGF0ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOaXi+i9rCBNZXNoIC0g6Ieq6L2sXHJcbiAgICAgKiBAcGFyYW0gcXVhdGVybmlvbiDnm67moIcgUXVhdGVybmlvblxyXG4gICAgICogQHBhcmFtIHJvdGF0ZSDml4vovazlj4LmlbDvvJogWyB4LCB5LCB6IF1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVRdWF0ZXJuaW9uKHF1YXRlcm5pb246IEJBQllMT04uUXVhdGVybmlvbiwgcm90YXRlOiBudW1iZXJbXSkge1xyXG4gICAgICAgIC8vIFlYWlxyXG4gICAgICAgIGlmIChOb2RlVG9vbHMuc2NlbmVBc1JpZ2h0SGFuZCkge1xyXG4gICAgICAgICAgICBCQUJZTE9OLlF1YXRlcm5pb24uUm90YXRpb25ZYXdQaXRjaFJvbGxUb1JlZihyb3RhdGVbMV0gLSBNYXRoLlBJLCByb3RhdGVbMF0sIC1yb3RhdGVbMl0sIHF1YXRlcm5pb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIEJBQllMT04uUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbFRvUmVmKHJvdGF0ZVsxXSwgcm90YXRlWzBdLCByb3RhdGVbMl0sIHF1YXRlcm5pb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9zaXROb2RlKG5vZGU6IElUcmFuc2Zvcm1PYmosIGRhdGE6IG51bWJlcltdKSB7XHJcbiAgICAgICAgaWYgKE5vZGVUb29scy5zY2VuZUFzUmlnaHRIYW5kKSB7XHJcbiAgICAgICAgICAgIG5vZGUucG9zaXRpb24uc2V0KC1kYXRhWzBdLCBkYXRhWzFdLCAtZGF0YVsyXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5wb3NpdGlvbi5zZXQoZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZU5vZGUobm9kZTogSVRyYW5zZm9ybU9iaiwgZGF0YTogbnVtYmVyW10pIHtcclxuICAgICAgICBpZiAoTm9kZVRvb2xzLnNjZW5lQXNSaWdodEhhbmQpIHtcclxuICAgICAgICAgICAgbm9kZS5zY2FsaW5nID0gbmV3IEJBQllMT04uVmVjdG9yMyhkYXRhWzBdLCBkYXRhWzFdLCAtZGF0YVsyXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5zY2FsaW5nID0gbmV3IEJBQllMT04uVmVjdG9yMyhkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIG5vZGVMb29rQXQobm9kZTogQkFCWUxPTi5UcmFuc2Zvcm1Ob2RlLCBkYXRhOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGlmIChOb2RlVG9vbHMuc2NlbmVBc1JpZ2h0SGFuZCkge1xyXG4gICAgICAgICAgICBub2RlLmxvb2tBdChuZXcgQkFCWUxPTi5WZWN0b3IzKGRhdGFbMF0sIGRhdGFbMV0sIC1kYXRhWzJdKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5sb29rQXQobmV3IEJBQllMT04uVmVjdG9yMyhkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBub2RlVHJhbnNmb3JtKG5vZGU6IEJBQllMT04uVHJhbnNmb3JtTm9kZSwgdHJhbnNmb3JtOiBJVHJhbnNmb3JtQ2ZnKSB7XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0ucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIE5vZGVUb29scy5wb3NpdE5vZGUobm9kZSwgdHJhbnNmb3JtLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtLnNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBOb2RlVG9vbHMuc2NhbGVOb2RlKG5vZGUsIHRyYW5zZm9ybS5zY2FsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIE5vZGVUb29scy5yb3RhdGVOb2RlKG5vZGUsIHRyYW5zZm9ybS5yb3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktY2xhc3NcclxuZXhwb3J0IGNsYXNzIENhbWVyYVRvb2wge1xyXG4gICAgLyoqXHJcbiAgICAgKiDkv67mlLkg5q2j5Lqk55u45py66KeG6KeSXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSDmraPkuqTnm7jmnLrop4bop5LlpKflsI9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjaGFuZ2VDYW1lcmFPcnRoKGNhbWVyYTogQkFCWUxPTi5GcmVlQ2FtZXJhLCBzaXplOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBzaXplRm9yV2lkdGg6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IHlEaXN0YW5jZSA9IHNpemVGb3JXaWR0aCA/IE1hdGgucm91bmQoc2l6ZSAvIHdpZHRoIC8gaGVpZ2h0ICogMTAwKSAvIDEwMCA6IHNpemU7XHJcbiAgICAgICAgY29uc3QgeERpc3RhbmNlID0gc2l6ZUZvcldpZHRoID8gc2l6ZSA6IE1hdGgucm91bmQoc2l6ZSAqIHdpZHRoIC8gaGVpZ2h0ICogMTAwKSAvIDEwMDtcclxuICAgICAgICBjYW1lcmEub3J0aG9MZWZ0ID0gLXhEaXN0YW5jZTtcclxuICAgICAgICBjYW1lcmEub3J0aG9SaWdodCA9IHhEaXN0YW5jZTtcclxuICAgICAgICBjYW1lcmEub3J0aG9Ub3AgPSB5RGlzdGFuY2U7XHJcbiAgICAgICAgY2FtZXJhLm9ydGhvQm90dG9tID0gLXlEaXN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEFjY3VyYXRlU2l6ZSh4RGlzdGFuY2U6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4geERpc3RhbmNlIC8gKHcgLyBoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVubmVjZXNzYXJ5LWNsYXNzXHJcbmV4cG9ydCBuYW1lc3BhY2UgTG9hZGVyVG9vbCB7XHJcbiAgICBsZXQgX1Jlc1BhdGggICAgICAgID0gJyc7XHJcbiAgICBsZXQgX1NjZW5lUmVzUGF0aCAgID0gJyc7XHJcbiAgICBsZXQgX01vZGVsUmVzUGF0aCAgID0gJyc7XHJcbiAgICBsZXQgX05vZGVSZXNQYXRoICAgID0gJyc7XHJcbiAgICBsZXQgX0VmZmVjdFJlc1BhdGggID0gJyc7XHJcblxyXG4gICAgZXhwb3J0IGxldCBnZXRSZXNQYXRoID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBfUmVzUGF0aDtcclxuICAgIH1cclxuICAgIGV4cG9ydCBsZXQgZ2V0U2NlbmVSZXNQYXRoID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBfU2NlbmVSZXNQYXRoO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGxldCBnZXRNb2RlbFJlc1BhdGggPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIF9Nb2RlbFJlc1BhdGg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgbGV0IGdldE5vZGVSZXNQYXRoID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBfTm9kZVJlc1BhdGg7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgbGV0IGdldEVmZmVjdFJlc1BhdGggPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIF9FZmZlY3RSZXNQYXRoO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG1vZGVsIOebruagh+aooeWei1xyXG4gICAgICogQHBhcmFtIHRhcmdldFBhdGgg5aaC5p6c6LWL5YC8KOWujOaVtOi3r+W+hCnlsIblv73nlaUgbW9kZWwg6YWN572u55qE6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0RmlsZSDlpoLmnpzotYvlgLwo5a6M5pW06Lev5b6EKeWwhuW/veeVpSBtb2RlbCDphY3nva7nmoTot6/lvoRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGxvYWRTY2VuZShtb2RlbDogQXBwZW5kTW9kZWxPYmosIHRhcmdldFBhdGg/OiBzdHJpbmcsIHRhcmdldEZpbGU/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIW1vZGVsLnNjZW5lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5pbXBsO1xyXG5cclxuICAgICAgICB0YXJnZXRQYXRoID0gdGFyZ2V0UGF0aCA/IHRhcmdldFBhdGggOiBgJHtnZXRSZXNQYXRoKCl9JHtnZXRTY2VuZVJlc1BhdGgoKX0ke3BhdGh9YDtcclxuICAgICAgICB0YXJnZXRGaWxlID0gdGFyZ2V0RmlsZSA/IHRhcmdldEZpbGUgOiBgJHtmaWxlTmFtZX0uZ2x0ZmA7XHJcblxyXG4gICAgICAgIHJldHVybiBCQUJZTE9OLlNjZW5lTG9hZGVyLkFwcGVuZCh0YXJnZXRQYXRoLCB0YXJnZXRGaWxlLCBzY2VuZUltcGwsIG1vZGVsLmFwcGVuZWQsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG1vZGVsIOebruagh+aooeWei1xyXG4gICAgICogQHBhcmFtIHRhcmdldFBhdGgg5aaC5p6c6LWL5YC8KOWujOaVtOi3r+W+hCnlsIblv73nlaUgbW9kZWwg6YWN572u55qE6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0RmlsZSDlpoLmnpzotYvlgLwo5a6M5pW06Lev5b6EKeWwhuW/veeVpSBtb2RlbCDphY3nva7nmoTot6/lvoRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGxvYWRTY2VuZUFzeW5jKG1vZGVsOiBBcHBlbmRNb2RlbE9iaiwgdGFyZ2V0UGF0aD86IHN0cmluZywgdGFyZ2V0RmlsZT86IHN0cmluZykge1xyXG4gICAgICAgIGlmICghbW9kZWwuc2NlbmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwibG9hZFNjZW5lQXN5bmMgRXJyb3I6IG5vdCBnZXQgc2NlbmVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5pbXBsO1xyXG5cclxuICAgICAgICB0YXJnZXRQYXRoID0gdGFyZ2V0UGF0aCA/IHRhcmdldFBhdGggOiBgJHtnZXRSZXNQYXRoKCl9JHtnZXRTY2VuZVJlc1BhdGgoKX0ke3BhdGh9YDtcclxuICAgICAgICB0YXJnZXRGaWxlID0gdGFyZ2V0RmlsZSA/IHRhcmdldEZpbGUgOiBgJHtmaWxlTmFtZX0uZ2x0ZmA7XHJcblxyXG4gICAgICAgIHJldHVybiBCQUJZTE9OLlNjZW5lTG9hZGVyLkFwcGVuZEFzeW5jKHRhcmdldFBhdGgsIHRhcmdldEZpbGUsIHNjZW5lSW1wbCwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgIChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbC5hcHBlbmVkKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwg55uu5qCH5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0UGF0aCDlpoLmnpzotYvlgLwo5a6M5pW06Lev5b6EKeWwhuW/veeVpSBtb2RlbCDphY3nva7nmoTot6/lvoRcclxuICAgICAqIEBwYXJhbSB0YXJnZXRGaWxlIOWmguaenOi1i+WAvCjlrozmlbTot6/lvoQp5bCG5b+955WlIG1vZGVsIOmFjee9rueahOi3r+W+hFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5zZXJ0TWVzaChtb2RlbDogSW5zZXJ0TW9kZWxPYmosIHRhcmdldFBhdGg/OiBzdHJpbmcsIHRhcmdldEZpbGU/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIW1vZGVsLnNjZW5lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5pbXBsO1xyXG5cclxuICAgICAgICB0YXJnZXRQYXRoID0gdGFyZ2V0UGF0aCA/IHRhcmdldFBhdGggOiBgJHtnZXRSZXNQYXRoKCl9JHtnZXRNb2RlbFJlc1BhdGgoKX0ke3BhdGh9YDtcclxuICAgICAgICB0YXJnZXRGaWxlID0gdGFyZ2V0RmlsZSA/IHRhcmdldEZpbGUgOiBgJHtmaWxlTmFtZX0uZ2x0ZmA7XHJcblxyXG4gICAgICAgIC8vIHJldHVybiBCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2gobW9kZWxOYW1lLCB0YXJnZXRQYXRoLCB0YXJnZXRGaWxlLCBzY2VuZUltcGwsIG1vZGVsLmxvYWRlZCwgKGUpID0+IHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgLy8gfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgaW1hZ2VTb2x0czogbW9kZWwuaW1hZ2VTb2x0cywgbWF0ZXJpYWxTb2x0czogbW9kZWwubWF0ZXJpYWxTb2x0cyB9KTtcclxuICAgICAgICByZXR1cm4gQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKG1vZGVsTmFtZSwgdGFyZ2V0UGF0aCwgdGFyZ2V0RmlsZSwgc2NlbmVJbXBsLCBtb2RlbC5sb2FkZWQsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwg55uu5qCH5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0UGF0aCDlpoLmnpzotYvlgLwo5a6M5pW06Lev5b6EKeWwhuW/veeVpSBtb2RlbCDphY3nva7nmoTot6/lvoRcclxuICAgICAqIEBwYXJhbSB0YXJnZXRGaWxlIOWmguaenOi1i+WAvCjlrozmlbTot6/lvoQp5bCG5b+955WlIG1vZGVsIOmFjee9rueahOi3r+W+hFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5zZXJ0TWVzaEFzeW5jKG1vZGVsOiBJbnNlcnRNb2RlbE9iaiwgdGFyZ2V0UGF0aD86IHN0cmluZywgdGFyZ2V0RmlsZT86IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBtb2RlbC5wYXRoO1xyXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gbW9kZWwuZmlsZU5hbWU7XHJcbiAgICAgICAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lO1xyXG4gICAgICAgIGNvbnN0IHNjZW5lSW1wbCA9IG1vZGVsLnNjZW5lLmltcGw7XHJcblxyXG4gICAgICAgIHRhcmdldFBhdGggPSB0YXJnZXRQYXRoID8gdGFyZ2V0UGF0aCA6IGAke2dldFJlc1BhdGgoKX0ke2dldE1vZGVsUmVzUGF0aCgpfSR7cGF0aH1gO1xyXG4gICAgICAgIHRhcmdldEZpbGUgPSB0YXJnZXRGaWxlID8gdGFyZ2V0RmlsZSA6IGAke2ZpbGVOYW1lfS5nbHRmYDtcclxuXHJcbiAgICAgICAgLy8gcmV0dXJuIEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaEFzeW5jKG1vZGVsTmFtZSwgdGFyZ2V0UGF0aCwgdGFyZ2V0RmlsZSwgc2NlbmVJbXBsLCAoZSkgPT4ge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAvLyB9LCB1bmRlZmluZWQsIHsgaW1hZ2VTb2x0czogbW9kZWwuaW1hZ2VTb2x0cywgbWF0ZXJpYWxTb2x0czogbW9kZWwubWF0ZXJpYWxTb2x0cyB9KS50aGVuKFxyXG4gICAgICAgIC8vICAgICAgICAgKHJlcykgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIG1vZGVsLmxvYWRlZChyZXMubWVzaGVzLCByZXMucGFydGljbGVTeXN0ZW1zLCByZXMuc2tlbGV0b25zLCByZXMuYW5pbWF0aW9uR3JvdXBzKTtcclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgKTtcclxuICAgICAgICByZXR1cm4gQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoQXN5bmMobW9kZWxOYW1lLCB0YXJnZXRQYXRoLCB0YXJnZXRGaWxlLCBzY2VuZUltcGwsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH0sIHVuZGVmaW5lZCkudGhlbihcclxuICAgICAgICAgICAgICAgIChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbC5sb2FkZWQocmVzLm1lc2hlcywgcmVzLnBhcnRpY2xlU3lzdGVtcywgcmVzLnNrZWxldG9ucywgcmVzLmFuaW1hdGlvbkdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbW9kZWwg55uu5qCH5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0UGF0aCDlpoLmnpzotYvlgLwo5a6M5pW06Lev5b6EKeWwhuW/veeVpSBtb2RlbCDphY3nva7nmoTot6/lvoRcclxuICAgICAqIEBwYXJhbSB0YXJnZXRGaWxlIOWmguaenOi1i+WAvCjlrozmlbTot6/lvoQp5bCG5b+955WlIG1vZGVsIOmFjee9rueahOi3r+W+hFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5zZXJ0RWZmZWN0KG1vZGVsOiBJbnNlcnRNb2RlbE9iaiwgdGFyZ2V0UGF0aD86IHN0cmluZywgdGFyZ2V0RmlsZT86IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBtb2RlbC5wYXRoO1xyXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gbW9kZWwuZmlsZU5hbWU7XHJcbiAgICAgICAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lO1xyXG4gICAgICAgIGNvbnN0IHNjZW5lSW1wbCA9IG1vZGVsLnNjZW5lLmltcGw7XHJcblxyXG4gICAgICAgIHRhcmdldFBhdGggPSB0YXJnZXRQYXRoID8gdGFyZ2V0UGF0aCA6IGAke2dldFJlc1BhdGgoKX0ke2dldEVmZmVjdFJlc1BhdGgoKX0ke3BhdGh9YDtcclxuICAgICAgICB0YXJnZXRGaWxlID0gdGFyZ2V0RmlsZSA/IHRhcmdldEZpbGUgOiBgJHtmaWxlTmFtZX0uZ2x0ZmA7XHJcblxyXG4gICAgICAgIC8vIEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChtb2RlbE5hbWUsIHRhcmdldFBhdGgsIHRhcmdldEZpbGUsIHNjZW5lSW1wbCwgbW9kZWwubG9hZGVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGltYWdlU29sdHM6IG1vZGVsLmltYWdlU29sdHMsIG1hdGVyaWFsU29sdHM6IG1vZGVsLm1hdGVyaWFsU29sdHMgfSk7XHJcbiAgICAgICAgQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKG1vZGVsTmFtZSwgdGFyZ2V0UGF0aCwgdGFyZ2V0RmlsZSwgc2NlbmVJbXBsLCBtb2RlbC5sb2FkZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG1vZGVsIOebruagh+aooeWei1xyXG4gICAgICogQHBhcmFtIHRhcmdldFBhdGgg5aaC5p6c6LWL5YC8KOWujOaVtOi3r+W+hCnlsIblv73nlaUgbW9kZWwg6YWN572u55qE6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0RmlsZSDlpoLmnpzotYvlgLwo5a6M5pW06Lev5b6EKeWwhuW/veeVpSBtb2RlbCDphY3nva7nmoTot6/lvoRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluc2VydEVmZmVjdEFzeW5jKG1vZGVsOiBJbnNlcnRNb2RlbE9iaiwgdGFyZ2V0UGF0aD86IHN0cmluZywgdGFyZ2V0RmlsZT86IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBtb2RlbC5wYXRoO1xyXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gbW9kZWwuZmlsZU5hbWU7XHJcbiAgICAgICAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lO1xyXG4gICAgICAgIGNvbnN0IHNjZW5lSW1wbCA9IG1vZGVsLnNjZW5lLmltcGw7XHJcblxyXG4gICAgICAgIHRhcmdldFBhdGggPSB0YXJnZXRQYXRoID8gdGFyZ2V0UGF0aCA6IGAke2dldFJlc1BhdGgoKX0ke2dldEVmZmVjdFJlc1BhdGgoKX0ke3BhdGh9YDtcclxuICAgICAgICB0YXJnZXRGaWxlID0gdGFyZ2V0RmlsZSA/IHRhcmdldEZpbGUgOiBgJHtmaWxlTmFtZX0uZ2x0ZmA7XHJcblxyXG4gICAgICAgIC8vIHJldHVybiBCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2hBc3luYyhtb2RlbE5hbWUsIHRhcmdldFBhdGgsIHRhcmdldEZpbGUsIHNjZW5lSW1wbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgaW1hZ2VTb2x0czogbW9kZWwuaW1hZ2VTb2x0cywgbWF0ZXJpYWxTb2x0czogbW9kZWwubWF0ZXJpYWxTb2x0cyB9KVxyXG4gICAgICAgIC8vICAgICAudGhlbihcclxuICAgICAgICAvLyAgICAgICAgIChyZXMpID0+IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBtb2RlbC5sb2FkZWQocmVzLm1lc2hlcywgcmVzLnBhcnRpY2xlU3lzdGVtcywgcmVzLnNrZWxldG9ucywgcmVzLmFuaW1hdGlvbkdyb3Vwcyk7XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICk7XHJcbiAgICAgICAgcmV0dXJuIEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaEFzeW5jKG1vZGVsTmFtZSwgdGFyZ2V0UGF0aCwgdGFyZ2V0RmlsZSwgc2NlbmVJbXBsLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwubG9hZGVkKHJlcy5tZXNoZXMsIHJlcy5wYXJ0aWNsZVN5c3RlbXMsIHJlcy5za2VsZXRvbnMsIHJlcy5hbmltYXRpb25Hcm91cHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSW5kZXggfSBmcm9tIFwiLi9hcHAvZGVtbzAwMFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEluaXRPayA9ICgpID0+IHtcclxuICAgIEluZGV4LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdKTtcclxufTsiXX0=
