(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../front/main");
window.addEventListener('DOMContentLoaded', main_1.InitOk);
},{"../front/main":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_instance_1 = require("../../base/engine_instance");
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
        this.engine = new engine_instance_1.EngineInstance('00', canvas);
        this.engine.active();
        // 创建场景
        this.scene = this.engine.createScene3D('test');
        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        // 添加相机
        this.scene.addCamera(camera);
        // 设置活动相机
        this.scene.activeCamera = camera;
        // 可以激活场景
        this.scene.active();
        // 添加灯光
        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene.scene);
        this.scene.addLight('light1', light);
        // 添加球体
        const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene.scene);
        sphere.position.y = 1;
        // 添加平面
        const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene.scene);
        ground.position.y = 0.1;
        // var sceneIn = new BABYLON.SceneInstrumentation(this.scene.scene);
    }
    static createEngine(canvas) {
        return new BABYLON.Engine(canvas, true);
    }
}
exports.Index = Index;
},{"../../base/engine_instance":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scene_instance_1 = require("./scene_instance");
const scene_base_1 = require("./scene_base");
/**
 * 项目层 封装 Engin 实例
 * * 控制 引擎实例是否 渲染
 * * 控制 多场景的 渲染顺序
 * // TODO
 * * 控制 多场景的 渲染前处理
 *      * 是否清屏
 *      * 清屏参数
 */
class EngineInstance {
    constructor(ename, canvas) {
        /**
         * 多场景实例 堆
         */
        this.sceneMap = new Map();
        /**
         * 多场景的渲染顺序配置
         */
        this.renderSceneOrder = [];
        /**
         * Engine 实例渲染状态
         */
        this.renderFlag = scene_base_1.RenderFlags.pause;
        /**
         * 引擎内场景控制
         */
        this.renderLoop = () => {
            if (this.renderFlag === scene_base_1.RenderFlags.active) {
                if (this.renderSceneOrder.length > 0) {
                    this.renderSceneOrder.forEach((sname) => {
                        const scene = this.sceneMap.get(sname);
                        scene && scene.scene.render();
                    });
                }
                else {
                    this.sceneMap.forEach((scene) => {
                        scene.scene.render();
                    });
                }
            }
        };
        this.name = ename;
        this.engine = new BABYLON.Engine(canvas);
        this.activeRenderLoop();
    }
    /**
     * 场景一般场景
     * @param sname 场景名称
     * @param opt 场景参数
     * * 不能导入模型
     * * 不能插入模型
     */
    createScene(sname, opt) {
        let scene = this.sceneMap.get(sname);
        if (!scene) {
            scene = new scene_instance_1.SceneInstance(sname, this.engine, opt);
            this.sceneMap.set(sname, scene);
        }
        return scene;
    }
    /**
     * 创建 3D 场景
     * @param sname 场景名称
     * @param opt 场景参数
     * * 正常的 3D 功能
     */
    createScene3D(sname, opt) {
        let scene = this.sceneMap.get(sname);
        if (!scene) {
            scene = new scene_instance_1.SceneInstance3D(sname, this.engine, opt);
            this.sceneMap.set(sname, scene);
        }
        return scene;
    }
    /**
     * 激活
     */
    active() {
        this.renderFlag = scene_base_1.RenderFlags.active;
    }
    /**
     * 暂停
     */
    pause() {
        this.renderFlag = scene_base_1.RenderFlags.pause;
    }
    /**
     * 启动引擎实例循环
     */
    activeRenderLoop() {
        this.engine.runRenderLoop(this.renderLoop);
    }
}
exports.EngineInstance = EngineInstance;
},{"./scene_base":5,"./scene_instance":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scene_tool_1 = require("./scene_tool");
/**
 * 作为场景导入的模型数据
 */
class AppendModelObj {
    constructor(meshName, scene, opt = {}) {
        /**
         * 用于射线检测时的附加检查数据
         */
        this.rayID = -1;
        /**
         * 是否在逻辑里被销毁
         */
        this.isDisposed = false;
        /**
         * 是否加载结束
         */
        this.isLoaded = false;
        /**
         * 导入成功后调用
         * * 由加载模块调用 - LoadTools
         */
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
        scene_tool_1.LoaderTool.appendMesh(this);
    }
    get isReady() {
        return this.impl && this.impl.isReady;
    }
    /**
     * 销毁
     * * 手动调用时，会自动从所属 scene 实例中移除
     */
    dispose() {
        if (this.isLoaded && this.rootImpl) {
            this.rootImpl.dispose();
        }
        this.scene.removeAppend(this);
        this.isDisposed = true;
    }
}
exports.AppendModelObj = AppendModelObj;
/**
 * 导入的非场景类模型
 * * 项目层 封装的 模型数据结构，处理 逻辑的同步操作 在 加载的异步过程 中的安全
 * * 控制 动画切换
 * * 控制 模型 附加 与 被附加
 * * 控制 模型 变换 - 旋转 缩放 py
 * * 控制 模型 逻辑释放
 */
class InsertModelObj {
    constructor(meshName, scene, opt = {}) {
        this.isDisposed = false;
        this.isLoaded = true;
        this.isVisible = false;
        this.meshMap = new Map();
        this.skeletonMap = new Map();
        this.animationMap = new Map();
        this.particleSysMap = new Map();
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
            this.animationMap.clear();
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
            if (this.isLoaded) {
                this.rootImpl && this.rootImpl.dispose(false, true);
                this.rootImpl && (this.rootImpl.parent = null);
            }
            this.meshMap.clear();
            this.skeletonMap.clear();
            this.particleSysMap.clear();
            this.animationMap.clear();
            this.animation = undefined;
            this.parent = undefined;
            this.root = undefined;
            this.rootImpl = undefined;
            this.impl = undefined;
            this.lookAt = undefined;
            this.rotate = undefined;
            this.position = undefined;
            this.scale = undefined;
            this.linkUI = undefined;
            this.insertedCall = undefined;
            this.isDisposed = true;
        };
        // tslint:disable-next-line:max-line-length
        this.loaded = (ameshes, particleSystems, skeletons, animationGroups) => {
            const meshes = ameshes;
            if (this.isDisposed) {
                meshes[0].dispose();
                return;
            }
            this.isLoaded = true;
            this.rootImpl = meshes[0];
            this.impl = meshes[1];
            this.impl.animations.forEach((anim) => {
                anim.framePerSecond = 20;
            });
            if (meshes !== undefined) {
                meshes.forEach((mesh) => {
                    this.meshMap.set(mesh.id, mesh);
                    mesh.rayID = this.rayID;
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
                    this.particleSysMap.set(particleSys.id, particleSys);
                });
            }
            this.changePostion();
            this.changeScale();
            this.changeRotate();
            this.changeLinkUI();
            this.changeLookAt();
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
            // if (this.isAnimationLoop === true) {
            //     this.animation.play();
            // }
            if (this.animEndCB !== undefined) {
                this.animEndCB();
                this.animEndCB = undefined;
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
                    if (animGroup.isStarted && isLoop) {
                        console.warn(`${animName} 动画已经执行！`);
                        animGroup.onAnimationGroupEndObservable.clear();
                        animGroup.stop();
                    }
                    animGroup.onAnimationGroupEndObservable.add(this.animEndCall);
                    animGroup.start(isLoop, speed);
                    if (this.animOpt.goEnd) { // 是否跳转到动画最后一帧(非循环动画设置)
                        animGroup.goToFrame(animGroup.to);
                    }
                }
                else {
                    console.warn(`${animName} 动画不存在！`);
                }
                this.animEndCB = endCall;
                this.animation = animGroup;
                this.isAnimationLoop = isLoop;
            }
        };
        this.stopAnimation = () => {
            if (this.animation && this.animation.isStarted) {
                this.animation.onAnimationGroupEndObservable.clear();
                this.animation.stop();
            }
        };
        this.pauseAnimation = () => {
            this.animation && this.animation.pause();
        };
        this.scene = scene;
        this.name = meshName;
        this.parent = opt.parent;
        this.rayID = opt.rayID || -1;
        this.path = opt.path || '';
        this.fileName = opt.fileName;
        this.modelName = opt.modelName;
        this.insertedCall = opt.insertedCall;
        this.animDefault = !!opt.animDefault;
        if (!opt.isEffect) {
            scene_tool_1.LoaderTool.loadMesh(this);
        }
        else {
            scene_tool_1.LoaderTool.loadEffect(this);
        }
    }
    get isReady() {
        return this.impl && this.impl.isReady;
    }
    setAttach(opt) {
        this.attachOptList.push(opt);
        if (opt.modelOpt !== undefined) {
            opt.modelOpt.insertedCall = () => {
                opt.mesh = opt.model && opt.model.rootImpl;
                if (this.isLoaded) {
                    this.updateAttachOpt();
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
    setLinkUI(node) {
        this.linkUI = node;
        if (this.isLoaded) {
            this.changeLinkUI();
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
    setAnim(animOpt) {
        this.animOpt = animOpt;
        if (this.isLoaded) {
            this.changeAnim();
        }
    }
    stopAnim() {
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
        if (this.rotate && this.impl) {
            scene_tool_1.NodeTools.rotateNode(this.impl, this.rotate);
        }
    }
    changeLookAt() {
        if (this.lookAt && this.impl) {
            scene_tool_1.NodeTools.nodeLookAt(this.impl, this.lookAt);
        }
    }
    changeLinkUI() {
        if (this.linkUI && this.rootImpl) {
            this.linkUI.linkWithMesh(this.rootImpl);
        }
    }
    changeVisible() {
        if (this.isVisible !== undefined && this.rootImpl) {
            this.rootImpl.isVisible = this.isVisible;
        }
    }
    updateAttachOpt() {
        let useCount = 0;
        let tempIndex = 0;
        let newListLen = 0;
        const listLen = this.attachOptList.length;
        for (let len = listLen - 1; len >= 0; len--) {
            const opt = this.attachOptList[len];
            if (opt && opt.mesh !== undefined) {
                const skeleton = this.skeletonMap.get(opt.skeletonName);
                if (skeleton !== undefined) {
                    const boneIndex = skeleton.getBoneIndexByName(opt.boneName);
                    if (boneIndex >= 0) {
                        opt.mesh.attachToBone(skeleton.bones[boneIndex], this.rootImpl);
                        scene_tool_1.NodeTools.nodeTransform(opt.mesh, opt.transform);
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
    updateChildOpt() {
        this.childOptList.forEach((opt) => {
            if (opt && opt.isFinished !== true) {
                if (opt.model !== undefined) {
                    if (opt.model.rootImpl !== undefined) {
                        opt.isFinished = true;
                        opt.model.rootImpl.parent = this.rootImpl;
                        scene_tool_1.NodeTools.nodeTransform(opt.model.rootImpl, opt.transform);
                    }
                }
                else if (opt.mesh !== undefined) {
                    opt.isFinished = true;
                    opt.mesh.parent = this.rootImpl;
                    scene_tool_1.NodeTools.nodeTransform(opt.mesh, opt.transform);
                }
            }
        });
    }
    updateAttach() {
        //
    }
    changeAnim() {
        this.stopAnimation();
        if (this.animOpt) {
            this.changeAnimation();
        }
    }
}
exports.InsertModelObj = InsertModelObj;
},{"./scene_tool":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CAMERATYPES;
(function (CAMERATYPES) {
    CAMERATYPES["ArcRotateCamera"] = "ArcRotateCamera";
    CAMERATYPES["UniversalCamera"] = "UniversalCamera";
    CAMERATYPES["TargetCamera"] = "TargetCamera";
})(CAMERATYPES = exports.CAMERATYPES || (exports.CAMERATYPES = {}));
var RenderFlags;
(function (RenderFlags) {
    RenderFlags["active"] = "active";
    RenderFlags["pause"] = "pause";
    RenderFlags["dispose"] = "dispose";
})(RenderFlags = exports.RenderFlags || (exports.RenderFlags = {}));
var LIGHTTYPES;
(function (LIGHTTYPES) {
    LIGHTTYPES["HemisphericLight"] = "HemisphericLight";
})(LIGHTTYPES = exports.LIGHTTYPES || (exports.LIGHTTYPES = {}));
exports.ResPath = 'game/app/scene_res/res/';
exports.SceneResPath = 'scenes/';
exports.ModelResPath = 'models/';
exports.NodeResPath = 'models/';
exports.EffectResPath = 'effects/';
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scene_base_1 = require("./scene_base");
const model_instance_1 = require("./model_instance");
class SceneInstance {
    constructor(name, engine, opt) {
        /**
         * 场景内渲染光表
         */
        this.lightMap = new Map();
        /**
         * 场景内相机表
         */
        this.cameraMap = new Map();
        this.activeObserver = () => {
            console.warn(`Scene ${this.name} active!`);
        };
        this.disposeObserver = () => {
            console.warn(`Scene ${this.name} dispose!`);
        };
        this.changeCameraObserver = (camera) => {
            console.log(`Scene ${this.name} camera change: ${camera.name}`);
        };
        this.removeCameraObserver = (camera) => {
            console.log(`Scene ${this.name} camera change: ${camera.name}`);
        };
        this.pickCall = (e, s) => {
            //
        };
        /**
         * 暂停渲染
         */
        this.pause = () => {
            this.renderFlag = scene_base_1.RenderFlags.pause;
            this.scene.onPointerObservable.removeCallback(this.pickCall);
        };
        /**
         * 激活渲染
         */
        this.active = () => {
            // 未销毁
            if (this.renderFlag !== scene_base_1.RenderFlags.dispose) {
                // 未激活
                if (this.renderFlag !== scene_base_1.RenderFlags.active) {
                    if (this.isReady()) {
                        if (!this.scene.onPointerObservable.hasObservers()) {
                            this.scene.onPointerObservable.add(this.pickCall);
                        }
                        this.renderFlag = scene_base_1.RenderFlags.active;
                        this.activeObserver();
                    }
                    else {
                        console.warn(`场景 ${this.name} 未准备完毕，不能激活`);
                    }
                }
                else {
                    console.warn(`场景 ${this.name} 重复激活`);
                }
            }
            else {
                console.warn(`场景 ${this.name} 已被销毁`);
            }
        };
        this.name = name;
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine, opt);
        this.cameraMap = new Map();
        this._renderFlag = scene_base_1.RenderFlags.pause;
    }
    addLight(lname, light) {
        if (this.lightMap.get(lname)) {
            // TODO
        }
        else {
            this.lightMap.set(lname, light);
        }
    }
    removeLight(lname) {
        if (this.lightMap.get(lname)) {
            this.lightMap.delete(lname);
        }
        else {
            // TODO
        }
    }
    readLight(lname) {
        return this.lightMap.get(lname);
    }
    get activeCamera() {
        return this._camera;
    }
    set activeCamera(camera) {
        if (camera) {
            this._camera = camera;
            this.scene.activeCamera = camera;
        }
    }
    get renderFlag() {
        return this._renderFlag;
    }
    set renderFlag(flag) {
        this._renderFlag = flag;
    }
    /**
     * 设置当前活动相机
     * @param cameraName 目标相机名称
     * * 在场景内部相机表中查找
     */
    setActiveCamera(cameraName) {
        const camera = this.cameraMap.get(cameraName);
        if (!!camera) {
            this.activeCamera = camera;
            this.changeCameraObserver(this.activeCamera);
            // if (FormatCanvasDisplay.getIsWeixinGAME()) {
            // CameraTool.computeViewPort(camera);
            // }
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
            if (this.activeCamera === camera) {
                this.removeCameraObserver(camera);
                this.activeCamera = undefined;
                this.renderFlag = scene_base_1.RenderFlags.pause;
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
        this.scene.dispose();
        this._camera = undefined;
        this.renderFlag = scene_base_1.RenderFlags.dispose;
        this.cameraMap.clear();
        this.disposeObserver();
    }
    /**
     * 检查场景是否准备结束，可激活
     */
    isReady() {
        let result = true;
        result = result && this.activeCamera !== undefined;
        return result;
    }
}
exports.SceneInstance = SceneInstance;
class SceneInstance3D extends SceneInstance {
    constructor() {
        super(...arguments);
        /**
         * 场景内 场景环境级别节点表
         * * append 方式加载的
         */
        this.appendMeshMap = new Map();
        this.insertMeshMap = new Map();
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
    }
    /**
     * 导入场景模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    appendScene(objName, opt = {}) {
        const model = new model_instance_1.AppendModelObj(objName, this, opt);
        this.appendMeshMap.set(objName, model);
    }
    removeAppend(model) {
        this.appendMeshMap.delete(model.name);
    }
    /**
     * 插入模型
     * @param objName 模型命名
     * * 用于项目层管理
     * @param opt 模型加载配置
     */
    insertMesh(objName, opt = {}) {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const model = new model_instance_1.InsertModelObj(objName, this, opt);
        this.insertMeshMap.set(objName, model);
        return model;
    }
    removeInsert(model) {
        this.insertMeshMap.delete(model.name);
    }
    /**
     * 销毁
     */
    dispose() {
        super.dispose();
        this.appendMeshMap.clear();
    }
}
exports.SceneInstance3D = SceneInstance3D;
},{"./model_instance":4,"./scene_base":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeTools {
    /**
     * 旋转 Mesh - 自转
     * @param mesh 目标mesh
     * @param rotate 旋转参数： [ x, y, z ]
     */
    static rotateNode(node, rotate) {
        if (!node.rotationQuaternion) {
            node.rotationQuaternion = new BABYLON.Quaternion();
        }
        NodeTools.rotateQuaternion(node.rotationQuaternion, rotate);
    }
    /**
     * 旋转 Mesh - 自转
     * @param quaternion 目标 Quaternion
     * @param rotate 旋转参数： [ x, y, z ]
     */
    static rotateQuaternion(quaternion, rotate) {
        // YXZ
        BABYLON.Quaternion.RotationYawPitchRollToRef(rotate[1] - Math.PI, rotate[0], -rotate[2], quaternion);
    }
    static positNode(node, data) {
        // node.position = new BABYLON.Vector3(-data[0], data[1], -data[2]);
        node.position.set(-data[0], data[1], -data[2]);
    }
    static scaleNode(node, data) {
        node.scaling = new BABYLON.Vector3(data[0], data[1], -data[2]);
    }
    static nodeLookAt(node, data) {
        node.lookAt(new BABYLON.Vector3(data[0], data[1], -data[2]));
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
    static translatePosition(data) {
        data[0] = -data[0];
        data[1] = data[1];
        data[2] = -data[2];
    }
    static translateRotate(data) {
        data[0] = data[0];
        data[1] = data[1] - Math.PI;
        data[2] = -data[2];
    }
    static translateQuaternion(data) {
        const quaternion = new BABYLON.Quaternion();
        NodeTools.rotateQuaternion(quaternion, data);
        return quaternion;
    }
    static translateScale(data) {
        data[0] = data[0];
        data[1] = data[1];
        data[2] = -data[2];
    }
}
exports.NodeTools = NodeTools;
// tslint:disable-next-line:no-unnecessary-class
class LoaderTool {
    static appendMesh(model) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;
        // BABYLON.SceneLoader.Append(`${ResPath}${SceneResPath}${path}`, `${fileName}.scene.gltf`, sceneImpl, model.appened);
        BABYLON.SceneLoader.AppendAsync(`${path}`, `${fileName}.gltf`, sceneImpl).then((res) => {
            model.appened(res);
        });
    }
    static loadMesh(model) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;
        BABYLON.SceneLoader.ImportMesh(modelName, `${path}`, `${fileName}.gltf`, sceneImpl, model.loaded);
    }
    static loadEffect(model) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;
        BABYLON.SceneLoader.ImportMesh(modelName, `${path}`, `${fileName}.gltf`, sceneImpl, model.loaded);
    }
}
exports.LoaderTool = LoaderTool;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demo000_1 = require("./app/demo000");
exports.InitOk = () => {
    demo000_1.Index.init(document.getElementsByTagName('canvas')[0]);
};
},{"./app/demo000":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYm9vdC9pbmRleC50cyIsInNyYy9mcm9udC9hcHAvZGVtbzAwMC9pbmRleC50cyIsInNyYy9mcm9udC9iYXNlL2VuZ2luZV9pbnN0YW5jZS50cyIsInNyYy9mcm9udC9iYXNlL21vZGVsX2luc3RhbmNlLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmVfYmFzZS50cyIsInNyYy9mcm9udC9iYXNlL3NjZW5lX2luc3RhbmNlLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmVfdG9vbC50cyIsInNyYy9mcm9udC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSx3Q0FBdUM7QUFFdkMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGFBQU0sQ0FBQyxDQUFDOzs7O0FDRnBELGdFQUE0RDtBQUc1RDs7O0dBR0c7QUFDSCxNQUFhLEtBQUs7SUFJZDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUF5QjtRQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVyQixPQUFPO1FBQ1AsSUFBSSxDQUFDLEtBQUssR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRyxNQUFNLENBQUMsU0FBUyxDQUFD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O0FBakNELGdDQWlDQzs7OztBQzFHRCwyQ0FBc0M7QUFFekIsUUFBQSxNQUFNLEdBQUcsR0FBRyxFQUFFO0lBQ3ZCLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgSW5pdE9rIH0gZnJvbSBcIi4uL2Zyb250L21haW5cIjtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgSW5pdE9rKTsiLCJpbXBvcnQgeyBFbmdpbmVJbnN0YW5jZSB9IGZyb20gXCIuLi8uLi9iYXNlL2VuZ2luZV9pbnN0YW5jZVwiO1xyXG5pbXBvcnQgeyBTY2VuZUluc3RhbmNlM0QsIFNjZW5lSW5zdGFuY2UgfSBmcm9tIFwiLi4vLi4vYmFzZS9zY2VuZV9pbnN0YW5jZVwiO1xyXG5cclxuLyoqXHJcbiAqIOWKn+iDveaooeWdl1xyXG4gKiAqIOS4u+WKn+iDve+8jGJhYnlsb24gM0QgZGVtb1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluZGV4IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgZW5naW5lOiBFbmdpbmVJbnN0YW5jZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRDtcclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5pe277yM5Yib5bu65LiA5Liq566A5Y2V55qE5a6M5pW055qE5Zy65pmv5bGV56S6XHJcbiAgICAgKiAqIOebuOaculxyXG4gICAgICogKiDnga/lhYlcclxuICAgICAqICog55CD5L2TXHJcbiAgICAgKiAqIOW5s+mdolxyXG4gICAgICogQHBhcmFtIGNhbnZhcyDnm67moIcgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgRW5naW5lSW5zdGFuY2UoJzAwJywgY2FudmFzKTtcclxuICAgICAgICB0aGlzLmVuZ2luZS5hY3RpdmUoKTtcclxuXHJcbiAgICAgICAgLy8g5Yib5bu65Zy65pmvXHJcbiAgICAgICAgdGhpcy5zY2VuZSAgPSB0aGlzLmVuZ2luZS5jcmVhdGVTY2VuZTNEKCd0ZXN0Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBCQUJZTE9OLkZyZWVDYW1lcmEoJ2NhbWVyYTEnLCBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDUsIC0xMCksIHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgICAgIGNhbWVyYS5zZXRUYXJnZXQoQkFCWUxPTi5WZWN0b3IzLlplcm8oKSk7XHJcbiAgICAgICAgY2FtZXJhLmF0dGFjaENvbnRyb2woY2FudmFzLCB0cnVlKTtcclxuICAgICAgICAvLyDmt7vliqDnm7jmnLpcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZENhbWVyYShjYW1lcmEpO1xyXG4gICAgICAgIC8vIOiuvue9rua0u+WKqOebuOaculxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlQ2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIC8vIOWPr+S7pea/gOa0u+WcuuaZr1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlKCk7XHJcblxyXG4gICAgICAgIC8vIOa3u+WKoOeBr+WFiVxyXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IEJBQllMT04uSGVtaXNwaGVyaWNMaWdodCgnbGlnaHQxJywgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAwKSwgdGhpcy5zY2VuZS5zY2VuZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGRMaWdodCgnbGlnaHQxJywgbGlnaHQpO1xyXG5cclxuICAgICAgICAvLyDmt7vliqDnkIPkvZNcclxuICAgICAgICBjb25zdCBzcGhlcmUgPSBCQUJZTE9OLk1lc2guQ3JlYXRlU3BoZXJlKCdzcGhlcmUxJywgMTYsIDIsIHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgICAgIHNwaGVyZS5wb3NpdGlvbi55ID0gMTtcclxuXHJcbiAgICAgICAgLy8g5re75Yqg5bmz6Z2iXHJcbiAgICAgICAgY29uc3QgZ3JvdW5kID0gQkFCWUxPTi5NZXNoLkNyZWF0ZUdyb3VuZCgnZ3JvdW5kMScsIDYsIDYsIDIsIHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgICAgIGdyb3VuZC5wb3NpdGlvbi55ID0gMC4xO1xyXG5cclxuICAgICAgICAvLyB2YXIgc2NlbmVJbiA9IG5ldyBCQUJZTE9OLlNjZW5lSW5zdHJ1bWVudGF0aW9uKHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVFbmdpbmUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNjZW5lSW5zdGFuY2UsIFNjZW5lSW5zdGFuY2UzRCB9IGZyb20gXCIuL3NjZW5lX2luc3RhbmNlXCI7XHJcbmltcG9ydCB7IFJlbmRlckZsYWdzIH0gZnJvbSBcIi4vc2NlbmVfYmFzZVwiO1xyXG5cclxuLyoqXHJcbiAqIOmhueebruWxgiDlsIHoo4UgRW5naW4g5a6e5L6LXHJcbiAqICog5o6n5Yi2IOW8leaTjuWunuS+i+aYr+WQpiDmuLLmn5NcclxuICogKiDmjqfliLYg5aSa5Zy65pmv55qEIOa4suafk+mhuuW6j1xyXG4gKiAvLyBUT0RPXHJcbiAqICog5o6n5Yi2IOWkmuWcuuaZr+eahCDmuLLmn5PliY3lpITnkIZcclxuICogICAgICAqIOaYr+WQpua4heWxj1xyXG4gKiAgICAgICog5riF5bGP5Y+C5pWwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRW5naW5lSW5zdGFuY2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbmdpbmUg5a6e5L6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBlbmdpbmU6IEJBQllMT04uRW5naW5lO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlkI3np7BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5aSa5Zy65pmv5a6e5L6LIOWghlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2NlbmVNYXA6IE1hcDxzdHJpbmcsIFNjZW5lSW5zdGFuY2U+ID0gbmV3IE1hcCgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlpJrlnLrmma/nmoTmuLLmn5Ppobrluo/phY3nva5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHJlbmRlclNjZW5lT3JkZXI6IHN0cmluZ1tdID0gW107XHJcbiAgICAvKipcclxuICAgICAqIEVuZ2luZSDlrp7kvovmuLLmn5PnirbmgIFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW5kZXJGbGFnOiBSZW5kZXJGbGFncyA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgY29uc3RydWN0b3IoZW5hbWU6IHN0cmluZywgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMubmFtZSAgID0gZW5hbWU7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlbmRlckxvb3AoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5LiA6Iis5Zy65pmvXHJcbiAgICAgKiBAcGFyYW0gc25hbWUg5Zy65pmv5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0gb3B0IOWcuuaZr+WPguaVsFxyXG4gICAgICogKiDkuI3og73lr7zlhaXmqKHlnotcclxuICAgICAqICog5LiN6IO95o+S5YWl5qih5Z6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcmVhdGVTY2VuZShzbmFtZTogc3RyaW5nLCBvcHQ/OiBCQUJZTE9OLlNjZW5lT3B0aW9ucykge1xyXG4gICAgICAgIGxldCBzY2VuZTogU2NlbmVJbnN0YW5jZSA9IDxTY2VuZUluc3RhbmNlPnRoaXMuc2NlbmVNYXAuZ2V0KHNuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCFzY2VuZSkge1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZUluc3RhbmNlKHNuYW1lLCB0aGlzLmVuZ2luZSwgb3B0KTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZU1hcC5zZXQoc25hbWUsIHNjZW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu6IDNEIOWcuuaZr1xyXG4gICAgICogQHBhcmFtIHNuYW1lIOWcuuaZr+WQjeensFxyXG4gICAgICogQHBhcmFtIG9wdCDlnLrmma/lj4LmlbBcclxuICAgICAqICog5q2j5bi455qEIDNEIOWKn+iDvVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlU2NlbmUzRChzbmFtZTogc3RyaW5nLCBvcHQ/OiBCQUJZTE9OLlNjZW5lT3B0aW9ucykge1xyXG4gICAgICAgIGxldCBzY2VuZTogU2NlbmVJbnN0YW5jZTNEID0gPFNjZW5lSW5zdGFuY2UzRD50aGlzLnNjZW5lTWFwLmdldChzbmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghc2NlbmUpIHtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmVJbnN0YW5jZTNEKHNuYW1lLCB0aGlzLmVuZ2luZSwgb3B0KTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZU1hcC5zZXQoc25hbWUsIHNjZW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJGbGFnID0gUmVuZGVyRmxhZ3MuYWN0aXZlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmmoLlgZxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdXNlKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlkK/liqjlvJXmk47lrp7kvovlvqrnjq9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZW5kZXJMb29wKCkge1xyXG4gICAgICAgIHRoaXMuZW5naW5lLnJ1blJlbmRlckxvb3AodGhpcy5yZW5kZXJMb29wKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5byV5pOO5YaF5Zy65pmv5o6n5Yi2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVuZGVyTG9vcCA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJGbGFnID09PSBSZW5kZXJGbGFncy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyU2NlbmVPcmRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNjZW5lT3JkZXIuZm9yRWFjaCgoc25hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY2VuZSA9IHRoaXMuc2NlbmVNYXAuZ2V0KHNuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBzY2VuZSAmJiBzY2VuZS5zY2VuZS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZU1hcC5mb3JFYWNoKChzY2VuZTogU2NlbmVJbnN0YW5jZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjZW5lLnNjZW5lLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJTW9kZWxJbnN0YW5jZSwgSU1vZGVsT3B0LCBJTW9kZWxBbmltT3B0LCBJTW9kZWxBdHRhY2hPcHQsIElNb2RlbENoaWxkT3B0LCBJVHJhbnNmb3JtT2JqLCBJVHJhbnNmb3JtT2JqMiB9IGZyb20gXCIuL3NjZW5lX2Jhc2VcIjtcclxuaW1wb3J0IHsgU2NlbmVJbnN0YW5jZTNEIH0gZnJvbSBcIi4vc2NlbmVfaW5zdGFuY2VcIjtcclxuaW1wb3J0IHsgTG9hZGVyVG9vbCwgTm9kZVRvb2xzIH0gZnJvbSBcIi4vc2NlbmVfdG9vbFwiO1xyXG5cclxuLyoqXHJcbiAqIOS9nOS4uuWcuuaZr+WvvOWFpeeahOaooeWei+aVsOaNrlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGVuZE1vZGVsT2JqIGltcGxlbWVudHMgSU1vZGVsSW5zdGFuY2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjkuo7lsITnur/mo4DmtYvml7bnmoTpmYTliqDmo4Dmn6XmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJheUlEOiBudW1iZXIgPSAtMTtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5ZCN56ewXHJcbiAgICAgKiAqIOmhueebrueahOWRveWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmiYDlnKjot6/lvoRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog55uu5qCH5paH5Lu25ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDopoHlr7zlhaXnmoTmlofku7blhoXnmoTmjIflrprmqKHlnovlkI3np7BcclxuICAgICAqICog5Li6ICcnIOWImeihqOekuuWvvOWFpeebruagh+aWh+S7tuS4reaJgOacieaooeWei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbW9kZWxOYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOWvvOWFpeaIkOWKn+WQjueahOiwg+eUqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbG9hZGVkQ2FsbD86IChtb2RlbDogQXBwZW5kTW9kZWxPYmopID0+IGFueTtcclxuICAgIC8qKlxyXG4gICAgICog5omA5bGeIOWcuuaZr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2NlbmU6ICAgICAgIFNjZW5lSW5zdGFuY2UzRDtcclxuICAgIC8qKlxyXG4gICAgICog5a+85YWl5ZCO55qE5qih5Z6L5qC56IqC54K5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbXBsOiAgICAgICAgQkFCWUxPTi5NZXNoIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXlkI7nmoTmoLnoioLngrkgLSA855SxQkFCWUxPTiDliqDovb3ml7bliJvlu7rvvIznlKjku6XlnKjlnLrmma/lhoXlrprkvY3lr7zlhaXnmoTmqKHlnos+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByb290SW1wbDogICAgQkFCWUxPTi5NZXNoIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKblnKjpgLvovpHph4zooqvplIDmr4FcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzRGlzcG9zZWQ6ICBib29sZWFuID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWKoOi9vee7k+adn1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNMb2FkZWQ6ICAgIGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBnZXQgaXNSZWFkeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsICYmIHRoaXMuaW1wbC5pc1JlYWR5O1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IobWVzaE5hbWU6IHN0cmluZywgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRCwgb3B0OiBJTW9kZWxPcHQgPSA8YW55Pnt9KSB7XHJcbiAgICAgICAgdGhpcy5uYW1lICAgICAgID0gbWVzaE5hbWU7XHJcbiAgICAgICAgdGhpcy5zY2VuZSAgICAgID0gc2NlbmU7XHJcbiAgICAgICAgdGhpcy5wYXRoICAgICAgID0gb3B0LnBhdGggfHwgJyc7XHJcbiAgICAgICAgdGhpcy5maWxlTmFtZSAgID0gb3B0LmZpbGVOYW1lO1xyXG4gICAgICAgIHRoaXMubW9kZWxOYW1lICA9IG9wdC5tb2RlbE5hbWU7XHJcbiAgICAgICAgdGhpcy5sb2FkZWRDYWxsID0gb3B0LmxvYWRlZENhbGw7XHJcblxyXG4gICAgICAgIExvYWRlclRvb2wuYXBwZW5kTWVzaCh0aGlzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6ZSA5q+BXHJcbiAgICAgKiAqIOaJi+WKqOiwg+eUqOaXtu+8jOS8muiHquWKqOS7juaJgOWxniBzY2VuZSDlrp7kvovkuK3np7vpmaRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQgJiYgdGhpcy5yb290SW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RJbXBsLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlQXBwZW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXmiJDlip/lkI7osIPnlKhcclxuICAgICAqICog55Sx5Yqg6L295qih5Z2X6LCD55SoIC0gTG9hZFRvb2xzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBlbmVkID0gKHNjZW5lOiBCQUJZTE9OLlNjZW5lKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVkQ2FsbCAmJiB0aGlzLmxvYWRlZENhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog5a+85YWl55qE6Z2e5Zy65pmv57G75qih5Z6LXHJcbiAqICog6aG555uu5bGCIOWwgeijheeahCDmqKHlnovmlbDmja7nu5PmnoTvvIzlpITnkIYg6YC76L6R55qE5ZCM5q2l5pON5L2cIOWcqCDliqDovb3nmoTlvILmraXov4fnqIsg5Lit55qE5a6J5YWoXHJcbiAqICog5o6n5Yi2IOWKqOeUu+WIh+aNolxyXG4gKiAqIOaOp+WItiDmqKHlnosg6ZmE5YqgIOS4jiDooqvpmYTliqBcclxuICogKiDmjqfliLYg5qih5Z6LIOWPmOaNoiAtIOaXi+i9rCDnvKnmlL4gcHlcclxuICogKiDmjqfliLYg5qih5Z6LIOmAu+i+kemHiuaUvlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEluc2VydE1vZGVsT2JqIGltcGxlbWVudHMgSU1vZGVsSW5zdGFuY2Uge1xyXG4gICAgcHVibGljIGltcGw6IEJBQllMT04uTWVzaCB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyByb290SW1wbDogQkFCWUxPTi5NZXNoIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHJvb3Q6IEluc2VydE1vZGVsT2JqIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGlzRGlzcG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0xvYWRlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAvKipcclxuICAgICAqIOeItuiKgueCuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGFyZW50OiBJbnNlcnRNb2RlbE9iaiB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBsaW5rVUk6IEJBQllMT04uR1VJLkNvbnRyb2wgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgcG9zaXRpb246IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBzY2FsZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHJvdGF0ZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGxvb2tBdDogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGlzVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGFuaW1PcHQ6IElNb2RlbEFuaW1PcHQgfCB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIOWvvOWFpeeahOWKqOeUu+aYr+WQpum7mOiupOaSreaUvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYW5pbURlZmF1bHQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRDtcclxuICAgIHB1YmxpYyByZWFkb25seSByYXlJRDogbnVtYmVyO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyByZWFkb25seSBtb2RlbE5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBpbnNlcnRlZENhbGw6ICgobW9kZWw6IEluc2VydE1vZGVsT2JqKSA9PiBhbnkpIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG1lc2hNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uTWVzaD4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2tlbGV0b25NYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uU2tlbGV0b24+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGFuaW1hdGlvbk1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5BbmltYXRpb25Hcm91cD4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGFydGljbGVTeXNNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uUGFydGljbGVTeXN0ZW0+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dGFjaE9wdExpc3Q6IChJTW9kZWxBdHRhY2hPcHQgfCB1bmRlZmluZWQpW10gPSBbXTtcclxuICAgIHB1YmxpYyByZWFkb25seSBjaGlsZE9wdExpc3Q6IElNb2RlbENoaWxkT3B0W10gPSBbXTtcclxuICAgIC8qKlxyXG4gICAgICog5Yqo55S75omn6KGM57uT5p2f55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbUVuZENCOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5b2T5YmN5Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3liqjnlLvmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc0FuaW1hdGlvbkxvb3A6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBnZXQgaXNSZWFkeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsICYmIHRoaXMuaW1wbC5pc1JlYWR5O1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IobWVzaE5hbWU6IHN0cmluZywgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRCwgb3B0OiBJTW9kZWxPcHQgPSA8YW55Pnt9KSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZSAgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLm5hbWUgICA9IG1lc2hOYW1lO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gb3B0LnBhcmVudDtcclxuICAgICAgICB0aGlzLnJheUlEICA9IG9wdC5yYXlJRCB8fCAtMTtcclxuICAgICAgICB0aGlzLnBhdGggICA9IG9wdC5wYXRoIHx8ICcnO1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVOYW1lICAgICAgID0gb3B0LmZpbGVOYW1lO1xyXG4gICAgICAgIHRoaXMubW9kZWxOYW1lICAgICAgPSBvcHQubW9kZWxOYW1lO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0ZWRDYWxsICAgPSBvcHQuaW5zZXJ0ZWRDYWxsO1xyXG4gICAgICAgIHRoaXMuYW5pbURlZmF1bHQgICAgPSAhIW9wdC5hbmltRGVmYXVsdDtcclxuXHJcbiAgICAgICAgaWYgKCFvcHQuaXNFZmZlY3QpIHtcclxuICAgICAgICAgICAgTG9hZGVyVG9vbC5sb2FkTWVzaCh0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMb2FkZXJUb29sLmxvYWRFZmZlY3QodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGRpc3Bvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwb3NlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbk1hcC5jbGVhcigpO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkT3B0TGlzdC5mb3JFYWNoKChvcHQpID0+IHtcclxuICAgICAgICAgICAgb3B0LmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5tb2RlbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0Lm1lc2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgb3B0Lm1lc2guZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0Lmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEltcGwgJiYgdGhpcy5yb290SW1wbC5kaXNwb3NlKGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbCAmJiAodGhpcy5yb290SW1wbC5wYXJlbnQgPSBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWVzaE1hcC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25NYXAuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRpb24gID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucGFyZW50ICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnJvb3QgICAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb290SW1wbCAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaW1wbCAgICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxvb2tBdCAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUgICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnNjYWxlICAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5saW5rVUkgICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0ZWRDYWxsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgcHVibGljIGxvYWRlZCA9IChhbWVzaGVzOiBCQUJZTE9OLkFic3RyYWN0TWVzaFtdLCBwYXJ0aWNsZVN5c3RlbXM6IEJBQllMT04uSVBhcnRpY2xlU3lzdGVtW10sIHNrZWxldG9uczogQkFCWUxPTi5Ta2VsZXRvbltdLCBhbmltYXRpb25Hcm91cHM6IEJBQllMT04uQW5pbWF0aW9uR3JvdXBbXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1lc2hlcyA9IDxCQUJZTE9OLk1lc2hbXT5hbWVzaGVzO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3Bvc2VkKSB7XHJcbiAgICAgICAgICAgIG1lc2hlc1swXS5kaXNwb3NlKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkICAgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3RJbXBsICAgPSBtZXNoZXNbMF07XHJcbiAgICAgICAgdGhpcy5pbXBsICAgICAgID0gbWVzaGVzWzFdO1xyXG5cclxuICAgICAgICB0aGlzLmltcGwuYW5pbWF0aW9ucy5mb3JFYWNoKChhbmltKSA9PiB7XHJcbiAgICAgICAgICAgIGFuaW0uZnJhbWVQZXJTZWNvbmQgPSAyMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1lc2hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG1lc2hlcy5mb3JFYWNoKChtZXNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2hNYXAuc2V0KG1lc2guaWQsIG1lc2gpO1xyXG4gICAgICAgICAgICAgICAgKDxhbnk+bWVzaCkucmF5SUQgPSB0aGlzLnJheUlEO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRpb25Hcm91cHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbkdyb3Vwc1swXTtcclxuICAgICAgICAgICAgYW5pbWF0aW9uR3JvdXBzLmZvckVhY2goKGFuaW1Hcm91cCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuc2V0KGFuaW1Hcm91cC5uYW1lLCBhbmltR3JvdXApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChza2VsZXRvbnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBza2VsZXRvbnMuZm9yRWFjaCgoc2tlbGV0b24pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tlbGV0b25NYXAuc2V0KHNrZWxldG9uLmlkLCBza2VsZXRvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcnRpY2xlU3lzdGVtcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlU3lzdGVtcy5mb3JFYWNoKChwYXJ0aWNsZVN5cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c01hcC5zZXQocGFydGljbGVTeXMuaWQsIDxCQUJZTE9OLlBhcnRpY2xlU3lzdGVtPnBhcnRpY2xlU3lzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVBvc3Rpb24oKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVNjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VSb3RhdGUoKTtcclxuICAgICAgICB0aGlzLmNoYW5nZUxpbmtVSSgpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlTG9va0F0KCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXR0YWNoKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBdHRhY2hPcHQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNoaWxkT3B0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFuaW1EZWZhdWx0ICYmIGFuaW1hdGlvbkdyb3Vwc1swXSkge1xyXG4gICAgICAgICAgICBhbmltYXRpb25Hcm91cHNbMF0uc3RhcnQoITApO1xyXG4gICAgICAgIH0gZWxzZSAgaWYgKCF0aGlzLmFuaW1EZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQW5pbSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5zZXJ0ZWRDYWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0ZWRDYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBhbmltRW5kQ2FsbCA9ICgpID0+IHtcclxuICAgICAgICAvLyBpZiAodGhpcy5pc0FuaW1hdGlvbkxvb3AgPT09IHRydWUpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5hbmltYXRpb24ucGxheSgpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbUVuZENCICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltRW5kQ0IoKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltRW5kQ0IgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldEF0dGFjaChvcHQ6IElNb2RlbEF0dGFjaE9wdCkge1xyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5wdXNoKG9wdCk7XHJcblxyXG4gICAgICAgIGlmIChvcHQubW9kZWxPcHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHQubW9kZWxPcHQuaW5zZXJ0ZWRDYWxsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3B0Lm1lc2ggPSBvcHQubW9kZWwgJiYgb3B0Lm1vZGVsLnJvb3RJbXBsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgb3B0Lm1vZGVsID0gdGhpcy5zY2VuZS5pbnNlcnRNZXNoKG9wdC5uYW1lLCBvcHQubW9kZWxPcHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0Lm1lc2ggPSBvcHQubW9kZWwucm9vdEltcGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHQubWVzaCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldENoaWxkTW9kZWxPcHQob3B0OiBJTW9kZWxDaGlsZE9wdCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0LnB1c2gob3B0KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdC5tb2RlbE9wdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdC5tb2RlbE9wdC5pbnNlcnRlZENhbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9wdC5zdWNjZXNzQ2FsbCAmJiBvcHQuc3VjY2Vzc0NhbGwob3B0KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdC5tb2RlbCA9IHRoaXMuc2NlbmUuaW5zZXJ0TWVzaChvcHQubmFtZSwgb3B0Lm1vZGVsT3B0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNoaWxkT3B0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRQb3N0aW9uKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQb3N0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFNjYWxlKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTY2FsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRSb3RhdGUoZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUgPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSb3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0TGlua1VJKG5vZGU6IEJBQllMT04uR1VJLkNvbnRyb2wpIHtcclxuICAgICAgICB0aGlzLmxpbmtVSSA9IG5vZGU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VMaW5rVUkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0TG9va0F0KGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMubG9va0F0ID0gW2RhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl1dO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlTG9va0F0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFZpc2libGUoZGF0YTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gZGF0YTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVZpc2libGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0QW5pbShhbmltT3B0OiBJTW9kZWxBbmltT3B0KSB7XHJcbiAgICAgICAgdGhpcy5hbmltT3B0ID0gYW5pbU9wdDtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW0oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RvcEFuaW0oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltT3B0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBwYXVzZUFuaW0oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXVzZUFuaW1hdGlvbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbU9wdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZVBvc3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24gJiYgdGhpcy5yb290SW1wbCkge1xyXG4gICAgICAgICAgICBOb2RlVG9vbHMucG9zaXROb2RlKDxJVHJhbnNmb3JtT2JqMj50aGlzLnJvb3RJbXBsLCB0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZVNjYWxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNjYWxlICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgTm9kZVRvb2xzLnNjYWxlTm9kZSg8SVRyYW5zZm9ybU9iajI+dGhpcy5yb290SW1wbCwgdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VSb3RhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucm90YXRlICYmIHRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICBOb2RlVG9vbHMucm90YXRlTm9kZSg8SVRyYW5zZm9ybU9iajI+dGhpcy5pbXBsLCB0aGlzLnJvdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VMb29rQXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9va0F0ICYmIHRoaXMuaW1wbCkge1xyXG4gICAgICAgICAgICBOb2RlVG9vbHMubm9kZUxvb2tBdCg8QkFCWUxPTi5NZXNoPnRoaXMuaW1wbCwgdGhpcy5sb29rQXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlTGlua1VJKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxpbmtVSSAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGlua1VJLmxpbmtXaXRoTWVzaCh0aGlzLnJvb3RJbXBsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZVZpc2libGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yb290SW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RJbXBsLmlzVmlzaWJsZSA9IHRoaXMuaXNWaXNpYmxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlQXR0YWNoT3B0KCkge1xyXG4gICAgICAgIGxldCB1c2VDb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IHRlbXBJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld0xpc3RMZW4gPSAwO1xyXG4gICAgICAgIGNvbnN0IGxpc3RMZW4gPSB0aGlzLmF0dGFjaE9wdExpc3QubGVuZ3RoO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBsZW4gPSBsaXN0TGVuIC0gMTsgbGVuID49IDA7IGxlbi0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9IHRoaXMuYXR0YWNoT3B0TGlzdFtsZW5dO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdCAmJiBvcHQubWVzaCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBza2VsZXRvbiA9IHRoaXMuc2tlbGV0b25NYXAuZ2V0KG9wdC5za2VsZXRvbk5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChza2VsZXRvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9uZUluZGV4ID0gc2tlbGV0b24uZ2V0Qm9uZUluZGV4QnlOYW1lKG9wdC5ib25lTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvbmVJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5tZXNoLmF0dGFjaFRvQm9uZShza2VsZXRvbi5ib25lc1tib25lSW5kZXhdLCA8QkFCWUxPTi5NZXNoPnRoaXMucm9vdEltcGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb2RlVG9vbHMubm9kZVRyYW5zZm9ybShvcHQubWVzaCwgb3B0LnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdFtsZW5dID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdXNlQ291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3TGlzdExlbiA9IGxpc3RMZW4gLSB1c2VDb3VudDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgayA9IGxpc3RMZW4gLSB1c2VDb3VudDsgaSA8IGs7IGkrKykge1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5hdHRhY2hPcHRMaXN0W3RlbXBJbmRleF0gPT09IHVuZGVmaW5lZCAmJiB0ZW1wSW5kZXggPCBsaXN0TGVuKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wSW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYXR0YWNoT3B0TGlzdFt0ZW1wSW5kZXhdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdFtpXSA9IHRoaXMuYXR0YWNoT3B0TGlzdFt0ZW1wSW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmF0dGFjaE9wdExpc3QubGVuZ3RoID0gbmV3TGlzdExlbjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlQ2hpbGRPcHQoKSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZE9wdExpc3QuZm9yRWFjaCgob3B0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvcHQgJiYgb3B0LmlzRmluaXNoZWQgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHQubW9kZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQubW9kZWwucm9vdEltcGwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5tb2RlbC5yb290SW1wbC5wYXJlbnQgPSA8QkFCWUxPTi5NZXNoPnRoaXMucm9vdEltcGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVUb29scy5ub2RlVHJhbnNmb3JtKG9wdC5tb2RlbC5yb290SW1wbCwgb3B0LnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHQubWVzaCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LmlzRmluaXNoZWQgID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHQubWVzaC5wYXJlbnQgPSA8QkFCWUxPTi5NZXNoPnRoaXMucm9vdEltcGw7XHJcbiAgICAgICAgICAgICAgICAgICAgTm9kZVRvb2xzLm5vZGVUcmFuc2Zvcm0ob3B0Lm1lc2gsIG9wdC50cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZUF0dGFjaCgpIHtcclxuICAgICAgICAvL1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VBbmltKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLmFuaW1PcHQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VBbmltYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOabtOaUueaooeWei+WKqOeUu1xyXG4gICAgICogQHBhcmFtIGFuaW1OYW1lIOebruagh+WKqOeUu+WQjeensFxyXG4gICAgICogQHBhcmFtIGlzTG9vcCDmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAqIEBwYXJhbSBzdG9wRmxhZyDliqjnlLvlgZzmraLphY3nva5cclxuICAgICAqIEBwYXJhbSBlbmRDYWxsIOWKqOeUu+e7k+adn+Wbnuiwg1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNoYW5nZUFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5hbmltT3B0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwZWVkICAgICA9IHRoaXMuYW5pbU9wdC5zcGVlZCA9PT0gdW5kZWZpbmVkID8gMSA6IHRoaXMuYW5pbU9wdC5zcGVlZDtcclxuICAgICAgICAgICAgY29uc3QgYW5pbU5hbWUgID0gdGhpcy5hbmltT3B0LmFuaW1OYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBlbmRDYWxsICAgPSB0aGlzLmFuaW1PcHQuZW5kQ2FsbDtcclxuICAgICAgICAgICAgY29uc3QgaXNMb29wICAgID0gdGhpcy5hbmltT3B0LmlzTG9vcDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1Hcm91cCA9IHRoaXMuYW5pbWF0aW9uTWFwLmdldChhbmltTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5pbUdyb3VwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmltR3JvdXAuaXNTdGFydGVkICYmIGlzTG9vcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHthbmltTmFtZX0g5Yqo55S75bey57uP5omn6KGM77yBYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbUdyb3VwLm9uQW5pbWF0aW9uR3JvdXBFbmRPYnNlcnZhYmxlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbUdyb3VwLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBhbmltR3JvdXAub25BbmltYXRpb25Hcm91cEVuZE9ic2VydmFibGUuYWRkKHRoaXMuYW5pbUVuZENhbGwpO1xyXG4gICAgICAgICAgICAgICAgYW5pbUdyb3VwLnN0YXJ0KGlzTG9vcCwgc3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYW5pbU9wdC5nb0VuZCkgeyAgICAgICAvLyDmmK/lkKbot7PovazliLDliqjnlLvmnIDlkI7kuIDluKco6Z2e5b6q546v5Yqo55S76K6+572uKVxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Hcm91cC5nb1RvRnJhbWUoYW5pbUdyb3VwLnRvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHthbmltTmFtZX0g5Yqo55S75LiN5a2Y5Zyo77yBYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUVuZENCID0gZW5kQ2FsbDtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBhbmltR3JvdXA7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBbmltYXRpb25Mb29wID0gaXNMb29wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0b3BBbmltYXRpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uICYmIHRoaXMuYW5pbWF0aW9uLmlzU3RhcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXVzZUFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiAmJiB0aGlzLmFuaW1hdGlvbi5wYXVzZSgpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOWcuuaZr+aVsOaNrue7k+aehCAtIOmrmOWxglxyXG4gKi9cclxuaW1wb3J0IHsgTm9kZVRvb2xzIH0gZnJvbSAnLi9zY2VuZV90b29sJztcclxuaW1wb3J0IHsgSW5zZXJ0TW9kZWxPYmosIEFwcGVuZE1vZGVsT2JqIH0gZnJvbSAnLi9tb2RlbF9pbnN0YW5jZSc7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8qKlxyXG4gKiDpobnnm67moYbmnrbkuIsgLSDlnLrmma/kuK3mlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmUzREV2ZW50SW5mbyB7XHJcbiAgICBlOiBCQUJZTE9OLlBvaW50ZXJJbmZvO1xyXG4gICAgczogQkFCWUxPTi5FdmVudFN0YXRlO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBDQU1FUkFUWVBFUyB7XHJcbiAgICBBcmNSb3RhdGVDYW1lcmEgPSAnQXJjUm90YXRlQ2FtZXJhJyxcclxuICAgIFVuaXZlcnNhbENhbWVyYSA9ICdVbml2ZXJzYWxDYW1lcmEnLFxyXG4gICAgVGFyZ2V0Q2FtZXJhID0gJ1RhcmdldENhbWVyYSdcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVuZGVyRmxhZ3Mge1xyXG4gICAgYWN0aXZlID0gJ2FjdGl2ZScsXHJcbiAgICBwYXVzZSA9ICdwYXVzZScsXHJcbiAgICBkaXNwb3NlID0gJ2Rpc3Bvc2UnXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIExJR0hUVFlQRVMge1xyXG4gICAgSGVtaXNwaGVyaWNMaWdodCA9ICdIZW1pc3BoZXJpY0xpZ2h0J1xyXG59XHJcblxyXG5leHBvcnQgbGV0IFJlc1BhdGggICAgICA9ICdnYW1lL2FwcC9zY2VuZV9yZXMvcmVzLyc7XHJcbmV4cG9ydCBsZXQgU2NlbmVSZXNQYXRoID0gJ3NjZW5lcy8nO1xyXG5leHBvcnQgbGV0IE1vZGVsUmVzUGF0aCA9ICdtb2RlbHMvJztcclxuZXhwb3J0IGxldCBOb2RlUmVzUGF0aCAgPSAnbW9kZWxzLyc7XHJcbmV4cG9ydCBsZXQgRWZmZWN0UmVzUGF0aCA9ICdlZmZlY3RzLyc7XHJcblxyXG4vKipcclxuICog5Zy65pmv5YaF5Y+v5YGa5Y+Y5o2i55qE5a+56LGh57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2Zvcm1PYmoge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnlrprkvY1cclxuICAgICAqL1xyXG4gICAgcG9zaXRpb24/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rFxyXG4gICAgICovXHJcbiAgICByb3RhdGlvbj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxpbmc/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlnLrmma/lhoXlj6/lgZrlj5jmjaLnmoTlr7nosaHnu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zZm9ybU9iajIge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnlrprkvY1cclxuICAgICAqL1xyXG4gICAgcG9zaXRpb24/OiBCQUJZTE9OLlZlY3RvcjM7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rFxyXG4gICAgICovXHJcbiAgICByb3RhdGlvbj86IEJBQllMT04uVmVjdG9yMztcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxpbmc/OiBCQUJZTE9OLlZlY3RvcjM7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rOWbm+WFg+aVsFxyXG4gICAgICovXHJcbiAgICByb3RhdGlvblF1YXRlcm5pb24/OiBCQUJZTE9OLlF1YXRlcm5pb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAzRCDoioLngrnlj5jmjaLphY3nva5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zZm9ybUNmZyB7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueWumuS9jVxyXG4gICAgICovXHJcbiAgICBwb3NpdGlvbj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55peL6L2sXHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZT86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxlPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG59XHJcblxyXG4vKipcclxuICog5qih5Z6L5pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbEluc3RhbmNlIGV4dGVuZHMgSVRyYW5zZm9ybU9iaiB7XHJcbiAgICByYXlJRDogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOWQjeensFxyXG4gICAgICovXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg6LWE5rqQ5a2Q6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIHBhdGg6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDmlofku7blkI3np7BcclxuICAgICAqL1xyXG4gICAgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDmlofku7bkuK3mqKHlnovlkI3np7BcclxuICAgICAqL1xyXG4gICAgbW9kZWxOYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg6LWE5rqQ5Yqg6L295oiQ5Yqf5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGxvYWRlZENhbGw/OiBGdW5jdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDliqDovb3miJDlip/lm57osINcclxuICAgICAqL1xyXG4gICAgaW5zZXJ0ZWRDYWxsPzogRnVuY3Rpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovliqDovb3phY3nva7mlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsT3B0IHtcclxuICAgIC8qKlxyXG4gICAgICog54i26IqC54K5XHJcbiAgICAgKi9cclxuICAgIHBhcmVudD86IEluc2VydE1vZGVsT2JqO1xyXG4gICAgLyoqXHJcbiAgICAgKiByYXlJRFxyXG4gICAgICovXHJcbiAgICByYXlJRD86IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog6KaB5Yqg6L2955qE5qih5Z6L5ZCN56ewXHJcbiAgICAgKiAqIOe+juacr+i1hOa6kChHTFRGKSDkuK3lrprkuYnnmoTmqKHlnovlkI3np7BcclxuICAgICAqL1xyXG4gICAgbW9kZWxOYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOimgeWKoOi9veeahOaooeWei+WcqOaJgOWxnui1hOa6kOeuoeeQhui3r+W+hOS4i+eahOWtkOi3r+W+hFxyXG4gICAgICogKiDotYTmupDmlofku7blrZDot6/lvoRcclxuICAgICAqL1xyXG4gICAgcGF0aD86IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6KaB5Yqg6L2955qE5qih5Z6L55qE6LWE5rqQ5paH5Lu25ZCN56ewXHJcbiAgICAgKiAqIOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICovXHJcbiAgICBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgb25seVVzZVJvb3Q/OiBib29sZWFuO1xyXG4gICAgaXNFZmZlY3Q/OiBib29sZWFuO1xyXG4gICAgYW5pbURlZmF1bHQ/OiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3miJDlip/nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgbG9hZGVkQ2FsbD8obW9kZWw6IEFwcGVuZE1vZGVsT2JqKTogYW55O1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3miJDlip/nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgaW5zZXJ0ZWRDYWxsPyhtb2RlbDogSW5zZXJ0TW9kZWxPYmopOiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovnmoQg5a2QIOaooeWei+WKoOi9veaVsOaNrue7k+aehFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJTW9kZWxDaGlsZE9wdCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOaooeWei+WKoOi9veWPguaVsFxyXG4gICAgICovXHJcbiAgICBtb2RlbE9wdD86IElNb2RlbE9wdDtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6LXHJcbiAgICAgKi9cclxuICAgIG1vZGVsPzogSW5zZXJ0TW9kZWxPYmo7XHJcbiAgICAvKipcclxuICAgICAqIE1FU0hcclxuICAgICAqL1xyXG4gICAgbWVzaD86IEJBQllMT04uTWVzaDtcclxuICAgIC8qKlxyXG4gICAgICog5Y+Y5o2i6K6+572uXHJcbiAgICAgKi9cclxuICAgIHRyYW5zZm9ybT86IElUcmFuc2Zvcm1DZmc7XHJcbiAgICAvKipcclxuICAgICAqIOmZhOWKoOaIkOWKn+agh+ivhlxyXG4gICAgICovXHJcbiAgICBpc0ZpbmlzaGVkPzogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICog5Yqg6LyJ5aW955qE5YuV55Wr54uA5oWLXHJcbiAgICAgKi9cclxuICAgIGlzTG9vcD86IGJvb2xlYW47XHJcblxyXG4gICAgc3VjY2Vzc0NhbGw/KE9QVDogSU1vZGVsQ2hpbGRPcHQpOiB2b2lkO1xyXG59XHJcblxyXG4vKipcclxuICog5qih5Z6L55qEIOmZhOWKoDzpmYTliqDkuo7kuIDkuKrmqKHlnovkuIo+IOaVsOaNrue7k+aehFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJTW9kZWxBdHRhY2hPcHQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnovliqDovb3lj4LmlbBcclxuICAgICAqL1xyXG4gICAgbW9kZWxPcHQ/OiBJTW9kZWxPcHQ7XHJcbiAgICAvKipcclxuICAgICAqIOaooeWei1xyXG4gICAgICovXHJcbiAgICBtb2RlbD86IEluc2VydE1vZGVsT2JqO1xyXG4gICAgLyoqXHJcbiAgICAgKiBNRVNIXHJcbiAgICAgKi9cclxuICAgIG1lc2g/OiBCQUJZTE9OLk1lc2g7XHJcbiAgICAvKipcclxuICAgICAqIOmZhOWKoOWIsOebruaghyBza2VsZXRvblxyXG4gICAgICovXHJcbiAgICBza2VsZXRvbk5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6ZmE5Yqg5Yiw55uu5qCHIOmqqOWktFxyXG4gICAgICovXHJcbiAgICBib25lTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5jmjaLorr7nva5cclxuICAgICAqL1xyXG4gICAgdHJhbnNmb3JtPzogSVRyYW5zZm9ybUNmZztcclxufVxyXG5cclxuLyoqXHJcbiAqIOaooeWei+WKqOeUu+mFjee9riDmlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsQW5pbU9wdCB7XHJcbiAgICAvKipcclxuICAgICAqIOebruagh+WKqOeUu+WQjeensFxyXG4gICAgICovXHJcbiAgICBhbmltTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBnb0VuZD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuW+queOr+aSreaUvlxyXG4gICAgICovXHJcbiAgICBpc0xvb3A6IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOWKqOeUu+e7k+adn+eKtuaAgVxyXG4gICAgICovXHJcbiAgICBzdG9wRmxhZz86IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog5Yqo55S757uT5p2f5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGVuZENhbGw/OiBGdW5jdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICog5Yqo55S76YCf5bqmXHJcbiAgICAgKi9cclxuICAgIHNwZWVkPzogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbopoHlgZzmraLliY3kuIDkuKrliqjnlLtcclxuICAgICAqL1xyXG4gICAgbmVlZFN0b3A/OiBib29sZWFuO1xyXG59IiwiaW1wb3J0IHsgUmVuZGVyRmxhZ3MsIElNb2RlbE9wdCB9IGZyb20gXCIuL3NjZW5lX2Jhc2VcIjtcclxuaW1wb3J0IHsgSW5zZXJ0TW9kZWxPYmosIEFwcGVuZE1vZGVsT2JqIH0gZnJvbSBcIi4vbW9kZWxfaW5zdGFuY2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2VuZUluc3RhbmNlIHtcclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2NlbmU6IEJBQllMT04uU2NlbmU7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcclxuICAgIHByaXZhdGUgX3JlbmRlckZsYWc6IFJlbmRlckZsYWdzO1xyXG4gICAgcHJpdmF0ZSBfY2FtZXJhOiBCQUJZTE9OLkNhbWVyYSB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5YaF5riy5p+T5YWJ6KGoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlnaHRNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uTGlnaHQ+ID0gbmV3IE1hcCgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlnLrmma/lhoXnm7jmnLrooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNhbWVyYU1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5DYW1lcmE+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZW5naW5lOiBCQUJZTE9OLkVuZ2luZSwgb3B0PzogQkFCWUxPTi5TY2VuZU9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm5hbWUgICA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBlbmdpbmU7XHJcbiAgICAgICAgdGhpcy5zY2VuZSAgPSBuZXcgQkFCWUxPTi5TY2VuZShlbmdpbmUsIG9wdCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhTWFwICAgICAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyAgICA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZExpZ2h0KGxuYW1lOiBzdHJpbmcsIGxpZ2h0OiBCQUJZTE9OLkxpZ2h0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGlnaHRNYXAuZ2V0KGxuYW1lKSkge1xyXG4gICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5saWdodE1hcC5zZXQobG5hbWUsIGxpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlTGlnaHQobG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmxpZ2h0TWFwLmdldChsbmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5saWdodE1hcC5kZWxldGUobG5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVhZExpZ2h0KGxuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saWdodE1hcC5nZXQobG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBhY3RpdmVDYW1lcmEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbWVyYTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgYWN0aXZlQ2FtZXJhKGNhbWVyYTogQkFCWUxPTi5DYW1lcmEgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hY3RpdmVDYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByZW5kZXJGbGFnKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJGbGFnO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCByZW5kZXJGbGFnKGZsYWc6IFJlbmRlckZsYWdzKSB7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyA9IGZsYWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2ZU9ic2VydmVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihgU2NlbmUgJHt0aGlzLm5hbWV9IGFjdGl2ZSFgKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkaXNwb3NlT2JzZXJ2ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBTY2VuZSAke3RoaXMubmFtZX0gZGlzcG9zZSFgKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGFuZ2VDYW1lcmFPYnNlcnZlciA9IChjYW1lcmE6IEJBQllMT04uQ2FtZXJhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFNjZW5lICR7dGhpcy5uYW1lfSBjYW1lcmEgY2hhbmdlOiAke2NhbWVyYS5uYW1lfWApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZUNhbWVyYU9ic2VydmVyID0gKGNhbWVyYTogQkFCWUxPTi5DYW1lcmEpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgU2NlbmUgJHt0aGlzLm5hbWV9IGNhbWVyYSBjaGFuZ2U6ICR7Y2FtZXJhLm5hbWV9YCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruW9k+WJjea0u+WKqOebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYU5hbWUg55uu5qCH55u45py65ZCN56ewXHJcbiAgICAgKiAqIOWcqOWcuuaZr+WGhemDqOebuOacuuihqOS4reafpeaJvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QWN0aXZlQ2FtZXJhKGNhbWVyYU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuY2FtZXJhTWFwLmdldChjYW1lcmFOYW1lKTtcclxuICAgICAgICBpZiAoISFjYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYW1lcmEgPSBjYW1lcmE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUNhbWVyYU9ic2VydmVyKHRoaXMuYWN0aXZlQ2FtZXJhKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIChGb3JtYXRDYW52YXNEaXNwbGF5LmdldElzV2VpeGluR0FNRSgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDYW1lcmFUb29sLmNvbXB1dGVWaWV3UG9ydChjYW1lcmEpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBTY2VuZVN0cnVjdC5zZXRDdXJyQ2FtZXJh77ya55uu5qCH5Zy65pmv5rKh5pyJTmFtZeS4uiR7Y2FtZXJhTmFtZX3nmoTnm7jmnLpgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgeebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYU5hbWUg55uu5qCH55u45py65ZCN56ewXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVDYW1lcmEoY2FtZXJhTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdGhpcy5jYW1lcmFNYXAuZ2V0KGNhbWVyYU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoY2FtZXJhICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNhbWVyYSA9PT0gY2FtZXJhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNhbWVyYU9ic2VydmVyKGNhbWVyYSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUNhbWVyYSAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGbGFnICAgICA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbWVyYU1hcC5kZWxldGUoY2FtZXJhTmFtZSk7XHJcbiAgICAgICAgICAgIGNhbWVyYS5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDnm7jmnLpcclxuICAgICAqIEBwYXJhbSBjYW1lcmEg55uu5qCH55u45py65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDYW1lcmEoY2FtZXJhOiBCQUJZTE9OLkNhbWVyYSkge1xyXG4gICAgICAgIHRoaXMuY2FtZXJhTWFwLnNldChjYW1lcmEubmFtZSwgY2FtZXJhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGlja0NhbGwgPSAoZTogQkFCWUxPTi5Qb2ludGVySW5mbywgczogQkFCWUxPTi5FdmVudFN0YXRlKSA9PiB7XHJcbiAgICAgICAgLy9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFJlbmRlckZsYWdzLmRpc3Bvc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY2FtZXJhTWFwLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcG9zZU9ic2VydmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmoLlgZzmuLLmn5NcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdXNlID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgICAgIHRoaXMuc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5yZW1vdmVDYWxsYmFjayh0aGlzLnBpY2tDYWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa/gOa0u+a4suafk1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZlID0gKCkgPT4ge1xyXG4gICAgICAgIC8vIOacqumUgOavgVxyXG4gICAgICAgIGlmICh0aGlzLnJlbmRlckZsYWcgIT09IFJlbmRlckZsYWdzLmRpc3Bvc2UpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIOacqua/gOa0u1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJGbGFnICE9PSBSZW5kZXJGbGFncy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUmVhZHkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zY2VuZS5vblBvaW50ZXJPYnNlcnZhYmxlLmhhc09ic2VydmVycygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQodGhpcy5waWNrQ2FsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckZsYWcgPSBSZW5kZXJGbGFncy5hY3RpdmU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlT2JzZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGDlnLrmma8gJHt0aGlzLm5hbWV9IOacquWHhuWkh+WujOavle+8jOS4jeiDvea/gOa0u2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihg5Zy65pmvICR7dGhpcy5uYW1lfSDph43lpI3mv4DmtLtgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihg5Zy65pmvICR7dGhpcy5uYW1lfSDlt7LooqvplIDmr4FgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOajgOafpeWcuuaZr+aYr+WQpuWHhuWkh+e7k+adn++8jOWPr+a/gOa0u1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNSZWFkeSgpIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmIHRoaXMuYWN0aXZlQ2FtZXJhICE9PSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTY2VuZUluc3RhbmNlM0QgZXh0ZW5kcyBTY2VuZUluc3RhbmNlIHtcclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5YaFIOWcuuaZr+eOr+Wig+e6p+WIq+iKgueCueihqFxyXG4gICAgICogKiBhcHBlbmQg5pa55byP5Yqg6L2955qEXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXBwZW5kTWVzaE1hcDogTWFwPHN0cmluZywgQXBwZW5kTW9kZWxPYmo+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnNlcnRNZXNoTWFwOiBNYXA8c3RyaW5nLCBJbnNlcnRNb2RlbE9iaj4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcG9pbnRlckRvd25MaXN0ZW5NYXA6ICAgTWFwPEZ1bmN0aW9uLCAoaW5mbzogYW55KSA9PiBhbnk+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJNb3ZlTGlzdGVuTWFwOiAgIE1hcDxGdW5jdGlvbiwgKGluZm86IGFueSkgPT4gYW55PiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwb2ludGVyVXBMaXN0ZW5NYXA6ICAgICBNYXA8RnVuY3Rpb24sIChpbmZvOiBhbnkpID0+IGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcG9pbnRlckNsaWNrTGlzdGVuTWFwOiAgTWFwPEZ1bmN0aW9uLCAoaW5mbzogYW55KSA9PiBhbnk+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+85YWl5Zy65pmv5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gb2JqTmFtZSDmqKHlnovlkb3lkI1cclxuICAgICAqICog55So5LqO6aG555uu5bGC566h55CGXHJcbiAgICAgKiBAcGFyYW0gb3B0IOaooeWei+WKoOi9vemFjee9rlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwZW5kU2NlbmUob2JqTmFtZTogc3RyaW5nLCBvcHQ6IElNb2RlbE9wdCA9IDxhbnk+e30pIHtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IG5ldyBBcHBlbmRNb2RlbE9iaihvYmpOYW1lLCB0aGlzLCBvcHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGVuZE1lc2hNYXAuc2V0KG9iak5hbWUsIG1vZGVsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVBcHBlbmQobW9kZWw6IEFwcGVuZE1vZGVsT2JqKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRNZXNoTWFwLmRlbGV0ZShtb2RlbC5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaPkuWFpeaooeWei1xyXG4gICAgICogQHBhcmFtIG9iak5hbWUg5qih5Z6L5ZG95ZCNXHJcbiAgICAgKiAqIOeUqOS6jumhueebruWxgueuoeeQhlxyXG4gICAgICogQHBhcmFtIG9wdCDmqKHlnovliqDovb3phY3nva5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGluc2VydE1lc2gob2JqTmFtZTogc3RyaW5nLCBvcHQ6IElNb2RlbE9wdCA9IDxhbnk+e30pIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktbG9jYWwtdmFyaWFibGVcclxuICAgICAgICBjb25zdCBtb2RlbCA9IG5ldyBJbnNlcnRNb2RlbE9iaihvYmpOYW1lLCB0aGlzLCBvcHQpO1xyXG5cclxuICAgICAgICB0aGlzLmluc2VydE1lc2hNYXAuc2V0KG9iak5hbWUsIG1vZGVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVJbnNlcnQobW9kZWw6IEluc2VydE1vZGVsT2JqKSB7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRNZXNoTWFwLmRlbGV0ZShtb2RlbC5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRG93bkxpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93bkxpc3Rlbk1hcC5zZXQobGlzdGVuZXIsIGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVEb3duTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJEb3duTGlzdGVuTWFwLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkVXBMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlclVwTGlzdGVuTWFwLnNldChsaXN0ZW5lciwgbGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZVVwTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJVcExpc3Rlbk1hcC5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZE1vdmVMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVMaXN0ZW5NYXAuc2V0KGxpc3RlbmVyLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlTW92ZUxpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZUxpc3Rlbk1hcC5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZENsaWNrTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJDbGlja0xpc3Rlbk1hcC5zZXQobGlzdGVuZXIsIGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVDbGlja0xpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyQ2xpY2tMaXN0ZW5NYXAuZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHtcclxuICAgICAgICBzdXBlci5kaXNwb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwZW5kTWVzaE1hcC5jbGVhcigpO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IElUcmFuc2Zvcm1DZmcsIElUcmFuc2Zvcm1PYmoyIH0gZnJvbSAnLi9zY2VuZV9iYXNlJztcclxuaW1wb3J0IHsgQXBwZW5kTW9kZWxPYmosIEluc2VydE1vZGVsT2JqIH0gZnJvbSAnLi9tb2RlbF9pbnN0YW5jZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgTm9kZVRvb2xzIHtcclxuICAgIC8qKlxyXG4gICAgICog5peL6L2sIE1lc2ggLSDoh6rovaxcclxuICAgICAqIEBwYXJhbSBtZXNoIOebruagh21lc2hcclxuICAgICAqIEBwYXJhbSByb3RhdGUg5peL6L2s5Y+C5pWw77yaIFsgeCwgeSwgeiBdXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRlTm9kZShub2RlOiBJVHJhbnNmb3JtT2JqMiwgcm90YXRlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBpZiAoIW5vZGUucm90YXRpb25RdWF0ZXJuaW9uKSB7XHJcbiAgICAgICAgICAgIG5vZGUucm90YXRpb25RdWF0ZXJuaW9uID0gbmV3IEJBQllMT04uUXVhdGVybmlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTm9kZVRvb2xzLnJvdGF0ZVF1YXRlcm5pb24obm9kZS5yb3RhdGlvblF1YXRlcm5pb24sIHJvdGF0ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOaXi+i9rCBNZXNoIC0g6Ieq6L2sXHJcbiAgICAgKiBAcGFyYW0gcXVhdGVybmlvbiDnm67moIcgUXVhdGVybmlvblxyXG4gICAgICogQHBhcmFtIHJvdGF0ZSDml4vovazlj4LmlbDvvJogWyB4LCB5LCB6IF1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVRdWF0ZXJuaW9uKHF1YXRlcm5pb246IEJBQllMT04uUXVhdGVybmlvbiwgcm90YXRlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICAvLyBZWFpcclxuICAgICAgICBCQUJZTE9OLlF1YXRlcm5pb24uUm90YXRpb25ZYXdQaXRjaFJvbGxUb1JlZihyb3RhdGVbMV0gLSBNYXRoLlBJLCByb3RhdGVbMF0sIC1yb3RhdGVbMl0sIHF1YXRlcm5pb24pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBwb3NpdE5vZGUobm9kZTogSVRyYW5zZm9ybU9iajIsIGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIC8vIG5vZGUucG9zaXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKC1kYXRhWzBdLCBkYXRhWzFdLCAtZGF0YVsyXSk7XHJcbiAgICAgICAgKDxCQUJZTE9OLlZlY3RvcjM+bm9kZS5wb3NpdGlvbikuc2V0KC1kYXRhWzBdLCBkYXRhWzFdLCAtZGF0YVsyXSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlTm9kZShub2RlOiBJVHJhbnNmb3JtT2JqMiwgZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgbm9kZS5zY2FsaW5nID0gbmV3IEJBQllMT04uVmVjdG9yMyhkYXRhWzBdLCBkYXRhWzFdLCAtZGF0YVsyXSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIG5vZGVMb29rQXQobm9kZTogQkFCWUxPTi5NZXNoLCBkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBub2RlLmxvb2tBdChuZXcgQkFCWUxPTi5WZWN0b3IzKGRhdGFbMF0sIGRhdGFbMV0sIC1kYXRhWzJdKSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIG5vZGVUcmFuc2Zvcm0obm9kZTogQkFCWUxPTi5NZXNoLCB0cmFuc2Zvcm06IElUcmFuc2Zvcm1DZmcgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAodHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybS5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgTm9kZVRvb2xzLnBvc2l0Tm9kZSg8SVRyYW5zZm9ybU9iajI+bm9kZSwgdHJhbnNmb3JtLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtLnNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBOb2RlVG9vbHMuc2NhbGVOb2RlKDxJVHJhbnNmb3JtT2JqMj5ub2RlLCB0cmFuc2Zvcm0uc2NhbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBOb2RlVG9vbHMucm90YXRlTm9kZSg8SVRyYW5zZm9ybU9iajI+bm9kZSwgdHJhbnNmb3JtLnJvdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0ZVBvc2l0aW9uKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIGRhdGFbMF0gPSAtZGF0YVswXTtcclxuICAgICAgICBkYXRhWzFdID0gZGF0YVsxXTtcclxuICAgICAgICBkYXRhWzJdID0gLWRhdGFbMl07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0ZVJvdGF0ZShkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBkYXRhWzBdID0gZGF0YVswXTtcclxuICAgICAgICBkYXRhWzFdID0gZGF0YVsxXSAtIE1hdGguUEk7XHJcbiAgICAgICAgZGF0YVsyXSA9IC1kYXRhWzJdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2xhdGVRdWF0ZXJuaW9uKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIGNvbnN0IHF1YXRlcm5pb246IEJBQllMT04uUXVhdGVybmlvbiA9IG5ldyBCQUJZTE9OLlF1YXRlcm5pb24oKTtcclxuICAgICAgICBOb2RlVG9vbHMucm90YXRlUXVhdGVybmlvbihxdWF0ZXJuaW9uLCBkYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHF1YXRlcm5pb247XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0ZVNjYWxlKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIGRhdGFbMF0gPSBkYXRhWzBdO1xyXG4gICAgICAgIGRhdGFbMV0gPSBkYXRhWzFdO1xyXG4gICAgICAgIGRhdGFbMl0gPSAtZGF0YVsyXTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVubmVjZXNzYXJ5LWNsYXNzXHJcbmV4cG9ydCBjbGFzcyBMb2FkZXJUb29sIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgYXBwZW5kTWVzaChtb2RlbDogQXBwZW5kTW9kZWxPYmopIHtcclxuICAgICAgICBjb25zdCBuYW1lICAgICAgPSBtb2RlbC5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhdGggICAgICA9IG1vZGVsLnBhdGg7XHJcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgID0gbW9kZWwuZmlsZU5hbWU7XHJcbiAgICAgICAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lO1xyXG4gICAgICAgIGNvbnN0IHNjZW5lSW1wbCA9IG1vZGVsLnNjZW5lLnNjZW5lO1xyXG5cclxuICAgICAgICAvLyBCQUJZTE9OLlNjZW5lTG9hZGVyLkFwcGVuZChgJHtSZXNQYXRofSR7U2NlbmVSZXNQYXRofSR7cGF0aH1gLCBgJHtmaWxlTmFtZX0uc2NlbmUuZ2x0ZmAsIHNjZW5lSW1wbCwgbW9kZWwuYXBwZW5lZCk7XHJcbiAgICAgICAgQkFCWUxPTi5TY2VuZUxvYWRlci5BcHBlbmRBc3luYyhgJHtwYXRofWAsIGAke2ZpbGVOYW1lfS5nbHRmYCwgc2NlbmVJbXBsKS50aGVuKFxyXG4gICAgICAgICAgICAocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbC5hcHBlbmVkKHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTWVzaChtb2RlbDogSW5zZXJ0TW9kZWxPYmopIHtcclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5zY2VuZTtcclxuXHJcbiAgICAgICAgQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKG1vZGVsTmFtZSwgYCR7cGF0aH1gLCBgJHtmaWxlTmFtZX0uZ2x0ZmAsIHNjZW5lSW1wbCwgbW9kZWwubG9hZGVkKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEVmZmVjdChtb2RlbDogSW5zZXJ0TW9kZWxPYmopIHtcclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5zY2VuZTtcclxuXHJcbiAgICAgICAgQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKG1vZGVsTmFtZSwgYCR7cGF0aH1gLCBgJHtmaWxlTmFtZX0uZ2x0ZmAsIHNjZW5lSW1wbCwgbW9kZWwubG9hZGVkKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJbmRleCB9IGZyb20gXCIuL2FwcC9kZW1vMDAwXCI7XHJcblxyXG5leHBvcnQgY29uc3QgSW5pdE9rID0gKCkgPT4ge1xyXG4gICAgSW5kZXguaW5pdChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJylbMF0pO1xyXG59OyJdfQ==
