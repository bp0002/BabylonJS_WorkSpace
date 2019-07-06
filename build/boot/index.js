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
        const model = this.scene.insertMesh('bee', {
            rayID: 1,
            modelName: null,
            path: '../../resource/model/Bee/',
            /**
             * 要加载的模型的资源文件名称
             * * 资源文件名称
             */
            fileName: 'Bee.babylon',
            /**
             * 加载成功的回调
             */
            insertedCall: (model) => {
                console.warn(`Insert Scuccess.`);
                this.scene.activeCamera = camera;
            }
        });
        model.setPostion([0, 0.1, 0.1]);
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
        BABYLON.SceneLoader.AppendAsync(`${path}`, `${fileName}`, sceneImpl).then((res) => {
            model.appened(res);
        });
    }
    static loadMesh(model) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;
        BABYLON.SceneLoader.ImportMesh(modelName, `${path}`, `${fileName}`, sceneImpl, model.loaded);
    }
    static loadEffect(model) {
        const name = model.name;
        const path = model.path;
        const fileName = model.fileName;
        const modelName = model.modelName;
        const sceneImpl = model.scene.scene;
        BABYLON.SceneLoader.ImportMesh(modelName, `${path}`, `${fileName}`, sceneImpl, model.loaded);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYm9vdC9pbmRleC50cyIsInNyYy9mcm9udC9hcHAvZGVtbzAwMC9pbmRleC50cyIsInNyYy9mcm9udC9iYXNlL2VuZ2luZV9pbnN0YW5jZS50cyIsInNyYy9mcm9udC9iYXNlL21vZGVsX2luc3RhbmNlLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmVfYmFzZS50cyIsInNyYy9mcm9udC9iYXNlL3NjZW5lX2luc3RhbmNlLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmVfdG9vbC50cyIsInNyYy9mcm9udC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSx3Q0FBdUM7QUFFdkMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGFBQU0sQ0FBQyxDQUFDOzs7O0FDRnBELGdFQUE0RDtBQUk1RDs7O0dBR0c7QUFDSCxNQUFhLEtBQUs7SUFJZDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUF5QjtRQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVyQixPQUFPO1FBQ1AsSUFBSSxDQUFDLEtBQUssR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRyxNQUFNLENBQUMsU0FBUyxDQUFD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QUNqRyxDQUFDO0lBQ00sTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFxQjtRQUMxQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDeEIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2xDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRXBDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRyxDQUFDO0NBQ0o7QUFqQ0QsZ0NBaUNDOzs7O0FDMUdELDJDQUFzQztBQUV6QixRQUFBLE1BQU0sR0FBRyxHQUFHLEVBQUU7SUFDdkIsZUFBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBJbml0T2sgfSBmcm9tIFwiLi4vZnJvbnQvbWFpblwiO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBJbml0T2spOyIsImltcG9ydCB7IEVuZ2luZUluc3RhbmNlIH0gZnJvbSBcIi4uLy4uL2Jhc2UvZW5naW5lX2luc3RhbmNlXCI7XHJcbmltcG9ydCB7IFNjZW5lSW5zdGFuY2UzRCwgU2NlbmVJbnN0YW5jZSB9IGZyb20gXCIuLi8uLi9iYXNlL3NjZW5lX2luc3RhbmNlXCI7XHJcbmltcG9ydCB7IEFwcGVuZE1vZGVsT2JqLCBJbnNlcnRNb2RlbE9iaiB9IGZyb20gXCIuLi8uLi9iYXNlL21vZGVsX2luc3RhbmNlXCI7XHJcblxyXG4vKipcclxuICog5Yqf6IO95qih5Z2XXHJcbiAqICog5Li75Yqf6IO977yMYmFieWxvbiAzRCBkZW1vXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSW5kZXgge1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBlbmdpbmU6IEVuZ2luZUluc3RhbmNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2VuZTogU2NlbmVJbnN0YW5jZTNEO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbml7bvvIzliJvlu7rkuIDkuKrnroDljZXnmoTlrozmlbTnmoTlnLrmma/lsZXnpLpcclxuICAgICAqICog55u45py6XHJcbiAgICAgKiAqIOeBr+WFiVxyXG4gICAgICogKiDnkIPkvZNcclxuICAgICAqICog5bmz6Z2iXHJcbiAgICAgKiBAcGFyYW0gY2FudmFzIOebruaghyBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmVuZ2luZSA9IG5ldyBFbmdpbmVJbnN0YW5jZSgnMDAnLCBjYW52YXMpO1xyXG4gICAgICAgIHRoaXMuZW5naW5lLmFjdGl2ZSgpO1xyXG5cclxuICAgICAgICAvLyDliJvlu7rlnLrmma9cclxuICAgICAgICB0aGlzLnNjZW5lICA9IHRoaXMuZW5naW5lLmNyZWF0ZVNjZW5lM0QoJ3Rlc3QnKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IEJBQllMT04uRnJlZUNhbWVyYSgnY2FtZXJhMScsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgNSwgLTEwKSwgdGhpcy5zY2VuZS5zY2VuZSk7XHJcbiAgICAgICAgY2FtZXJhLnNldFRhcmdldChCQUJZTE9OLlZlY3RvcjMuWmVybygpKTtcclxuICAgICAgICBjYW1lcmEuYXR0YWNoQ29udHJvbChjYW52YXMsIHRydWUpO1xyXG4gICAgICAgIC8vIOa3u+WKoOebuOaculxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkQ2FtZXJhKGNhbWVyYSk7XHJcbiAgICAgICAgLy8g6K6+572u5rS75Yqo55u45py6XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hY3RpdmVDYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgLy8g5Y+v5Lul5r+A5rS75Zy65pmvXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hY3RpdmUoKTtcclxuXHJcbiAgICAgICAgLy8g5re75Yqg54Gv5YWJXHJcbiAgICAgICAgY29uc3QgbGlnaHQgPSBuZXcgQkFCWUxPTi5IZW1pc3BoZXJpY0xpZ2h0KCdsaWdodDEnLCBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDEsIDApLCB0aGlzLnNjZW5lLnNjZW5lKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZExpZ2h0KCdsaWdodDEnLCBsaWdodCk7XHJcblxyXG4gICAgICAgIC8vIOa3u+WKoOeQg+S9k1xyXG4gICAgICAgIGNvbnN0IHNwaGVyZSA9IEJBQllMT04uTWVzaC5DcmVhdGVTcGhlcmUoJ3NwaGVyZTEnLCAxNiwgMiwgdGhpcy5zY2VuZS5zY2VuZSk7XHJcbiAgICAgICAgc3BoZXJlLnBvc2l0aW9uLnkgPSAxO1xyXG5cclxuICAgICAgICAvLyDmt7vliqDlubPpnaJcclxuICAgICAgICBjb25zdCBncm91bmQgPSBCQUJZTE9OLk1lc2guQ3JlYXRlR3JvdW5kKCdncm91bmQxJywgNiwgNiwgMiwgdGhpcy5zY2VuZS5zY2VuZSk7XHJcbiAgICAgICAgZ3JvdW5kLnBvc2l0aW9uLnkgPSAwLjE7XHJcblxyXG4gICAgICAgIC8vIHZhciBzY2VuZUluID0gbmV3IEJBQllMT04uU2NlbmVJbnN0cnVtZW50YXRpb24odGhpcy5zY2VuZS5zY2VuZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5zY2VuZS5pbnNlcnRNZXNoKCdiZWUnLCB7XHJcbiAgICAgICAgICAgIHJheUlEOiAxLFxyXG4gICAgICAgICAgICBtb2RlbE5hbWU6IG51bGwsXHJcbiAgICAgICAgICAgIHBhdGg6ICcuLi8uLi9yZXNvdXJjZS9tb2RlbC9CZWUvJyxcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIOimgeWKoOi9veeahOaooeWei+eahOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICAgICAgICAgKiAqIOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZmlsZU5hbWU6ICdCZWUuYmFieWxvbicsXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDliqDovb3miJDlip/nmoTlm57osINcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGluc2VydGVkQ2FsbDogKG1vZGVsOiBJbnNlcnRNb2RlbE9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbnNlcnQgU2N1Y2Nlc3MuYCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFjdGl2ZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBtb2RlbC5zZXRQb3N0aW9uKFswLCAwLjEsIDAuMV0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVFbmdpbmUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFNjZW5lSW5zdGFuY2UsIFNjZW5lSW5zdGFuY2UzRCB9IGZyb20gXCIuL3NjZW5lX2luc3RhbmNlXCI7XHJcbmltcG9ydCB7IFJlbmRlckZsYWdzIH0gZnJvbSBcIi4vc2NlbmVfYmFzZVwiO1xyXG5cclxuLyoqXHJcbiAqIOmhueebruWxgiDlsIHoo4UgRW5naW4g5a6e5L6LXHJcbiAqICog5o6n5Yi2IOW8leaTjuWunuS+i+aYr+WQpiDmuLLmn5NcclxuICogKiDmjqfliLYg5aSa5Zy65pmv55qEIOa4suafk+mhuuW6j1xyXG4gKiAvLyBUT0RPXHJcbiAqICog5o6n5Yi2IOWkmuWcuuaZr+eahCDmuLLmn5PliY3lpITnkIZcclxuICogICAgICAqIOaYr+WQpua4heWxj1xyXG4gKiAgICAgICog5riF5bGP5Y+C5pWwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRW5naW5lSW5zdGFuY2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbmdpbmUg5a6e5L6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBlbmdpbmU6IEJBQllMT04uRW5naW5lO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlkI3np7BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5aSa5Zy65pmv5a6e5L6LIOWghlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2NlbmVNYXA6IE1hcDxzdHJpbmcsIFNjZW5lSW5zdGFuY2U+ID0gbmV3IE1hcCgpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlpJrlnLrmma/nmoTmuLLmn5Ppobrluo/phY3nva5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHJlbmRlclNjZW5lT3JkZXI6IHN0cmluZ1tdID0gW107XHJcbiAgICAvKipcclxuICAgICAqIEVuZ2luZSDlrp7kvovmuLLmn5PnirbmgIFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW5kZXJGbGFnOiBSZW5kZXJGbGFncyA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgY29uc3RydWN0b3IoZW5hbWU6IHN0cmluZywgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMubmFtZSAgID0gZW5hbWU7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlbmRlckxvb3AoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5LiA6Iis5Zy65pmvXHJcbiAgICAgKiBAcGFyYW0gc25hbWUg5Zy65pmv5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0gb3B0IOWcuuaZr+WPguaVsFxyXG4gICAgICogKiDkuI3og73lr7zlhaXmqKHlnotcclxuICAgICAqICog5LiN6IO95o+S5YWl5qih5Z6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcmVhdGVTY2VuZShzbmFtZTogc3RyaW5nLCBvcHQ/OiBCQUJZTE9OLlNjZW5lT3B0aW9ucykge1xyXG4gICAgICAgIGxldCBzY2VuZTogU2NlbmVJbnN0YW5jZSA9IDxTY2VuZUluc3RhbmNlPnRoaXMuc2NlbmVNYXAuZ2V0KHNuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCFzY2VuZSkge1xyXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBTY2VuZUluc3RhbmNlKHNuYW1lLCB0aGlzLmVuZ2luZSwgb3B0KTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZU1hcC5zZXQoc25hbWUsIHNjZW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu6IDNEIOWcuuaZr1xyXG4gICAgICogQHBhcmFtIHNuYW1lIOWcuuaZr+WQjeensFxyXG4gICAgICogQHBhcmFtIG9wdCDlnLrmma/lj4LmlbBcclxuICAgICAqICog5q2j5bi455qEIDNEIOWKn+iDvVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlU2NlbmUzRChzbmFtZTogc3RyaW5nLCBvcHQ/OiBCQUJZTE9OLlNjZW5lT3B0aW9ucykge1xyXG4gICAgICAgIGxldCBzY2VuZTogU2NlbmVJbnN0YW5jZTNEID0gPFNjZW5lSW5zdGFuY2UzRD50aGlzLnNjZW5lTWFwLmdldChzbmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghc2NlbmUpIHtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmVJbnN0YW5jZTNEKHNuYW1lLCB0aGlzLmVuZ2luZSwgb3B0KTtcclxuICAgICAgICAgICAgdGhpcy5zY2VuZU1hcC5zZXQoc25hbWUsIHNjZW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmUoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJGbGFnID0gUmVuZGVyRmxhZ3MuYWN0aXZlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmmoLlgZxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdXNlKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFJlbmRlckZsYWdzLnBhdXNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlkK/liqjlvJXmk47lrp7kvovlvqrnjq9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZW5kZXJMb29wKCkge1xyXG4gICAgICAgIHRoaXMuZW5naW5lLnJ1blJlbmRlckxvb3AodGhpcy5yZW5kZXJMb29wKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5byV5pOO5YaF5Zy65pmv5o6n5Yi2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVuZGVyTG9vcCA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJGbGFnID09PSBSZW5kZXJGbGFncy5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyU2NlbmVPcmRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNjZW5lT3JkZXIuZm9yRWFjaCgoc25hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY2VuZSA9IHRoaXMuc2NlbmVNYXAuZ2V0KHNuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBzY2VuZSAmJiBzY2VuZS5zY2VuZS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZU1hcC5mb3JFYWNoKChzY2VuZTogU2NlbmVJbnN0YW5jZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjZW5lLnNjZW5lLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJTW9kZWxJbnN0YW5jZSwgSU1vZGVsT3B0LCBJTW9kZWxBbmltT3B0LCBJTW9kZWxBdHRhY2hPcHQsIElNb2RlbENoaWxkT3B0LCBJVHJhbnNmb3JtT2JqLCBJVHJhbnNmb3JtT2JqMiB9IGZyb20gXCIuL3NjZW5lX2Jhc2VcIjtcclxuaW1wb3J0IHsgU2NlbmVJbnN0YW5jZTNEIH0gZnJvbSBcIi4vc2NlbmVfaW5zdGFuY2VcIjtcclxuaW1wb3J0IHsgTG9hZGVyVG9vbCwgTm9kZVRvb2xzIH0gZnJvbSBcIi4vc2NlbmVfdG9vbFwiO1xyXG5cclxuLyoqXHJcbiAqIOS9nOS4uuWcuuaZr+WvvOWFpeeahOaooeWei+aVsOaNrlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcGVuZE1vZGVsT2JqIGltcGxlbWVudHMgSU1vZGVsSW5zdGFuY2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjkuo7lsITnur/mo4DmtYvml7bnmoTpmYTliqDmo4Dmn6XmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJheUlEOiBudW1iZXIgPSAtMTtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5ZCN56ewXHJcbiAgICAgKiAqIOmhueebrueahOWRveWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmiYDlnKjot6/lvoRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog55uu5qCH5paH5Lu25ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDopoHlr7zlhaXnmoTmlofku7blhoXnmoTmjIflrprmqKHlnovlkI3np7BcclxuICAgICAqICog5Li6ICcnIOWImeihqOekuuWvvOWFpeebruagh+aWh+S7tuS4reaJgOacieaooeWei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbW9kZWxOYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXmiJDlip/lkI7nmoTosIPnlKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGxvYWRlZENhbGw/OiAobW9kZWw6IEFwcGVuZE1vZGVsT2JqKSA9PiBhbnk7XHJcbiAgICAvKipcclxuICAgICAqIOaJgOWxniDlnLrmma9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNjZW5lOiAgICAgICBTY2VuZUluc3RhbmNlM0Q7XHJcbiAgICAvKipcclxuICAgICAqIOWvvOWFpeWQjueahOaooeWei+agueiKgueCuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW1wbDogICAgICAgIEJBQllMT04uTWVzaCB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5a+85YWl5ZCO55qE5qC56IqC54K5IC0gPOeUsUJBQllMT04g5Yqg6L295pe25Yib5bu677yM55So5Lul5Zyo5Zy65pmv5YaF5a6a5L2N5a+85YWl55qE5qih5Z6LPlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcm9vdEltcGw6ICAgIEJBQllMT04uTWVzaCB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5Zyo6YC76L6R6YeM6KKr6ZSA5q+BXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0Rpc3Bvc2VkOiAgYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbliqDovb3nu5PmnZ9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzTG9hZGVkOiAgICBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZ2V0IGlzUmVhZHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1wbCAmJiB0aGlzLmltcGwuaXNSZWFkeTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKG1lc2hOYW1lOiBzdHJpbmcsIHNjZW5lOiBTY2VuZUluc3RhbmNlM0QsIG9wdDogSU1vZGVsT3B0ID0gPGFueT57fSkge1xyXG4gICAgICAgIHRoaXMubmFtZSAgICAgICA9IG1lc2hOYW1lO1xyXG4gICAgICAgIHRoaXMuc2NlbmUgICAgICA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMucGF0aCAgICAgICA9IG9wdC5wYXRoIHx8ICcnO1xyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgICA9IG9wdC5maWxlTmFtZTtcclxuICAgICAgICB0aGlzLm1vZGVsTmFtZSAgPSBvcHQubW9kZWxOYW1lO1xyXG4gICAgICAgIHRoaXMubG9hZGVkQ2FsbCA9IG9wdC5sb2FkZWRDYWxsO1xyXG5cclxuICAgICAgICBMb2FkZXJUb29sLmFwcGVuZE1lc2godGhpcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgVxyXG4gICAgICogKiDmiYvliqjosIPnlKjml7bvvIzkvJroh6rliqjku47miYDlsZ4gc2NlbmUg5a6e5L6L5Lit56e76ZmkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjZW5lLnJlbW92ZUFwcGVuZCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5a+85YWl5oiQ5Yqf5ZCO6LCD55SoXHJcbiAgICAgKiAqIOeUseWKoOi9veaooeWdl+iwg+eUqCAtIExvYWRUb29sc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwZW5lZCA9IChzY2VuZTogQkFCWUxPTi5TY2VuZSkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZENhbGwgJiYgdGhpcy5sb2FkZWRDYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWvvOWFpeeahOmdnuWcuuaZr+exu+aooeWei1xyXG4gKiAqIOmhueebruWxgiDlsIHoo4XnmoQg5qih5Z6L5pWw5o2u57uT5p6E77yM5aSE55CGIOmAu+i+keeahOWQjOatpeaTjeS9nCDlnKgg5Yqg6L2955qE5byC5q2l6L+H56iLIOS4reeahOWuieWFqFxyXG4gKiAqIOaOp+WItiDliqjnlLvliIfmjaJcclxuICogKiDmjqfliLYg5qih5Z6LIOmZhOWKoCDkuI4g6KKr6ZmE5YqgXHJcbiAqICog5o6n5Yi2IOaooeWeiyDlj5jmjaIgLSDml4vovawg57yp5pS+IHB5XHJcbiAqICog5o6n5Yi2IOaooeWeiyDpgLvovpHph4rmlL5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbnNlcnRNb2RlbE9iaiBpbXBsZW1lbnRzIElNb2RlbEluc3RhbmNlIHtcclxuICAgIHB1YmxpYyBpbXBsOiBCQUJZTE9OLk1lc2ggfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgcm9vdEltcGw6IEJBQllMT04uTWVzaCB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyByb290OiBJbnNlcnRNb2RlbE9iaiB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc0Rpc3Bvc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNMb2FkZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDniLboioLngrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhcmVudDogSW5zZXJ0TW9kZWxPYmogfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbGlua1VJOiBCQUJZTE9OLkdVSS5Db250cm9sIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgc2NhbGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyByb3RhdGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBsb29rQXQ6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBhbmltT3B0OiBJTW9kZWxBbmltT3B0IHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXnmoTliqjnlLvmmK/lkKbpu5jorqTmkq3mlL5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFuaW1EZWZhdWx0OiBib29sZWFuO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNjZW5lOiBTY2VuZUluc3RhbmNlM0Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcmF5SUQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGF0aDogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGZpbGVOYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbW9kZWxOYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgcHVibGljIGluc2VydGVkQ2FsbDogKChtb2RlbDogSW5zZXJ0TW9kZWxPYmopID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbWVzaE1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5NZXNoPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBza2VsZXRvbk1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5Ta2VsZXRvbj4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYW5pbWF0aW9uTWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwYXJ0aWNsZVN5c01hcDogTWFwPHN0cmluZywgQkFCWUxPTi5QYXJ0aWNsZVN5c3RlbT4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNoT3B0TGlzdDogKElNb2RlbEF0dGFjaE9wdCB8IHVuZGVmaW5lZClbXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNoaWxkT3B0TGlzdDogSU1vZGVsQ2hpbGRPcHRbXSA9IFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqjnlLvmiafooYznu5PmnZ/nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhbmltRW5kQ0I6IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnovlvZPliY3liqjnlLtcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IEJBQllMT04uQW5pbWF0aW9uR3JvdXAgfCB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjeWKqOeUu+aYr+WQpuW+queOr+aSreaUvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlzQW5pbWF0aW9uTG9vcDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGdldCBpc1JlYWR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltcGwgJiYgdGhpcy5pbXBsLmlzUmVhZHk7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNoTmFtZTogc3RyaW5nLCBzY2VuZTogU2NlbmVJbnN0YW5jZTNELCBvcHQ6IElNb2RlbE9wdCA9IDxhbnk+e30pIHtcclxuICAgICAgICB0aGlzLnNjZW5lICA9IHNjZW5lO1xyXG4gICAgICAgIHRoaXMubmFtZSAgID0gbWVzaE5hbWU7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBvcHQucGFyZW50O1xyXG4gICAgICAgIHRoaXMucmF5SUQgID0gb3B0LnJheUlEIHx8IC0xO1xyXG4gICAgICAgIHRoaXMucGF0aCAgID0gb3B0LnBhdGggfHwgJyc7XHJcblxyXG4gICAgICAgIHRoaXMuZmlsZU5hbWUgICAgICAgPSBvcHQuZmlsZU5hbWU7XHJcbiAgICAgICAgdGhpcy5tb2RlbE5hbWUgICAgICA9IG9wdC5tb2RlbE5hbWU7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRlZENhbGwgICA9IG9wdC5pbnNlcnRlZENhbGw7XHJcbiAgICAgICAgdGhpcy5hbmltRGVmYXVsdCAgICA9ICEhb3B0LmFuaW1EZWZhdWx0O1xyXG5cclxuICAgICAgICBpZiAoIW9wdC5pc0VmZmVjdCkge1xyXG4gICAgICAgICAgICBMb2FkZXJUb29sLmxvYWRNZXNoKHRoaXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIExvYWRlclRvb2wubG9hZEVmZmVjdCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZGlzcG9zZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3Bvc2VkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uTWFwLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0LmZvckVhY2goKG9wdCkgPT4ge1xyXG4gICAgICAgICAgICBvcHQuaXNGaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChvcHQubW9kZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgb3B0Lm1vZGVsLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHQubWVzaCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQubWVzaC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGlsZE9wdExpc3QubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbCAmJiB0aGlzLnJvb3RJbXBsLmRpc3Bvc2UoZmFsc2UsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnJvb3RJbXBsICYmICh0aGlzLnJvb3RJbXBsLnBhcmVudCA9IG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tZXNoTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvbk1hcC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXNNYXAuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbk1hcC5jbGVhcigpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucm9vdCAgICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnJvb3RJbXBsICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5pbXBsICAgICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMubG9va0F0ICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnJvdGF0ZSAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxpbmtVSSAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRlZENhbGwgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICBwdWJsaWMgbG9hZGVkID0gKGFtZXNoZXM6IEJBQllMT04uQWJzdHJhY3RNZXNoW10sIHBhcnRpY2xlU3lzdGVtczogQkFCWUxPTi5JUGFydGljbGVTeXN0ZW1bXSwgc2tlbGV0b25zOiBCQUJZTE9OLlNrZWxldG9uW10sIGFuaW1hdGlvbkdyb3VwczogQkFCWUxPTi5BbmltYXRpb25Hcm91cFtdKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbWVzaGVzID0gPEJBQllMT04uTWVzaFtdPmFtZXNoZXM7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzRGlzcG9zZWQpIHtcclxuICAgICAgICAgICAgbWVzaGVzWzBdLmRpc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgICA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdEltcGwgICA9IG1lc2hlc1swXTtcclxuICAgICAgICB0aGlzLmltcGwgICAgICAgPSBtZXNoZXNbMV07XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC5hbmltYXRpb25zLmZvckVhY2goKGFuaW0pID0+IHtcclxuICAgICAgICAgICAgYW5pbS5mcmFtZVBlclNlY29uZCA9IDIwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAobWVzaGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbWVzaGVzLmZvckVhY2goKG1lc2gpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzaE1hcC5zZXQobWVzaC5pZCwgbWVzaCk7XHJcbiAgICAgICAgICAgICAgICAoPGFueT5tZXNoKS5yYXlJRCA9IHRoaXMucmF5SUQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFuaW1hdGlvbkdyb3VwcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gYW5pbWF0aW9uR3JvdXBzWzBdO1xyXG4gICAgICAgICAgICBhbmltYXRpb25Hcm91cHMuZm9yRWFjaCgoYW5pbUdyb3VwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk1hcC5zZXQoYW5pbUdyb3VwLm5hbWUsIGFuaW1Hcm91cCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNrZWxldG9ucyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNrZWxldG9ucy5mb3JFYWNoKChza2VsZXRvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5za2VsZXRvbk1hcC5zZXQoc2tlbGV0b24uaWQsIHNrZWxldG9uKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFydGljbGVTeXN0ZW1zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGFydGljbGVTeXN0ZW1zLmZvckVhY2goKHBhcnRpY2xlU3lzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3lzTWFwLnNldChwYXJ0aWNsZVN5cy5pZCwgPEJBQllMT04uUGFydGljbGVTeXN0ZW0+cGFydGljbGVTeXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlUG9zdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU2NhbGUoKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVJvdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlTGlua1VJKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VMb29rQXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVBdHRhY2goKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbURlZmF1bHQgJiYgYW5pbWF0aW9uR3JvdXBzWzBdKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbkdyb3Vwc1swXS5zdGFydCghMCk7XHJcbiAgICAgICAgfSBlbHNlICBpZiAoIXRoaXMuYW5pbURlZmF1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VBbmltKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pbnNlcnRlZENhbGwpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRlZENhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGFuaW1FbmRDYWxsID0gKCkgPT4ge1xyXG4gICAgICAgIC8vIGlmICh0aGlzLmlzQW5pbWF0aW9uTG9vcCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KCk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5hbmltRW5kQ0IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1FbmRDQigpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1FbmRDQiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0QXR0YWNoKG9wdDogSU1vZGVsQXR0YWNoT3B0KSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0LnB1c2gob3B0KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdC5tb2RlbE9wdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdC5tb2RlbE9wdC5pbnNlcnRlZENhbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvcHQubWVzaCA9IG9wdC5tb2RlbCAmJiBvcHQubW9kZWwucm9vdEltcGw7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0YWNoT3B0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBvcHQubW9kZWwgPSB0aGlzLnNjZW5lLmluc2VydE1lc2gob3B0Lm5hbWUsIG9wdC5tb2RlbE9wdCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHQubW9kZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHQubWVzaCA9IG9wdC5tb2RlbC5yb290SW1wbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0YWNoT3B0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQXR0YWNoT3B0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0Q2hpbGRNb2RlbE9wdChvcHQ6IElNb2RlbENoaWxkT3B0KSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZE9wdExpc3QucHVzaChvcHQpO1xyXG5cclxuICAgICAgICBpZiAob3B0Lm1vZGVsT3B0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0Lm1vZGVsT3B0Lmluc2VydGVkQ2FsbCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDaGlsZE9wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3B0LnN1Y2Nlc3NDYWxsICYmIG9wdC5zdWNjZXNzQ2FsbChvcHQpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgb3B0Lm1vZGVsID0gdGhpcy5zY2VuZS5pbnNlcnRNZXNoKG9wdC5uYW1lLCBvcHQubW9kZWxPcHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm1lc2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDaGlsZE9wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFBvc3Rpb24oZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IFtkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdXTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBvc3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0U2NhbGUoZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IFtkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdXTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVNjYWxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFJvdGF0ZShkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICB0aGlzLnJvdGF0ZSA9IFtkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdXTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVJvdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRMaW5rVUkobm9kZTogQkFCWUxPTi5HVUkuQ29udHJvbCkge1xyXG4gICAgICAgIHRoaXMubGlua1VJID0gbm9kZTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUxpbmtVSSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRMb29rQXQoZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgdGhpcy5sb29rQXQgPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VMb29rQXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0VmlzaWJsZShkYXRhOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSBkYXRhO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRBbmltKGFuaW1PcHQ6IElNb2RlbEFuaW1PcHQpIHtcclxuICAgICAgICB0aGlzLmFuaW1PcHQgPSBhbmltT3B0O1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQW5pbSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdG9wQW5pbSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1PcHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHBhdXNlQW5pbSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltT3B0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlUG9zdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5wb3NpdE5vZGUoPElUcmFuc2Zvcm1PYmoyPnRoaXMucm9vdEltcGwsIHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlU2NhbGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NhbGUgJiYgdGhpcy5yb290SW1wbCkge1xyXG4gICAgICAgICAgICBOb2RlVG9vbHMuc2NhbGVOb2RlKDxJVHJhbnNmb3JtT2JqMj50aGlzLnJvb3RJbXBsLCB0aGlzLnNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZVJvdGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5yb3RhdGUgJiYgdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5yb3RhdGVOb2RlKDxJVHJhbnNmb3JtT2JqMj50aGlzLmltcGwsIHRoaXMucm90YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZUxvb2tBdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5sb29rQXQgJiYgdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5ub2RlTG9va0F0KDxCQUJZTE9OLk1lc2g+dGhpcy5pbXBsLCB0aGlzLmxvb2tBdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VMaW5rVUkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGlua1VJICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5saW5rVUkubGlua1dpdGhNZXNoKHRoaXMucm9vdEltcGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlVmlzaWJsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEltcGwuaXNWaXNpYmxlID0gdGhpcy5pc1Zpc2libGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVBdHRhY2hPcHQoKSB7XHJcbiAgICAgICAgbGV0IHVzZUNvdW50ID0gMDtcclxuICAgICAgICBsZXQgdGVtcEluZGV4ID0gMDtcclxuICAgICAgICBsZXQgbmV3TGlzdExlbiA9IDA7XHJcbiAgICAgICAgY29uc3QgbGlzdExlbiA9IHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGxlbiA9IGxpc3RMZW4gLSAxOyBsZW4gPj0gMDsgbGVuLS0pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gdGhpcy5hdHRhY2hPcHRMaXN0W2xlbl07XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0ICYmIG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNrZWxldG9uID0gdGhpcy5za2VsZXRvbk1hcC5nZXQob3B0LnNrZWxldG9uTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNrZWxldG9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBib25lSW5kZXggPSBza2VsZXRvbi5nZXRCb25lSW5kZXhCeU5hbWUob3B0LmJvbmVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm9uZUluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Lm1lc2guYXR0YWNoVG9Cb25lKHNrZWxldG9uLmJvbmVzW2JvbmVJbmRleF0sIDxCQUJZTE9OLk1lc2g+dGhpcy5yb290SW1wbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVUb29scy5ub2RlVHJhbnNmb3JtKG9wdC5tZXNoLCBvcHQudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0W2xlbl0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB1c2VDb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdMaXN0TGVuID0gbGlzdExlbiAtIHVzZUNvdW50O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBrID0gbGlzdExlbiAtIHVzZUNvdW50OyBpIDwgazsgaSsrKSB7XHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmF0dGFjaE9wdExpc3RbdGVtcEluZGV4XSA9PT0gdW5kZWZpbmVkICYmIHRlbXBJbmRleCA8IGxpc3RMZW4pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBJbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hPcHRMaXN0W3RlbXBJbmRleF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0W2ldID0gdGhpcy5hdHRhY2hPcHRMaXN0W3RlbXBJbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGggPSBuZXdMaXN0TGVuO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDaGlsZE9wdCgpIHtcclxuICAgICAgICB0aGlzLmNoaWxkT3B0TGlzdC5mb3JFYWNoKChvcHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdCAmJiBvcHQuaXNGaW5pc2hlZCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdC5tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5tb2RlbC5yb290SW1wbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5pc0ZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Lm1vZGVsLnJvb3RJbXBsLnBhcmVudCA9IDxCQUJZTE9OLk1lc2g+dGhpcy5yb290SW1wbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTm9kZVRvb2xzLm5vZGVUcmFuc2Zvcm0ob3B0Lm1vZGVsLnJvb3RJbXBsLCBvcHQudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHQuaXNGaW5pc2hlZCAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5tZXNoLnBhcmVudCA9IDxCQUJZTE9OLk1lc2g+dGhpcy5yb290SW1wbDtcclxuICAgICAgICAgICAgICAgICAgICBOb2RlVG9vbHMubm9kZVRyYW5zZm9ybShvcHQubWVzaCwgb3B0LnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlQXR0YWNoKCkge1xyXG4gICAgICAgIC8vXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZUFuaW0oKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbU9wdCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW1hdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5pu05pS55qih5Z6L5Yqo55S7XHJcbiAgICAgKiBAcGFyYW0gYW5pbU5hbWUg55uu5qCH5Yqo55S75ZCN56ewXHJcbiAgICAgKiBAcGFyYW0gaXNMb29wIOaYr+WQpuW+queOr+aSreaUvlxyXG4gICAgICogQHBhcmFtIHN0b3BGbGFnIOWKqOeUu+WBnOatoumFjee9rlxyXG4gICAgICogQHBhcmFtIGVuZENhbGwg5Yqo55S757uT5p2f5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmFuaW1PcHQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BlZWQgICAgID0gdGhpcy5hbmltT3B0LnNwZWVkID09PSB1bmRlZmluZWQgPyAxIDogdGhpcy5hbmltT3B0LnNwZWVkO1xyXG4gICAgICAgICAgICBjb25zdCBhbmltTmFtZSAgPSB0aGlzLmFuaW1PcHQuYW5pbU5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZENhbGwgICA9IHRoaXMuYW5pbU9wdC5lbmRDYWxsO1xyXG4gICAgICAgICAgICBjb25zdCBpc0xvb3AgICAgPSB0aGlzLmFuaW1PcHQuaXNMb29wO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYW5pbUdyb3VwID0gdGhpcy5hbmltYXRpb25NYXAuZ2V0KGFuaW1OYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhbmltR3JvdXAgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFuaW1Hcm91cC5pc1N0YXJ0ZWQgJiYgaXNMb29wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2FuaW1OYW1lfSDliqjnlLvlt7Lnu4/miafooYzvvIFgKTtcclxuICAgICAgICAgICAgICAgICAgICBhbmltR3JvdXAub25BbmltYXRpb25Hcm91cEVuZE9ic2VydmFibGUuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBhbmltR3JvdXAuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGFuaW1Hcm91cC5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5hZGQodGhpcy5hbmltRW5kQ2FsbCk7XHJcbiAgICAgICAgICAgICAgICBhbmltR3JvdXAuc3RhcnQoaXNMb29wLCBzcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hbmltT3B0LmdvRW5kKSB7ICAgICAgIC8vIOaYr+WQpui3s+i9rOWIsOWKqOeUu+acgOWQjuS4gOW4pyjpnZ7lvqrnjq/liqjnlLvorr7nva4pXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbUdyb3VwLmdvVG9GcmFtZShhbmltR3JvdXAudG8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke2FuaW1OYW1lfSDliqjnlLvkuI3lrZjlnKjvvIFgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5hbmltRW5kQ0IgPSBlbmRDYWxsO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1Hcm91cDtcclxuICAgICAgICAgICAgdGhpcy5pc0FuaW1hdGlvbkxvb3AgPSBpc0xvb3A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RvcEFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gJiYgdGhpcy5hbmltYXRpb24uaXNTdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLm9uQW5pbWF0aW9uR3JvdXBFbmRPYnNlcnZhYmxlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnN0b3AoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhdXNlQW5pbWF0aW9uID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uICYmIHRoaXMuYW5pbWF0aW9uLnBhdXNlKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5Zy65pmv5pWw5o2u57uT5p6EIC0g6auY5bGCXHJcbiAqL1xyXG5pbXBvcnQgeyBOb2RlVG9vbHMgfSBmcm9tICcuL3NjZW5lX3Rvb2wnO1xyXG5pbXBvcnQgeyBJbnNlcnRNb2RlbE9iaiwgQXBwZW5kTW9kZWxPYmogfSBmcm9tICcuL21vZGVsX2luc3RhbmNlJztcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLyoqXHJcbiAqIOmhueebruahhuaetuS4iyAtIOWcuuaZr+S4reaVsOaNrue7k+aehFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBTY2VuZTNERXZlbnRJbmZvIHtcclxuICAgIGU6IEJBQllMT04uUG9pbnRlckluZm87XHJcbiAgICBzOiBCQUJZTE9OLkV2ZW50U3RhdGU7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIENBTUVSQVRZUEVTIHtcclxuICAgIEFyY1JvdGF0ZUNhbWVyYSA9ICdBcmNSb3RhdGVDYW1lcmEnLFxyXG4gICAgVW5pdmVyc2FsQ2FtZXJhID0gJ1VuaXZlcnNhbENhbWVyYScsXHJcbiAgICBUYXJnZXRDYW1lcmEgPSAnVGFyZ2V0Q2FtZXJhJ1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBSZW5kZXJGbGFncyB7XHJcbiAgICBhY3RpdmUgPSAnYWN0aXZlJyxcclxuICAgIHBhdXNlID0gJ3BhdXNlJyxcclxuICAgIGRpc3Bvc2UgPSAnZGlzcG9zZSdcclxufVxyXG5cclxuZXhwb3J0IGVudW0gTElHSFRUWVBFUyB7XHJcbiAgICBIZW1pc3BoZXJpY0xpZ2h0ID0gJ0hlbWlzcGhlcmljTGlnaHQnXHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgUmVzUGF0aCAgICAgID0gJ2dhbWUvYXBwL3NjZW5lX3Jlcy9yZXMvJztcclxuZXhwb3J0IGxldCBTY2VuZVJlc1BhdGggPSAnc2NlbmVzLyc7XHJcbmV4cG9ydCBsZXQgTW9kZWxSZXNQYXRoID0gJ21vZGVscy8nO1xyXG5leHBvcnQgbGV0IE5vZGVSZXNQYXRoICA9ICdtb2RlbHMvJztcclxuZXhwb3J0IGxldCBFZmZlY3RSZXNQYXRoID0gJ2VmZmVjdHMvJztcclxuXHJcbi8qKlxyXG4gKiDlnLrmma/lhoXlj6/lgZrlj5jmjaLnmoTlr7nosaHnu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zZm9ybU9iaiB7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueWumuS9jVxyXG4gICAgICovXHJcbiAgICBwb3NpdGlvbj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55peL6L2sXHJcbiAgICAgKi9cclxuICAgIHJvdGF0aW9uPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnnvKnmlL5cclxuICAgICAqL1xyXG4gICAgc2NhbGluZz86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOWcuuaZr+WGheWPr+WBmuWPmOaNoueahOWvueixoee7k+aehFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJVHJhbnNmb3JtT2JqMiB7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueWumuS9jVxyXG4gICAgICovXHJcbiAgICBwb3NpdGlvbj86IEJBQllMT04uVmVjdG9yMztcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55peL6L2sXHJcbiAgICAgKi9cclxuICAgIHJvdGF0aW9uPzogQkFCWUxPTi5WZWN0b3IzO1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnnvKnmlL5cclxuICAgICAqL1xyXG4gICAgc2NhbGluZz86IEJBQllMT04uVmVjdG9yMztcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55peL6L2s5Zub5YWD5pWwXHJcbiAgICAgKi9cclxuICAgIHJvdGF0aW9uUXVhdGVybmlvbj86IEJBQllMT04uUXVhdGVybmlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIDNEIOiKgueCueWPmOaNoumFjee9rlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJVHJhbnNmb3JtQ2ZnIHtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55a6a5L2NXHJcbiAgICAgKi9cclxuICAgIHBvc2l0aW9uPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnml4vovaxcclxuICAgICAqL1xyXG4gICAgcm90YXRlPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnnvKnmlL5cclxuICAgICAqL1xyXG4gICAgc2NhbGU/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovmlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsSW5zdGFuY2UgZXh0ZW5kcyBJVHJhbnNmb3JtT2JqIHtcclxuICAgIHJheUlEOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDlrZDot6/lvoRcclxuICAgICAqL1xyXG4gICAgcGF0aDogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICovXHJcbiAgICBmaWxlTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOi1hOa6kOaWh+S7tuS4reaooeWei+WQjeensFxyXG4gICAgICovXHJcbiAgICBtb2RlbE5hbWU6IHN0cmluZyB8IG51bGw7XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg6LWE5rqQ5Yqg6L295oiQ5Yqf5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGxvYWRlZENhbGw/OiBGdW5jdGlvbjtcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDliqDovb3miJDlip/lm57osINcclxuICAgICAqL1xyXG4gICAgaW5zZXJ0ZWRDYWxsPzogRnVuY3Rpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovliqDovb3phY3nva7mlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsT3B0IHtcclxuICAgIC8qKlxyXG4gICAgICog54i26IqC54K5XHJcbiAgICAgKi9cclxuICAgIHBhcmVudD86IEluc2VydE1vZGVsT2JqO1xyXG4gICAgLyoqXHJcbiAgICAgKiByYXlJRFxyXG4gICAgICovXHJcbiAgICByYXlJRD86IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog6KaB5Yqg6L2955qE5qih5Z6L5ZCN56ewXHJcbiAgICAgKiAqIOe+juacr+i1hOa6kChHTFRGKSDkuK3lrprkuYnnmoTmqKHlnovlkI3np7BcclxuICAgICAqL1xyXG4gICAgbW9kZWxOYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiDopoHliqDovb3nmoTmqKHlnovlnKjmiYDlsZ7otYTmupDnrqHnkIbot6/lvoTkuIvnmoTlrZDot6/lvoRcclxuICAgICAqICog6LWE5rqQ5paH5Lu25a2Q6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIHBhdGg/OiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOimgeWKoOi9veeahOaooeWei+eahOi1hOa6kOaWh+S7tuWQjeensFxyXG4gICAgICogKiDotYTmupDmlofku7blkI3np7BcclxuICAgICAqL1xyXG4gICAgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIG9ubHlVc2VSb290PzogYm9vbGVhbjtcclxuICAgIGlzRWZmZWN0PzogYm9vbGVhbjtcclxuICAgIGFuaW1EZWZhdWx0PzogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L295oiQ5Yqf55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGxvYWRlZENhbGw/KG1vZGVsOiBBcHBlbmRNb2RlbE9iaik6IGFueTtcclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L295oiQ5Yqf55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGluc2VydGVkQ2FsbD8obW9kZWw6IEluc2VydE1vZGVsT2JqKTogYW55O1xyXG59XHJcblxyXG4vKipcclxuICog5qih5Z6L55qEIOWtkCDmqKHlnovliqDovb3mlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsQ2hpbGRPcHQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnovliqDovb3lj4LmlbBcclxuICAgICAqL1xyXG4gICAgbW9kZWxPcHQ/OiBJTW9kZWxPcHQ7XHJcbiAgICAvKipcclxuICAgICAqIOaooeWei1xyXG4gICAgICovXHJcbiAgICBtb2RlbD86IEluc2VydE1vZGVsT2JqO1xyXG4gICAgLyoqXHJcbiAgICAgKiBNRVNIXHJcbiAgICAgKi9cclxuICAgIG1lc2g/OiBCQUJZTE9OLk1lc2g7XHJcbiAgICAvKipcclxuICAgICAqIOWPmOaNouiuvue9rlxyXG4gICAgICovXHJcbiAgICB0cmFuc2Zvcm0/OiBJVHJhbnNmb3JtQ2ZnO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmYTliqDmiJDlip/moIfor4ZcclxuICAgICAqL1xyXG4gICAgaXNGaW5pc2hlZD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOWKoOi8ieWlveeahOWLleeVq+eLgOaFi1xyXG4gICAgICovXHJcbiAgICBpc0xvb3A/OiBib29sZWFuO1xyXG5cclxuICAgIHN1Y2Nlc3NDYWxsPyhPUFQ6IElNb2RlbENoaWxkT3B0KTogdm9pZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIOaooeWei+eahCDpmYTliqA86ZmE5Yqg5LqO5LiA5Liq5qih5Z6L5LiKPiDmlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1vZGVsQXR0YWNoT3B0IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5Yqg6L295Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIG1vZGVsT3B0PzogSU1vZGVsT3B0O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnotcclxuICAgICAqL1xyXG4gICAgbW9kZWw/OiBJbnNlcnRNb2RlbE9iajtcclxuICAgIC8qKlxyXG4gICAgICogTUVTSFxyXG4gICAgICovXHJcbiAgICBtZXNoPzogQkFCWUxPTi5NZXNoO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmYTliqDliLDnm67moIcgc2tlbGV0b25cclxuICAgICAqL1xyXG4gICAgc2tlbGV0b25OYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOmZhOWKoOWIsOebruaghyDpqqjlpLRcclxuICAgICAqL1xyXG4gICAgYm9uZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5Y+Y5o2i6K6+572uXHJcbiAgICAgKi9cclxuICAgIHRyYW5zZm9ybT86IElUcmFuc2Zvcm1DZmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovliqjnlLvphY3nva4g5pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbEFuaW1PcHQge1xyXG4gICAgLyoqXHJcbiAgICAgKiDnm67moIfliqjnlLvlkI3np7BcclxuICAgICAqL1xyXG4gICAgYW5pbU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgZ29FbmQ/OiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAqL1xyXG4gICAgaXNMb29wOiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqjnlLvnu5PmnZ/nirbmgIFcclxuICAgICAqL1xyXG4gICAgc3RvcEZsYWc/OiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOWKqOeUu+e7k+adn+Wbnuiwg1xyXG4gICAgICovXHJcbiAgICBlbmRDYWxsPzogRnVuY3Rpb247XHJcbiAgICAvKipcclxuICAgICAqIOWKqOeUu+mAn+W6plxyXG4gICAgICovXHJcbiAgICBzcGVlZD86IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm6KaB5YGc5q2i5YmN5LiA5Liq5Yqo55S7XHJcbiAgICAgKi9cclxuICAgIG5lZWRTdG9wPzogYm9vbGVhbjtcclxufSIsImltcG9ydCB7IFJlbmRlckZsYWdzLCBJTW9kZWxPcHQgfSBmcm9tIFwiLi9zY2VuZV9iYXNlXCI7XHJcbmltcG9ydCB7IEluc2VydE1vZGVsT2JqLCBBcHBlbmRNb2RlbE9iaiB9IGZyb20gXCIuL21vZGVsX2luc3RhbmNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2NlbmVJbnN0YW5jZSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XHJcbiAgICBwcml2YXRlIF9yZW5kZXJGbGFnOiBSZW5kZXJGbGFncztcclxuICAgIHByaXZhdGUgX2NhbWVyYTogQkFCWUxPTi5DYW1lcmEgfCB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+WGhea4suafk+WFieihqFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpZ2h0TWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkxpZ2h0PiA9IG5ldyBNYXAoKTtcclxuICAgIC8qKlxyXG4gICAgICog5Zy65pmv5YaF55u45py66KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBjYW1lcmFNYXA6IE1hcDxzdHJpbmcsIEJBQllMT04uQ2FtZXJhPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGVuZ2luZTogQkFCWUxPTi5FbmdpbmUsIG9wdD86IEJBQllMT04uU2NlbmVPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lICAgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xyXG4gICAgICAgIHRoaXMuc2NlbmUgID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lLCBvcHQpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYU1hcCAgICAgID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckZsYWcgICAgPSBSZW5kZXJGbGFncy5wYXVzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRMaWdodChsbmFtZTogc3RyaW5nLCBsaWdodDogQkFCWUxPTi5MaWdodCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxpZ2h0TWFwLmdldChsbmFtZSkpIHtcclxuICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubGlnaHRNYXAuc2V0KGxuYW1lLCBsaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZUxpZ2h0KGxuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5saWdodE1hcC5nZXQobG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGlnaHRNYXAuZGVsZXRlKGxuYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlYWRMaWdodChsbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlnaHRNYXAuZ2V0KGxuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgYWN0aXZlQ2FtZXJhKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYW1lcmE7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGFjdGl2ZUNhbWVyYShjYW1lcmE6IEJBQllMT04uQ2FtZXJhIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGNhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlQ2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcmVuZGVyRmxhZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyRmxhZztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgcmVuZGVyRmxhZyhmbGFnOiBSZW5kZXJGbGFncykge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckZsYWcgPSBmbGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmVPYnNlcnZlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLndhcm4oYFNjZW5lICR7dGhpcy5uYW1lfSBhY3RpdmUhYCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZGlzcG9zZU9ic2VydmVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihgU2NlbmUgJHt0aGlzLm5hbWV9IGRpc3Bvc2UhYCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hhbmdlQ2FtZXJhT2JzZXJ2ZXIgPSAoY2FtZXJhOiBCQUJZTE9OLkNhbWVyYSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2VuZSAke3RoaXMubmFtZX0gY2FtZXJhIGNoYW5nZTogJHtjYW1lcmEubmFtZX1gKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVDYW1lcmFPYnNlcnZlciA9IChjYW1lcmE6IEJBQllMT04uQ2FtZXJhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFNjZW5lICR7dGhpcy5uYW1lfSBjYW1lcmEgY2hhbmdlOiAke2NhbWVyYS5uYW1lfWApO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lvZPliY3mtLvliqjnm7jmnLpcclxuICAgICAqIEBwYXJhbSBjYW1lcmFOYW1lIOebruagh+ebuOacuuWQjeensFxyXG4gICAgICogKiDlnKjlnLrmma/lhoXpg6jnm7jmnLrooajkuK3mn6Xmib5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEFjdGl2ZUNhbWVyYShjYW1lcmFOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNhbWVyYU1hcC5nZXQoY2FtZXJhTmFtZSk7XHJcbiAgICAgICAgaWYgKCEhY2FtZXJhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FtZXJhID0gY2FtZXJhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VDYW1lcmFPYnNlcnZlcih0aGlzLmFjdGl2ZUNhbWVyYSk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiAoRm9ybWF0Q2FudmFzRGlzcGxheS5nZXRJc1dlaXhpbkdBTUUoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2FtZXJhVG9vbC5jb21wdXRlVmlld1BvcnQoY2FtZXJhKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgU2NlbmVTdHJ1Y3Quc2V0Q3VyckNhbWVyYe+8muebruagh+WcuuaZr+ayoeaciU5hbWXkuLoke2NhbWVyYU5hbWV955qE55u45py6YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4Hnm7jmnLpcclxuICAgICAqIEBwYXJhbSBjYW1lcmFOYW1lIOebruagh+ebuOacuuWQjeensFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2FtZXJhKGNhbWVyYU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuY2FtZXJhTWFwLmdldChjYW1lcmFOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKGNhbWVyYSAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDYW1lcmEgPT09IGNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDYW1lcmFPYnNlcnZlcihjYW1lcmEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVDYW1lcmEgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmxhZyAgICAgPSBSZW5kZXJGbGFncy5wYXVzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW1lcmFNYXAuZGVsZXRlKGNhbWVyYU5hbWUpO1xyXG4gICAgICAgICAgICBjYW1lcmEuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg55u45py6XHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhIOebruagh+ebuOacuuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ2FtZXJhKGNhbWVyYTogQkFCWUxPTi5DYW1lcmEpIHtcclxuICAgICAgICB0aGlzLmNhbWVyYU1hcC5zZXQoY2FtZXJhLm5hbWUsIGNhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBpY2tDYWxsID0gKGU6IEJBQllMT04uUG9pbnRlckluZm8sIHM6IEJBQllMT04uRXZlbnRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4FcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUuZGlzcG9zZSgpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYSAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnJlbmRlckZsYWcgPSBSZW5kZXJGbGFncy5kaXNwb3NlO1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYU1hcC5jbGVhcigpO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3Bvc2VPYnNlcnZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pqC5YGc5riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnJlbmRlckZsYWcgPSBSZW5kZXJGbGFncy5wYXVzZTtcclxuICAgICAgICB0aGlzLnNjZW5lLm9uUG9pbnRlck9ic2VydmFibGUucmVtb3ZlQ2FsbGJhY2sodGhpcy5waWNrQ2FsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmv4DmtLvmuLLmn5NcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFjdGl2ZSA9ICgpID0+IHtcclxuICAgICAgICAvLyDmnKrplIDmr4FcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJGbGFnICE9PSBSZW5kZXJGbGFncy5kaXNwb3NlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyDmnKrmv4DmtLtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyRmxhZyAhPT0gUmVuZGVyRmxhZ3MuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1JlYWR5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5oYXNPYnNlcnZlcnMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLm9uUG9pbnRlck9ic2VydmFibGUuYWRkKHRoaXMucGlja0NhbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGbGFnID0gUmVuZGVyRmxhZ3MuYWN0aXZlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZU9ic2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihg5Zy65pmvICR7dGhpcy5uYW1lfSDmnKrlh4blpIflrozmr5XvvIzkuI3og73mv4DmtLtgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYOWcuuaZryAke3RoaXMubmFtZX0g6YeN5aSN5r+A5rS7YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYOWcuuaZryAke3RoaXMubmFtZX0g5bey6KKr6ZSA5q+BYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmo4Dmn6XlnLrmma/mmK/lkKblh4blpIfnu5PmnZ/vvIzlj6/mv4DmtLtcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzUmVhZHkoKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiB0aGlzLmFjdGl2ZUNhbWVyYSAhPT0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2NlbmVJbnN0YW5jZTNEIGV4dGVuZHMgU2NlbmVJbnN0YW5jZSB7XHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+WGhSDlnLrmma/njq/looPnuqfliKvoioLngrnooahcclxuICAgICAqICogYXBwZW5kIOaWueW8j+WKoOi9veeahFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFwcGVuZE1lc2hNYXA6IE1hcDxzdHJpbmcsIEFwcGVuZE1vZGVsT2JqPiA9IG5ldyBNYXAoKTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zZXJ0TWVzaE1hcDogTWFwPHN0cmluZywgSW5zZXJ0TW9kZWxPYmo+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJEb3duTGlzdGVuTWFwOiAgIE1hcDxGdW5jdGlvbiwgKGluZm86IGFueSkgPT4gYW55PiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwb2ludGVyTW92ZUxpc3Rlbk1hcDogICBNYXA8RnVuY3Rpb24sIChpbmZvOiBhbnkpID0+IGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcG9pbnRlclVwTGlzdGVuTWFwOiAgICAgTWFwPEZ1bmN0aW9uLCAoaW5mbzogYW55KSA9PiBhbnk+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJDbGlja0xpc3Rlbk1hcDogIE1hcDxGdW5jdGlvbiwgKGluZm86IGFueSkgPT4gYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvvOWFpeWcuuaZr+aooeWei1xyXG4gICAgICogQHBhcmFtIG9iak5hbWUg5qih5Z6L5ZG95ZCNXHJcbiAgICAgKiAqIOeUqOS6jumhueebruWxgueuoeeQhlxyXG4gICAgICogQHBhcmFtIG9wdCDmqKHlnovliqDovb3phY3nva5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFwcGVuZFNjZW5lKG9iak5hbWU6IHN0cmluZywgb3B0OiBJTW9kZWxPcHQgPSA8YW55Pnt9KSB7XHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSBuZXcgQXBwZW5kTW9kZWxPYmoob2JqTmFtZSwgdGhpcywgb3B0KTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBlbmRNZXNoTWFwLnNldChvYmpOYW1lLCBtb2RlbCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlQXBwZW5kKG1vZGVsOiBBcHBlbmRNb2RlbE9iaikge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kTWVzaE1hcC5kZWxldGUobW9kZWwubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmj5LlhaXmqKHlnotcclxuICAgICAqIEBwYXJhbSBvYmpOYW1lIOaooeWei+WRveWQjVxyXG4gICAgICogKiDnlKjkuo7pobnnm67lsYLnrqHnkIZcclxuICAgICAqIEBwYXJhbSBvcHQg5qih5Z6L5Yqg6L296YWN572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbnNlcnRNZXNoKG9iak5hbWU6IHN0cmluZywgb3B0OiBJTW9kZWxPcHQgPSA8YW55Pnt9KSB7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVubmVjZXNzYXJ5LWxvY2FsLXZhcmlhYmxlXHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSBuZXcgSW5zZXJ0TW9kZWxPYmoob2JqTmFtZSwgdGhpcywgb3B0KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnNlcnRNZXNoTWFwLnNldChvYmpOYW1lLCBtb2RlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlSW5zZXJ0KG1vZGVsOiBJbnNlcnRNb2RlbE9iaikge1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0TWVzaE1hcC5kZWxldGUobW9kZWwubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZERvd25MaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckRvd25MaXN0ZW5NYXAuc2V0KGxpc3RlbmVyLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlRG93bkxpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyRG93bkxpc3Rlbk1hcC5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFVwTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJVcExpc3Rlbk1hcC5zZXQobGlzdGVuZXIsIGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVVcExpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyVXBMaXN0ZW5NYXAuZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRNb3ZlTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuTWFwLnNldChsaXN0ZW5lciwgbGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZU1vdmVMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVMaXN0ZW5NYXAuZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRDbGlja0xpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyQ2xpY2tMaXN0ZW5NYXAuc2V0KGxpc3RlbmVyLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2xpY2tMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckNsaWNrTGlzdGVuTWFwLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4FcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKSB7XHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGVuZE1lc2hNYXAuY2xlYXIoKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgeyBJVHJhbnNmb3JtQ2ZnLCBJVHJhbnNmb3JtT2JqMiB9IGZyb20gJy4vc2NlbmVfYmFzZSc7XHJcbmltcG9ydCB7IEFwcGVuZE1vZGVsT2JqLCBJbnNlcnRNb2RlbE9iaiB9IGZyb20gJy4vbW9kZWxfaW5zdGFuY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vZGVUb29scyB7XHJcbiAgICAvKipcclxuICAgICAqIOaXi+i9rCBNZXNoIC0g6Ieq6L2sXHJcbiAgICAgKiBAcGFyYW0gbWVzaCDnm67moIdtZXNoXHJcbiAgICAgKiBAcGFyYW0gcm90YXRlIOaXi+i9rOWPguaVsO+8miBbIHgsIHksIHogXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZU5vZGUobm9kZTogSVRyYW5zZm9ybU9iajIsIHJvdGF0ZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgaWYgKCFub2RlLnJvdGF0aW9uUXVhdGVybmlvbikge1xyXG4gICAgICAgICAgICBub2RlLnJvdGF0aW9uUXVhdGVybmlvbiA9IG5ldyBCQUJZTE9OLlF1YXRlcm5pb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE5vZGVUb29scy5yb3RhdGVRdWF0ZXJuaW9uKG5vZGUucm90YXRpb25RdWF0ZXJuaW9uLCByb3RhdGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDml4vovawgTWVzaCAtIOiHqui9rFxyXG4gICAgICogQHBhcmFtIHF1YXRlcm5pb24g55uu5qCHIFF1YXRlcm5pb25cclxuICAgICAqIEBwYXJhbSByb3RhdGUg5peL6L2s5Y+C5pWw77yaIFsgeCwgeSwgeiBdXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRlUXVhdGVybmlvbihxdWF0ZXJuaW9uOiBCQUJZTE9OLlF1YXRlcm5pb24sIHJvdGF0ZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgLy8gWVhaXHJcbiAgICAgICAgQkFCWUxPTi5RdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsVG9SZWYocm90YXRlWzFdIC0gTWF0aC5QSSwgcm90YXRlWzBdLCAtcm90YXRlWzJdLCBxdWF0ZXJuaW9uKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9zaXROb2RlKG5vZGU6IElUcmFuc2Zvcm1PYmoyLCBkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICAvLyBub2RlLnBvc2l0aW9uID0gbmV3IEJBQllMT04uVmVjdG9yMygtZGF0YVswXSwgZGF0YVsxXSwgLWRhdGFbMl0pO1xyXG4gICAgICAgICg8QkFCWUxPTi5WZWN0b3IzPm5vZGUucG9zaXRpb24pLnNldCgtZGF0YVswXSwgZGF0YVsxXSwgLWRhdGFbMl0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZU5vZGUobm9kZTogSVRyYW5zZm9ybU9iajIsIGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIG5vZGUuc2NhbGluZyA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoZGF0YVswXSwgZGF0YVsxXSwgLWRhdGFbMl0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBub2RlTG9va0F0KG5vZGU6IEJBQllMT04uTWVzaCwgZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgbm9kZS5sb29rQXQobmV3IEJBQllMT04uVmVjdG9yMyhkYXRhWzBdLCBkYXRhWzFdLCAtZGF0YVsyXSkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBub2RlVHJhbnNmb3JtKG5vZGU6IEJBQllMT04uTWVzaCwgdHJhbnNmb3JtOiBJVHJhbnNmb3JtQ2ZnIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0ucG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIE5vZGVUb29scy5wb3NpdE5vZGUoPElUcmFuc2Zvcm1PYmoyPm5vZGUsIHRyYW5zZm9ybS5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybS5zY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgTm9kZVRvb2xzLnNjYWxlTm9kZSg8SVRyYW5zZm9ybU9iajI+bm9kZSwgdHJhbnNmb3JtLnNjYWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgTm9kZVRvb2xzLnJvdGF0ZU5vZGUoPElUcmFuc2Zvcm1PYmoyPm5vZGUsIHRyYW5zZm9ybS5yb3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2xhdGVQb3NpdGlvbihkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBkYXRhWzBdID0gLWRhdGFbMF07XHJcbiAgICAgICAgZGF0YVsxXSA9IGRhdGFbMV07XHJcbiAgICAgICAgZGF0YVsyXSA9IC1kYXRhWzJdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2xhdGVSb3RhdGUoZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgZGF0YVswXSA9IGRhdGFbMF07XHJcbiAgICAgICAgZGF0YVsxXSA9IGRhdGFbMV0gLSBNYXRoLlBJO1xyXG4gICAgICAgIGRhdGFbMl0gPSAtZGF0YVsyXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRlUXVhdGVybmlvbihkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBjb25zdCBxdWF0ZXJuaW9uOiBCQUJZTE9OLlF1YXRlcm5pb24gPSBuZXcgQkFCWUxPTi5RdWF0ZXJuaW9uKCk7XHJcbiAgICAgICAgTm9kZVRvb2xzLnJvdGF0ZVF1YXRlcm5pb24ocXVhdGVybmlvbiwgZGF0YSk7XHJcblxyXG4gICAgICAgIHJldHVybiBxdWF0ZXJuaW9uO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2xhdGVTY2FsZShkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBkYXRhWzBdID0gZGF0YVswXTtcclxuICAgICAgICBkYXRhWzFdID0gZGF0YVsxXTtcclxuICAgICAgICBkYXRhWzJdID0gLWRhdGFbMl07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bm5lY2Vzc2FyeS1jbGFzc1xyXG5leHBvcnQgY2xhc3MgTG9hZGVyVG9vbCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFwcGVuZE1lc2gobW9kZWw6IEFwcGVuZE1vZGVsT2JqKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSAgICAgID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoICAgICAgPSBtb2RlbC5wYXRoO1xyXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lICA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5zY2VuZTtcclxuXHJcbiAgICAgICAgLy8gQkFCWUxPTi5TY2VuZUxvYWRlci5BcHBlbmQoYCR7UmVzUGF0aH0ke1NjZW5lUmVzUGF0aH0ke3BhdGh9YCwgYCR7ZmlsZU5hbWV9LnNjZW5lLmdsdGZgLCBzY2VuZUltcGwsIG1vZGVsLmFwcGVuZWQpO1xyXG4gICAgICAgIEJBQllMT04uU2NlbmVMb2FkZXIuQXBwZW5kQXN5bmMoYCR7cGF0aH1gLCBgJHtmaWxlTmFtZX1gLCBzY2VuZUltcGwpLnRoZW4oXHJcbiAgICAgICAgICAgIChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgIG1vZGVsLmFwcGVuZWQocmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRNZXNoKG1vZGVsOiBJbnNlcnRNb2RlbE9iaikge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBtb2RlbC5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBtb2RlbC5wYXRoO1xyXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gbW9kZWwuZmlsZU5hbWU7XHJcbiAgICAgICAgY29uc3QgbW9kZWxOYW1lID0gbW9kZWwubW9kZWxOYW1lO1xyXG4gICAgICAgIGNvbnN0IHNjZW5lSW1wbCA9IG1vZGVsLnNjZW5lLnNjZW5lO1xyXG5cclxuICAgICAgICBCQUJZTE9OLlNjZW5lTG9hZGVyLkltcG9ydE1lc2gobW9kZWxOYW1lLCBgJHtwYXRofWAsIGAke2ZpbGVOYW1lfWAsIHNjZW5lSW1wbCwgbW9kZWwubG9hZGVkKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEVmZmVjdChtb2RlbDogSW5zZXJ0TW9kZWxPYmopIHtcclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5zY2VuZTtcclxuXHJcbiAgICAgICAgQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKG1vZGVsTmFtZSwgYCR7cGF0aH1gLCBgJHtmaWxlTmFtZX1gLCBzY2VuZUltcGwsIG1vZGVsLmxvYWRlZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5kZXggfSBmcm9tIFwiLi9hcHAvZGVtbzAwMFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEluaXRPayA9ICgpID0+IHtcclxuICAgIEluZGV4LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdKTtcclxufTsiXX0=
