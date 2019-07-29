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
        const camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene.scene);
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
        // // 添加球体
        // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene.scene);
        // sphere.position.y = 1;
        // // 添加平面
        // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene.scene);
        // ground.position.y = 0.1;
        // var sceneIn = new BABYLON.SceneInstrumentation(this.scene.scene);
        const model = this.scene.insertMesh('buster_drone', {
            rayID: 1,
            modelName: null,
            path: '../../resource/model/buster_drone/',
            /**
             * 要加载的模型的资源文件名称
             * * 资源文件名称
             */
            fileName: 'scene.gltf',
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
 * * 控制 模型 动画速度 - 实现顿帧等效果
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
        this.animSpeedCtrl = ['', 1];
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
    setAnimSpeed(animName, speed) {
        this.animSpeedCtrl[0] = animName;
        this.animSpeedCtrl[1] = speed;
        if (this.isLoaded) {
            this.changeAnimSpeed();
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
    changeAnimSpeed() {
        if (this.animation && this.animation.name === this.animSpeedCtrl[0]) {
            this.animation.speedRatio = this.animSpeedCtrl[1];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYm9vdC9pbmRleC50cyIsInNyYy9mcm9udC9hcHAvZGVtbzAwMC9pbmRleC50cyIsInNyYy9mcm9udC9iYXNlL2VuZ2luZV9pbnN0YW5jZS50cyIsInNyYy9mcm9udC9iYXNlL21vZGVsX2luc3RhbmNlLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmVfYmFzZS50cyIsInNyYy9mcm9udC9iYXNlL3NjZW5lX2luc3RhbmNlLnRzIiwic3JjL2Zyb250L2Jhc2Uvc2NlbmVfdG9vbC50cyIsInNyYy9mcm9udC9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSx3Q0FBdUM7QUFFdkMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLGFBQU0sQ0FBQyxDQUFDOzs7O0FDRnBELGdFQUE0RDtBQUk1RDs7O0dBR0c7QUFDSCxNQUFhLEtBQUs7SUFJZDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUF5QjtRQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVyQixPQUFPO1FBQ1AsSUFBSSxDQUFDLEtBQUssR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRyxNQUFNLENBQUMsU0FBUyxDQUFD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QyxDQUFDO0lBQ2pHLENBQUM7Q0FDSjtBQWpDRCxnQ0FpQ0M7Ozs7QUMxR0QsMkNBQXNDO0FBRXpCLFFBQUEsTUFBTSxHQUFHLEdBQUcsRUFBRTtJQUN2QixlQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IEluaXRPayB9IGZyb20gXCIuLi9mcm9udC9tYWluXCI7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIEluaXRPayk7IiwiaW1wb3J0IHsgRW5naW5lSW5zdGFuY2UgfSBmcm9tIFwiLi4vLi4vYmFzZS9lbmdpbmVfaW5zdGFuY2VcIjtcclxuaW1wb3J0IHsgU2NlbmVJbnN0YW5jZTNELCBTY2VuZUluc3RhbmNlIH0gZnJvbSBcIi4uLy4uL2Jhc2Uvc2NlbmVfaW5zdGFuY2VcIjtcclxuaW1wb3J0IHsgQXBwZW5kTW9kZWxPYmosIEluc2VydE1vZGVsT2JqIH0gZnJvbSBcIi4uLy4uL2Jhc2UvbW9kZWxfaW5zdGFuY2VcIjtcclxuXHJcbi8qKlxyXG4gKiDlip/og73mqKHlnZdcclxuICogKiDkuLvlip/og73vvIxiYWJ5bG9uIDNEIGRlbW9cclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbmRleCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwdWJsaWMgc3RhdGljIGVuZ2luZTogRW5naW5lSW5zdGFuY2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjZW5lOiBTY2VuZUluc3RhbmNlM0Q7XHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluaXtu+8jOWIm+W7uuS4gOS4queugOWNleeahOWujOaVtOeahOWcuuaZr+WxleekulxyXG4gICAgICogKiDnm7jmnLpcclxuICAgICAqICog54Gv5YWJXHJcbiAgICAgKiAqIOeQg+S9k1xyXG4gICAgICogKiDlubPpnaJcclxuICAgICAqIEBwYXJhbSBjYW52YXMg55uu5qCHIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gbmV3IEVuZ2luZUluc3RhbmNlKCcwMCcsIGNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUuYWN0aXZlKCk7XHJcblxyXG4gICAgICAgIC8vIOWIm+W7uuWcuuaZr1xyXG4gICAgICAgIHRoaXMuc2NlbmUgID0gdGhpcy5lbmdpbmUuY3JlYXRlU2NlbmUzRCgndGVzdCcpO1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgQkFCWUxPTi5UYXJnZXRDYW1lcmEoJ2NhbWVyYTEnLCBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDUsIC0xMCksIHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgICAgIGNhbWVyYS5zZXRUYXJnZXQoQkFCWUxPTi5WZWN0b3IzLlplcm8oKSk7XHJcbiAgICAgICAgY2FtZXJhLmF0dGFjaENvbnRyb2woY2FudmFzLCB0cnVlKTtcclxuICAgICAgICAvLyDmt7vliqDnm7jmnLpcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZENhbWVyYShjYW1lcmEpO1xyXG4gICAgICAgIC8vIOiuvue9rua0u+WKqOebuOaculxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlQ2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIC8vIOWPr+S7pea/gOa0u+WcuuaZr1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlKCk7XHJcblxyXG4gICAgICAgIC8vIOa3u+WKoOeBr+WFiVxyXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IEJBQllMT04uSGVtaXNwaGVyaWNMaWdodCgnbGlnaHQxJywgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAwKSwgdGhpcy5zY2VuZS5zY2VuZSk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGRMaWdodCgnbGlnaHQxJywgbGlnaHQpO1xyXG5cclxuICAgICAgICAvLyAvLyDmt7vliqDnkIPkvZNcclxuICAgICAgICAvLyBjb25zdCBzcGhlcmUgPSBCQUJZTE9OLk1lc2guQ3JlYXRlU3BoZXJlKCdzcGhlcmUxJywgMTYsIDIsIHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgICAgIC8vIHNwaGVyZS5wb3NpdGlvbi55ID0gMTtcclxuXHJcbiAgICAgICAgLy8gLy8g5re75Yqg5bmz6Z2iXHJcbiAgICAgICAgLy8gY29uc3QgZ3JvdW5kID0gQkFCWUxPTi5NZXNoLkNyZWF0ZUdyb3VuZCgnZ3JvdW5kMScsIDYsIDYsIDIsIHRoaXMuc2NlbmUuc2NlbmUpO1xyXG4gICAgICAgIC8vIGdyb3VuZC5wb3NpdGlvbi55ID0gMC4xO1xyXG5cclxuICAgICAgICAvLyB2YXIgc2NlbmVJbiA9IG5ldyBCQUJZTE9OLlNjZW5lSW5zdHJ1bWVudGF0aW9uKHRoaXMuc2NlbmUuc2NlbmUpO1xyXG5cclxuICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMuc2NlbmUuaW5zZXJ0TWVzaCgnYnVzdGVyX2Ryb25lJywge1xyXG4gICAgICAgICAgICByYXlJRDogMSxcclxuICAgICAgICAgICAgbW9kZWxOYW1lOiBudWxsLFxyXG4gICAgICAgICAgICBwYXRoOiAnLi4vLi4vcmVzb3VyY2UvbW9kZWwvYnVzdGVyX2Ryb25lLycsXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDopoHliqDovb3nmoTmqKHlnovnmoTotYTmupDmlofku7blkI3np7BcclxuICAgICAgICAgICAgICogKiDotYTmupDmlofku7blkI3np7BcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiAnc2NlbmUuZ2x0ZicsXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiDliqDovb3miJDlip/nmoTlm57osINcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGluc2VydGVkQ2FsbDogKG1vZGVsOiBJbnNlcnRNb2RlbE9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbnNlcnQgU2N1Y2Nlc3MuYCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnNjZW5lLmFjdGl2ZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgICAgICAgICAgIHNwYW4uaW5uZXJUZXh0ID0gYEdMVEYgTW9kZWwgRnJvbTogTGFWQURyYUdvTidzIDxCdXN0ZXIgRHJvbmU+YCA7XHJcbiAgICAgICAgICAgICAgICBzcGFuLnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjI0cHg7Y29sb3I6cmVkO3otaW5kZXg6MTAwMDAwMDA7JztcclxuICAgICAgICAgICAgICAgIHNwYW4uaHJlZiA9ICdodHRwczovL3NrZXRjaGZhYi5jb20vM2QtbW9kZWxzL2J1c3Rlci1kcm9uZS0yOTRlNzk2NTJmNDk0MTMwYWQyYWIwMGExM2ZkYmFmZCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbW9kZWwuc2V0UG9zdGlvbihbMCwgMC4wLCAwLjBdKTtcclxuICAgICAgICBtb2RlbC5zZXRTY2FsZShbMC4wMSwgMC4wMSwgMC4wMV0pO1xyXG4gICAgICAgIG1vZGVsLnNldEFuaW0oeyBhbmltTmFtZTogJ0NJTkVNQV80RF9CYXNpcycsIGlzTG9vcDogdHJ1ZSB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRW5naW5lKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTY2VuZUluc3RhbmNlLCBTY2VuZUluc3RhbmNlM0QgfSBmcm9tIFwiLi9zY2VuZV9pbnN0YW5jZVwiO1xyXG5pbXBvcnQgeyBSZW5kZXJGbGFncyB9IGZyb20gXCIuL3NjZW5lX2Jhc2VcIjtcclxuXHJcbi8qKlxyXG4gKiDpobnnm67lsYIg5bCB6KOFIEVuZ2luIOWunuS+i1xyXG4gKiAqIOaOp+WItiDlvJXmk47lrp7kvovmmK/lkKYg5riy5p+TXHJcbiAqICog5o6n5Yi2IOWkmuWcuuaZr+eahCDmuLLmn5Ppobrluo9cclxuICogLy8gVE9ET1xyXG4gKiAqIOaOp+WItiDlpJrlnLrmma/nmoQg5riy5p+T5YmN5aSE55CGXHJcbiAqICAgICAgKiDmmK/lkKbmuIXlsY9cclxuICogICAgICAqIOa4heWxj+WPguaVsFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEVuZ2luZUluc3RhbmNlIHtcclxuICAgIC8qKlxyXG4gICAgICogRW5naW5lIOWunuS+i1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcclxuICAgIC8qKlxyXG4gICAgICog5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOWkmuWcuuaZr+WunuS+iyDloIZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNjZW5lTWFwOiBNYXA8c3RyaW5nLCBTY2VuZUluc3RhbmNlPiA9IG5ldyBNYXAoKTtcclxuICAgIC8qKlxyXG4gICAgICog5aSa5Zy65pmv55qE5riy5p+T6aG65bqP6YWN572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSByZW5kZXJTY2VuZU9yZGVyOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbmdpbmUg5a6e5L6L5riy5p+T54q25oCBXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVuZGVyRmxhZzogUmVuZGVyRmxhZ3MgPSBSZW5kZXJGbGFncy5wYXVzZTtcclxuICAgIGNvbnN0cnVjdG9yKGVuYW1lOiBzdHJpbmcsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLm5hbWUgICA9IGVuYW1lO1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVSZW5kZXJMb29wKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+S4gOiIrOWcuuaZr1xyXG4gICAgICogQHBhcmFtIHNuYW1lIOWcuuaZr+WQjeensFxyXG4gICAgICogQHBhcmFtIG9wdCDlnLrmma/lj4LmlbBcclxuICAgICAqICog5LiN6IO95a+85YWl5qih5Z6LXHJcbiAgICAgKiAqIOS4jeiDveaPkuWFpeaooeWei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlU2NlbmUoc25hbWU6IHN0cmluZywgb3B0PzogQkFCWUxPTi5TY2VuZU9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgc2NlbmU6IFNjZW5lSW5zdGFuY2UgPSA8U2NlbmVJbnN0YW5jZT50aGlzLnNjZW5lTWFwLmdldChzbmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghc2NlbmUpIHtcclxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgU2NlbmVJbnN0YW5jZShzbmFtZSwgdGhpcy5lbmdpbmUsIG9wdCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmVNYXAuc2V0KHNuYW1lLCBzY2VuZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2NlbmU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uiAzRCDlnLrmma9cclxuICAgICAqIEBwYXJhbSBzbmFtZSDlnLrmma/lkI3np7BcclxuICAgICAqIEBwYXJhbSBvcHQg5Zy65pmv5Y+C5pWwXHJcbiAgICAgKiAqIOato+W4uOeahCAzRCDlip/og71cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZVNjZW5lM0Qoc25hbWU6IHN0cmluZywgb3B0PzogQkFCWUxPTi5TY2VuZU9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRCA9IDxTY2VuZUluc3RhbmNlM0Q+dGhpcy5zY2VuZU1hcC5nZXQoc25hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXNjZW5lKSB7XHJcbiAgICAgICAgICAgIHNjZW5lID0gbmV3IFNjZW5lSW5zdGFuY2UzRChzbmFtZSwgdGhpcy5lbmdpbmUsIG9wdCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmVNYXAuc2V0KHNuYW1lLCBzY2VuZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2NlbmU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOa/gOa0u1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWN0aXZlKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFJlbmRlckZsYWdzLmFjdGl2ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5pqC5YGcXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZSgpIHtcclxuICAgICAgICB0aGlzLnJlbmRlckZsYWcgPSBSZW5kZXJGbGFncy5wYXVzZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5ZCv5Yqo5byV5pOO5a6e5L6L5b6q546vXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWN0aXZlUmVuZGVyTG9vcCgpIHtcclxuICAgICAgICB0aGlzLmVuZ2luZS5ydW5SZW5kZXJMb29wKHRoaXMucmVuZGVyTG9vcCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOW8leaTjuWGheWcuuaZr+aOp+WItlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbmRlckxvb3AgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyRmxhZyA9PT0gUmVuZGVyRmxhZ3MuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlclNjZW5lT3JkZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJTY2VuZU9yZGVyLmZvckVhY2goKHNuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NlbmUgPSB0aGlzLnNjZW5lTWFwLmdldChzbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUgJiYgc2NlbmUuc2NlbmUucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmVNYXAuZm9yRWFjaCgoc2NlbmU6IFNjZW5lSW5zdGFuY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzY2VuZS5zY2VuZS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSU1vZGVsSW5zdGFuY2UsIElNb2RlbE9wdCwgSU1vZGVsQW5pbU9wdCwgSU1vZGVsQXR0YWNoT3B0LCBJTW9kZWxDaGlsZE9wdCwgSVRyYW5zZm9ybU9iaiwgSVRyYW5zZm9ybU9iajIgfSBmcm9tIFwiLi9zY2VuZV9iYXNlXCI7XHJcbmltcG9ydCB7IFNjZW5lSW5zdGFuY2UzRCB9IGZyb20gXCIuL3NjZW5lX2luc3RhbmNlXCI7XHJcbmltcG9ydCB7IExvYWRlclRvb2wsIE5vZGVUb29scyB9IGZyb20gXCIuL3NjZW5lX3Rvb2xcIjtcclxuXHJcbi8qKlxyXG4gKiDkvZzkuLrlnLrmma/lr7zlhaXnmoTmqKHlnovmlbDmja5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBlbmRNb2RlbE9iaiBpbXBsZW1lbnRzIElNb2RlbEluc3RhbmNlIHtcclxuICAgIC8qKlxyXG4gICAgICog55So5LqO5bCE57q/5qOA5rWL5pe255qE6ZmE5Yqg5qOA5p+l5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByYXlJRDogbnVtYmVyID0gLTE7XHJcbiAgICAvKipcclxuICAgICAqIOaooeWei+WQjeensFxyXG4gICAgICogKiDpobnnm67nmoTlkb3lkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5omA5Zyo6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOebruagh+aWh+S7tuWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6KaB5a+85YWl55qE5paH5Lu25YaF55qE5oyH5a6a5qih5Z6L5ZCN56ewXHJcbiAgICAgKiAqIOS4uiAnJyDliJnooajnpLrlr7zlhaXnm67moIfmlofku7bkuK3miYDmnInmqKHlnotcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG1vZGVsTmFtZTogc3RyaW5nIHwgbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICog5a+85YWl5oiQ5Yqf5ZCO55qE6LCD55SoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBsb2FkZWRDYWxsPzogKG1vZGVsOiBBcHBlbmRNb2RlbE9iaikgPT4gYW55O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmiYDlsZ4g5Zy65pmvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWFkb25seSBzY2VuZTogICAgICAgU2NlbmVJbnN0YW5jZTNEO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXlkI7nmoTmqKHlnovmoLnoioLngrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGltcGw6ICAgICAgICBCQUJZTE9OLk1lc2ggfCB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIOWvvOWFpeWQjueahOagueiKgueCuSAtIDznlLFCQUJZTE9OIOWKoOi9veaXtuWIm+W7uu+8jOeUqOS7peWcqOWcuuaZr+WGheWumuS9jeWvvOWFpeeahOaooeWeiz5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJvb3RJbXBsOiAgICBCQUJZTE9OLk1lc2ggfCB1bmRlZmluZWQ7XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWcqOmAu+i+kemHjOiiq+mUgOavgVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNEaXNwb3NlZDogIGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5Yqg6L2957uT5p2fXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0xvYWRlZDogICAgYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGdldCBpc1JlYWR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltcGwgJiYgdGhpcy5pbXBsLmlzUmVhZHk7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNoTmFtZTogc3RyaW5nLCBzY2VuZTogU2NlbmVJbnN0YW5jZTNELCBvcHQ6IElNb2RlbE9wdCA9IDxhbnk+e30pIHtcclxuICAgICAgICB0aGlzLm5hbWUgICAgICAgPSBtZXNoTmFtZTtcclxuICAgICAgICB0aGlzLnNjZW5lICAgICAgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLnBhdGggICAgICAgPSBvcHQucGF0aCB8fCAnJztcclxuICAgICAgICB0aGlzLmZpbGVOYW1lICAgPSBvcHQuZmlsZU5hbWU7XHJcbiAgICAgICAgdGhpcy5tb2RlbE5hbWUgID0gb3B0Lm1vZGVsTmFtZTtcclxuICAgICAgICB0aGlzLmxvYWRlZENhbGwgPSBvcHQubG9hZGVkQ2FsbDtcclxuXHJcbiAgICAgICAgTG9hZGVyVG9vbC5hcHBlbmRNZXNoKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDplIDmr4FcclxuICAgICAqICog5omL5Yqo6LCD55So5pe277yM5Lya6Ieq5Yqo5LuO5omA5bGeIHNjZW5lIOWunuS+i+S4reenu+mZpFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEltcGwuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmVBcHBlbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOWvvOWFpeaIkOWKn+WQjuiwg+eUqFxyXG4gICAgICogKiDnlLHliqDovb3mqKHlnZfosIPnlKggLSBMb2FkVG9vbHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFwcGVuZWQgPSAoc2NlbmU6IEJBQllMT04uU2NlbmUpID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWRDYWxsICYmIHRoaXMubG9hZGVkQ2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlr7zlhaXnmoTpnZ7lnLrmma/nsbvmqKHlnotcclxuICogKiDpobnnm67lsYIg5bCB6KOF55qEIOaooeWei+aVsOaNrue7k+aehO+8jOWkhOeQhiDpgLvovpHnmoTlkIzmraXmk43kvZwg5ZyoIOWKoOi9veeahOW8guatpei/h+eoiyDkuK3nmoTlronlhahcclxuICogKiDmjqfliLYg5Yqo55S75YiH5o2iXHJcbiAqICog5o6n5Yi2IOaooeWeiyDpmYTliqAg5LiOIOiiq+mZhOWKoFxyXG4gKiAqIOaOp+WItiDmqKHlnosg5Y+Y5o2iIC0g5peL6L2sIOe8qeaUviBweVxyXG4gKiAqIOaOp+WItiDmqKHlnosg6YC76L6R6YeK5pS+XHJcbiAqICog5o6n5Yi2IOaooeWeiyDliqjnlLvpgJ/luqYgLSDlrp7njrDpob/luKfnrYnmlYjmnpxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbnNlcnRNb2RlbE9iaiBpbXBsZW1lbnRzIElNb2RlbEluc3RhbmNlIHtcclxuICAgIHB1YmxpYyBpbXBsOiBCQUJZTE9OLk1lc2ggfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgcm9vdEltcGw6IEJBQllMT04uTWVzaCB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyByb290OiBJbnNlcnRNb2RlbE9iaiB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc0Rpc3Bvc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNMb2FkZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDniLboioLngrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhcmVudDogSW5zZXJ0TW9kZWxPYmogfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgbGlua1VJOiBCQUJZTE9OLkdVSS5Db250cm9sIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgc2NhbGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyByb3RhdGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBsb29rQXQ6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBhbmltT3B0OiBJTW9kZWxBbmltT3B0IHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXnmoTliqjnlLvmmK/lkKbpu5jorqTmkq3mlL5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFuaW1EZWZhdWx0OiBib29sZWFuO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHNjZW5lOiBTY2VuZUluc3RhbmNlM0Q7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcmF5SUQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGF0aDogc3RyaW5nO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGZpbGVOYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbW9kZWxOYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgcHVibGljIGluc2VydGVkQ2FsbDogKChtb2RlbDogSW5zZXJ0TW9kZWxPYmopID0+IGFueSkgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgbWVzaE1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5NZXNoPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBza2VsZXRvbk1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5Ta2VsZXRvbj4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYW5pbWF0aW9uTWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwYXJ0aWNsZVN5c01hcDogTWFwPHN0cmluZywgQkFCWUxPTi5QYXJ0aWNsZVN5c3RlbT4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXR0YWNoT3B0TGlzdDogKElNb2RlbEF0dGFjaE9wdCB8IHVuZGVmaW5lZClbXSA9IFtdO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNoaWxkT3B0TGlzdDogSU1vZGVsQ2hpbGRPcHRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBhbmltU3BlZWRDdHJsOiBbc3RyaW5nLCBudW1iZXJdID0gWycnLCAxXTtcclxuICAgIC8qKlxyXG4gICAgICog5Yqo55S75omn6KGM57uT5p2f55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbUVuZENCOiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5b2T5YmN5Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiBCQUJZTE9OLkFuaW1hdGlvbkdyb3VwIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3liqjnlLvmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc0FuaW1hdGlvbkxvb3A6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBnZXQgaXNSZWFkeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsICYmIHRoaXMuaW1wbC5pc1JlYWR5O1xyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3IobWVzaE5hbWU6IHN0cmluZywgc2NlbmU6IFNjZW5lSW5zdGFuY2UzRCwgb3B0OiBJTW9kZWxPcHQgPSA8YW55Pnt9KSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZSAgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLm5hbWUgICA9IG1lc2hOYW1lO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gb3B0LnBhcmVudDtcclxuICAgICAgICB0aGlzLnJheUlEICA9IG9wdC5yYXlJRCB8fCAtMTtcclxuICAgICAgICB0aGlzLnBhdGggICA9IG9wdC5wYXRoIHx8ICcnO1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVOYW1lICAgICAgID0gb3B0LmZpbGVOYW1lO1xyXG4gICAgICAgIHRoaXMubW9kZWxOYW1lICAgICAgPSBvcHQubW9kZWxOYW1lO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0ZWRDYWxsICAgPSBvcHQuaW5zZXJ0ZWRDYWxsO1xyXG4gICAgICAgIHRoaXMuYW5pbURlZmF1bHQgICAgPSAhIW9wdC5hbmltRGVmYXVsdDtcclxuXHJcbiAgICAgICAgaWYgKCFvcHQuaXNFZmZlY3QpIHtcclxuICAgICAgICAgICAgTG9hZGVyVG9vbC5sb2FkTWVzaCh0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMb2FkZXJUb29sLmxvYWRFZmZlY3QodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGRpc3Bvc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwb3NlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbk1hcC5jbGVhcigpO1xyXG5cclxuICAgICAgICB0aGlzLmNoaWxkT3B0TGlzdC5mb3JFYWNoKChvcHQpID0+IHtcclxuICAgICAgICAgICAgb3B0LmlzRmluaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIG9wdC5tb2RlbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0Lm1lc2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgb3B0Lm1lc2guZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0Lmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEltcGwgJiYgdGhpcy5yb290SW1wbC5kaXNwb3NlKGZhbHNlLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5yb290SW1wbCAmJiAodGhpcy5yb290SW1wbC5wYXJlbnQgPSBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubWVzaE1hcC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25NYXAuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmltYXRpb24gID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucGFyZW50ICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnJvb3QgICAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb290SW1wbCAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaW1wbCAgICAgICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxvb2tBdCAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUgICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gICA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnNjYWxlICAgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5saW5rVUkgICAgID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0ZWRDYWxsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgcHVibGljIGxvYWRlZCA9IChhbWVzaGVzOiBCQUJZTE9OLkFic3RyYWN0TWVzaFtdLCBwYXJ0aWNsZVN5c3RlbXM6IEJBQllMT04uSVBhcnRpY2xlU3lzdGVtW10sIHNrZWxldG9uczogQkFCWUxPTi5Ta2VsZXRvbltdLCBhbmltYXRpb25Hcm91cHM6IEJBQllMT04uQW5pbWF0aW9uR3JvdXBbXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1lc2hlcyA9IDxCQUJZTE9OLk1lc2hbXT5hbWVzaGVzO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3Bvc2VkKSB7XHJcbiAgICAgICAgICAgIG1lc2hlc1swXS5kaXNwb3NlKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkICAgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3RJbXBsICAgPSBtZXNoZXNbMF07XHJcbiAgICAgICAgdGhpcy5pbXBsICAgICAgID0gbWVzaGVzWzFdO1xyXG5cclxuICAgICAgICB0aGlzLmltcGwuYW5pbWF0aW9ucy5mb3JFYWNoKChhbmltKSA9PiB7XHJcbiAgICAgICAgICAgIGFuaW0uZnJhbWVQZXJTZWNvbmQgPSAyMDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1lc2hlcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG1lc2hlcy5mb3JFYWNoKChtZXNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2hNYXAuc2V0KG1lc2guaWQsIG1lc2gpO1xyXG4gICAgICAgICAgICAgICAgKDxhbnk+bWVzaCkucmF5SUQgPSB0aGlzLnJheUlEO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRpb25Hcm91cHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbkdyb3Vwc1swXTtcclxuICAgICAgICAgICAgYW5pbWF0aW9uR3JvdXBzLmZvckVhY2goKGFuaW1Hcm91cCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25NYXAuc2V0KGFuaW1Hcm91cC5uYW1lLCBhbmltR3JvdXApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChza2VsZXRvbnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBza2VsZXRvbnMuZm9yRWFjaCgoc2tlbGV0b24pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tlbGV0b25NYXAuc2V0KHNrZWxldG9uLmlkLCBza2VsZXRvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcnRpY2xlU3lzdGVtcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlU3lzdGVtcy5mb3JFYWNoKChwYXJ0aWNsZVN5cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c01hcC5zZXQocGFydGljbGVTeXMuaWQsIDxCQUJZTE9OLlBhcnRpY2xlU3lzdGVtPnBhcnRpY2xlU3lzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZVBvc3Rpb24oKTtcclxuICAgICAgICB0aGlzLmNoYW5nZVNjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VSb3RhdGUoKTtcclxuICAgICAgICB0aGlzLmNoYW5nZUxpbmtVSSgpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlTG9va0F0KCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlQXR0YWNoKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVBdHRhY2hPcHQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNoaWxkT3B0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFuaW1EZWZhdWx0ICYmIGFuaW1hdGlvbkdyb3Vwc1swXSkge1xyXG4gICAgICAgICAgICBhbmltYXRpb25Hcm91cHNbMF0uc3RhcnQoITApO1xyXG4gICAgICAgIH0gZWxzZSAgaWYgKCF0aGlzLmFuaW1EZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQW5pbSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5zZXJ0ZWRDYWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0ZWRDYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBhbmltRW5kQ2FsbCA9ICgpID0+IHtcclxuICAgICAgICAvLyBpZiAodGhpcy5pc0FuaW1hdGlvbkxvb3AgPT09IHRydWUpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5hbmltYXRpb24ucGxheSgpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbUVuZENCICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltRW5kQ0IoKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltRW5kQ0IgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldEF0dGFjaChvcHQ6IElNb2RlbEF0dGFjaE9wdCkge1xyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5wdXNoKG9wdCk7XHJcblxyXG4gICAgICAgIGlmIChvcHQubW9kZWxPcHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHQubW9kZWxPcHQuaW5zZXJ0ZWRDYWxsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3B0Lm1lc2ggPSBvcHQubW9kZWwgJiYgb3B0Lm1vZGVsLnJvb3RJbXBsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgb3B0Lm1vZGVsID0gdGhpcy5zY2VuZS5pbnNlcnRNZXNoKG9wdC5uYW1lLCBvcHQubW9kZWxPcHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm1vZGVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb3B0Lm1lc2ggPSBvcHQubW9kZWwucm9vdEltcGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHQubWVzaCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUF0dGFjaE9wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldENoaWxkTW9kZWxPcHQob3B0OiBJTW9kZWxDaGlsZE9wdCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRPcHRMaXN0LnB1c2gob3B0KTtcclxuXHJcbiAgICAgICAgaWYgKG9wdC5tb2RlbE9wdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdC5tb2RlbE9wdC5pbnNlcnRlZENhbGwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9wdC5zdWNjZXNzQ2FsbCAmJiBvcHQuc3VjY2Vzc0NhbGwob3B0KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG9wdC5tb2RlbCA9IHRoaXMuc2NlbmUuaW5zZXJ0TWVzaChvcHQubmFtZSwgb3B0Lm1vZGVsT3B0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNoaWxkT3B0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRPcHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRQb3N0aW9uKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQb3N0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFNjYWxlKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VTY2FsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRSb3RhdGUoZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgdGhpcy5yb3RhdGUgPSBbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VSb3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0TGlua1VJKG5vZGU6IEJBQllMT04uR1VJLkNvbnRyb2wpIHtcclxuICAgICAgICB0aGlzLmxpbmtVSSA9IG5vZGU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VMaW5rVUkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0TG9va0F0KGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMubG9va0F0ID0gW2RhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl1dO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlTG9va0F0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFZpc2libGUoZGF0YTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gZGF0YTtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVZpc2libGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0QW5pbShhbmltT3B0OiBJTW9kZWxBbmltT3B0KSB7XHJcbiAgICAgICAgdGhpcy5hbmltT3B0ID0gYW5pbU9wdDtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW0oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0QW5pbVNwZWVkKGFuaW1OYW1lOiBzdHJpbmcsIHNwZWVkOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFuaW1TcGVlZEN0cmxbMF0gPSBhbmltTmFtZTtcclxuICAgICAgICB0aGlzLmFuaW1TcGVlZEN0cmxbMV0gPSBzcGVlZDtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW1TcGVlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdG9wQW5pbSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1PcHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHBhdXNlQW5pbSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltT3B0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlUG9zdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5wb3NpdE5vZGUoPElUcmFuc2Zvcm1PYmoyPnRoaXMucm9vdEltcGwsIHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlU2NhbGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NhbGUgJiYgdGhpcy5yb290SW1wbCkge1xyXG4gICAgICAgICAgICBOb2RlVG9vbHMuc2NhbGVOb2RlKDxJVHJhbnNmb3JtT2JqMj50aGlzLnJvb3RJbXBsLCB0aGlzLnNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZVJvdGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5yb3RhdGUgJiYgdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5yb3RhdGVOb2RlKDxJVHJhbnNmb3JtT2JqMj50aGlzLmltcGwsIHRoaXMucm90YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZUxvb2tBdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5sb29rQXQgJiYgdGhpcy5pbXBsKSB7XHJcbiAgICAgICAgICAgIE5vZGVUb29scy5ub2RlTG9va0F0KDxCQUJZTE9OLk1lc2g+dGhpcy5pbXBsLCB0aGlzLmxvb2tBdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VMaW5rVUkoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGlua1VJICYmIHRoaXMucm9vdEltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5saW5rVUkubGlua1dpdGhNZXNoKHRoaXMucm9vdEltcGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlVmlzaWJsZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJvb3RJbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEltcGwuaXNWaXNpYmxlID0gdGhpcy5pc1Zpc2libGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVBdHRhY2hPcHQoKSB7XHJcbiAgICAgICAgbGV0IHVzZUNvdW50ID0gMDtcclxuICAgICAgICBsZXQgdGVtcEluZGV4ID0gMDtcclxuICAgICAgICBsZXQgbmV3TGlzdExlbiA9IDA7XHJcbiAgICAgICAgY29uc3QgbGlzdExlbiA9IHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGxlbiA9IGxpc3RMZW4gLSAxOyBsZW4gPj0gMDsgbGVuLS0pIHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gdGhpcy5hdHRhY2hPcHRMaXN0W2xlbl07XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0ICYmIG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNrZWxldG9uID0gdGhpcy5za2VsZXRvbk1hcC5nZXQob3B0LnNrZWxldG9uTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNrZWxldG9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBib25lSW5kZXggPSBza2VsZXRvbi5nZXRCb25lSW5kZXhCeU5hbWUob3B0LmJvbmVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm9uZUluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Lm1lc2guYXR0YWNoVG9Cb25lKHNrZWxldG9uLmJvbmVzW2JvbmVJbmRleF0sIDxCQUJZTE9OLk1lc2g+dGhpcy5yb290SW1wbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVUb29scy5ub2RlVHJhbnNmb3JtKG9wdC5tZXNoLCBvcHQudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0W2xlbl0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB1c2VDb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdMaXN0TGVuID0gbGlzdExlbiAtIHVzZUNvdW50O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBrID0gbGlzdExlbiAtIHVzZUNvdW50OyBpIDwgazsgaSsrKSB7XHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmF0dGFjaE9wdExpc3RbdGVtcEluZGV4XSA9PT0gdW5kZWZpbmVkICYmIHRlbXBJbmRleCA8IGxpc3RMZW4pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBJbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hPcHRMaXN0W3RlbXBJbmRleF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hPcHRMaXN0W2ldID0gdGhpcy5hdHRhY2hPcHRMaXN0W3RlbXBJbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXR0YWNoT3B0TGlzdC5sZW5ndGggPSBuZXdMaXN0TGVuO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDaGlsZE9wdCgpIHtcclxuICAgICAgICB0aGlzLmNoaWxkT3B0TGlzdC5mb3JFYWNoKChvcHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdCAmJiBvcHQuaXNGaW5pc2hlZCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdC5tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5tb2RlbC5yb290SW1wbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5pc0ZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Lm1vZGVsLnJvb3RJbXBsLnBhcmVudCA9IDxCQUJZTE9OLk1lc2g+dGhpcy5yb290SW1wbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTm9kZVRvb2xzLm5vZGVUcmFuc2Zvcm0ob3B0Lm1vZGVsLnJvb3RJbXBsLCBvcHQudHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdC5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHQuaXNGaW5pc2hlZCAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5tZXNoLnBhcmVudCA9IDxCQUJZTE9OLk1lc2g+dGhpcy5yb290SW1wbDtcclxuICAgICAgICAgICAgICAgICAgICBOb2RlVG9vbHMubm9kZVRyYW5zZm9ybShvcHQubWVzaCwgb3B0LnRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlQXR0YWNoKCkge1xyXG4gICAgICAgIC8vXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoYW5nZUFuaW0oKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbU9wdCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUFuaW1hdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlQW5pbVNwZWVkKCkge1xyXG4gICAgICAgIGlmICgoPEJBQllMT04uQW5pbWF0aW9uR3JvdXA+dGhpcy5hbmltYXRpb24pICYmICg8QkFCWUxPTi5BbmltYXRpb25Hcm91cD50aGlzLmFuaW1hdGlvbikubmFtZSA9PT0gdGhpcy5hbmltU3BlZWRDdHJsWzBdKSB7XHJcbiAgICAgICAgICAgICg8QkFCWUxPTi5BbmltYXRpb25Hcm91cD50aGlzLmFuaW1hdGlvbikuc3BlZWRSYXRpbyA9IHRoaXMuYW5pbVNwZWVkQ3RybFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOabtOaUueaooeWei+WKqOeUu1xyXG4gICAgICogQHBhcmFtIGFuaW1OYW1lIOebruagh+WKqOeUu+WQjeensFxyXG4gICAgICogQHBhcmFtIGlzTG9vcCDmmK/lkKblvqrnjq/mkq3mlL5cclxuICAgICAqIEBwYXJhbSBzdG9wRmxhZyDliqjnlLvlgZzmraLphY3nva5cclxuICAgICAqIEBwYXJhbSBlbmRDYWxsIOWKqOeUu+e7k+adn+Wbnuiwg1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNoYW5nZUFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5hbmltT3B0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwZWVkICAgICA9IHRoaXMuYW5pbU9wdC5zcGVlZCA9PT0gdW5kZWZpbmVkID8gMSA6IHRoaXMuYW5pbU9wdC5zcGVlZDtcclxuICAgICAgICAgICAgY29uc3QgYW5pbU5hbWUgID0gdGhpcy5hbmltT3B0LmFuaW1OYW1lO1xyXG4gICAgICAgICAgICBjb25zdCBlbmRDYWxsICAgPSB0aGlzLmFuaW1PcHQuZW5kQ2FsbDtcclxuICAgICAgICAgICAgY29uc3QgaXNMb29wICAgID0gdGhpcy5hbmltT3B0LmlzTG9vcDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1Hcm91cCA9IHRoaXMuYW5pbWF0aW9uTWFwLmdldChhbmltTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5pbUdyb3VwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhbmltR3JvdXAuaXNTdGFydGVkICYmIGlzTG9vcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHthbmltTmFtZX0g5Yqo55S75bey57uP5omn6KGM77yBYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbUdyb3VwLm9uQW5pbWF0aW9uR3JvdXBFbmRPYnNlcnZhYmxlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbUdyb3VwLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBhbmltR3JvdXAub25BbmltYXRpb25Hcm91cEVuZE9ic2VydmFibGUuYWRkKHRoaXMuYW5pbUVuZENhbGwpO1xyXG4gICAgICAgICAgICAgICAgYW5pbUdyb3VwLnN0YXJ0KGlzTG9vcCwgc3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYW5pbU9wdC5nb0VuZCkgeyAgICAgICAvLyDmmK/lkKbot7PovazliLDliqjnlLvmnIDlkI7kuIDluKco6Z2e5b6q546v5Yqo55S76K6+572uKVxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Hcm91cC5nb1RvRnJhbWUoYW5pbUdyb3VwLnRvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHthbmltTmFtZX0g5Yqo55S75LiN5a2Y5Zyo77yBYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbUVuZENCID0gZW5kQ2FsbDtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBhbmltR3JvdXA7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBbmltYXRpb25Mb29wID0gaXNMb29wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0b3BBbmltYXRpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uICYmIHRoaXMuYW5pbWF0aW9uLmlzU3RhcnRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5vbkFuaW1hdGlvbkdyb3VwRW5kT2JzZXJ2YWJsZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXVzZUFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbiAmJiB0aGlzLmFuaW1hdGlvbi5wYXVzZSgpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOWcuuaZr+aVsOaNrue7k+aehCAtIOmrmOWxglxyXG4gKi9cclxuaW1wb3J0IHsgTm9kZVRvb2xzIH0gZnJvbSAnLi9zY2VuZV90b29sJztcclxuaW1wb3J0IHsgSW5zZXJ0TW9kZWxPYmosIEFwcGVuZE1vZGVsT2JqIH0gZnJvbSAnLi9tb2RlbF9pbnN0YW5jZSc7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8qKlxyXG4gKiDpobnnm67moYbmnrbkuIsgLSDlnLrmma/kuK3mlbDmja7nu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2NlbmUzREV2ZW50SW5mbyB7XHJcbiAgICBlOiBCQUJZTE9OLlBvaW50ZXJJbmZvO1xyXG4gICAgczogQkFCWUxPTi5FdmVudFN0YXRlO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBDQU1FUkFUWVBFUyB7XHJcbiAgICBBcmNSb3RhdGVDYW1lcmEgPSAnQXJjUm90YXRlQ2FtZXJhJyxcclxuICAgIFVuaXZlcnNhbENhbWVyYSA9ICdVbml2ZXJzYWxDYW1lcmEnLFxyXG4gICAgVGFyZ2V0Q2FtZXJhID0gJ1RhcmdldENhbWVyYSdcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVuZGVyRmxhZ3Mge1xyXG4gICAgYWN0aXZlID0gJ2FjdGl2ZScsXHJcbiAgICBwYXVzZSA9ICdwYXVzZScsXHJcbiAgICBkaXNwb3NlID0gJ2Rpc3Bvc2UnXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIExJR0hUVFlQRVMge1xyXG4gICAgSGVtaXNwaGVyaWNMaWdodCA9ICdIZW1pc3BoZXJpY0xpZ2h0J1xyXG59XHJcblxyXG5leHBvcnQgbGV0IFJlc1BhdGggICAgICA9ICdnYW1lL2FwcC9zY2VuZV9yZXMvcmVzLyc7XHJcbmV4cG9ydCBsZXQgU2NlbmVSZXNQYXRoID0gJ3NjZW5lcy8nO1xyXG5leHBvcnQgbGV0IE1vZGVsUmVzUGF0aCA9ICdtb2RlbHMvJztcclxuZXhwb3J0IGxldCBOb2RlUmVzUGF0aCAgPSAnbW9kZWxzLyc7XHJcbmV4cG9ydCBsZXQgRWZmZWN0UmVzUGF0aCA9ICdlZmZlY3RzLyc7XHJcblxyXG4vKipcclxuICog5Zy65pmv5YaF5Y+v5YGa5Y+Y5o2i55qE5a+56LGh57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2Zvcm1PYmoge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnlrprkvY1cclxuICAgICAqL1xyXG4gICAgcG9zaXRpb24/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rFxyXG4gICAgICovXHJcbiAgICByb3RhdGlvbj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxpbmc/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDlnLrmma/lhoXlj6/lgZrlj5jmjaLnmoTlr7nosaHnu5PmnoRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zZm9ybU9iajIge1xyXG4gICAgLyoqXHJcbiAgICAgKiAzRCDoioLngrnlrprkvY1cclxuICAgICAqL1xyXG4gICAgcG9zaXRpb24/OiBCQUJZTE9OLlZlY3RvcjM7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rFxyXG4gICAgICovXHJcbiAgICByb3RhdGlvbj86IEJBQllMT04uVmVjdG9yMztcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxpbmc/OiBCQUJZTE9OLlZlY3RvcjM7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueaXi+i9rOWbm+WFg+aVsFxyXG4gICAgICovXHJcbiAgICByb3RhdGlvblF1YXRlcm5pb24/OiBCQUJZTE9OLlF1YXRlcm5pb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAzRCDoioLngrnlj5jmjaLphY3nva5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zZm9ybUNmZyB7XHJcbiAgICAvKipcclxuICAgICAqIDNEIOiKgueCueWumuS9jVxyXG4gICAgICovXHJcbiAgICBwb3NpdGlvbj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K55peL6L2sXHJcbiAgICAgKi9cclxuICAgIHJvdGF0ZT86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIC8qKlxyXG4gICAgICogM0Qg6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIHNjYWxlPzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG59XHJcblxyXG4vKipcclxuICog5qih5Z6L5pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbEluc3RhbmNlIGV4dGVuZHMgSVRyYW5zZm9ybU9iaiB7XHJcbiAgICByYXlJRDogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOWQjeensFxyXG4gICAgICovXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg6LWE5rqQ5a2Q6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIHBhdGg6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDmlofku7blkI3np7BcclxuICAgICAqL1xyXG4gICAgZmlsZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog6IqC54K5L+aooeWeiyDotYTmupDmlofku7bkuK3mqKHlnovlkI3np7BcclxuICAgICAqL1xyXG4gICAgbW9kZWxOYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrkv5qih5Z6LIOi1hOa6kOWKoOi9veaIkOWKn+Wbnuiwg1xyXG4gICAgICovXHJcbiAgICBsb2FkZWRDYWxsPzogRnVuY3Rpb247XHJcbiAgICAvKipcclxuICAgICAqIOiKgueCuS/mqKHlnosg6LWE5rqQ5Yqg6L295oiQ5Yqf5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIGluc2VydGVkQ2FsbD86IEZ1bmN0aW9uO1xyXG59XHJcblxyXG4vKipcclxuICog5qih5Z6L5Yqg6L296YWN572u5pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbE9wdCB7XHJcbiAgICAvKipcclxuICAgICAqIOeItuiKgueCuVxyXG4gICAgICovXHJcbiAgICBwYXJlbnQ/OiBJbnNlcnRNb2RlbE9iajtcclxuICAgIC8qKlxyXG4gICAgICogcmF5SURcclxuICAgICAqL1xyXG4gICAgcmF5SUQ/OiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOimgeWKoOi9veeahOaooeWei+WQjeensFxyXG4gICAgICogKiDnvo7mnK/otYTmupAoR0xURikg5Lit5a6a5LmJ55qE5qih5Z6L5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIG1vZGVsTmFtZTogc3RyaW5nIHwgbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICog6KaB5Yqg6L2955qE5qih5Z6L5Zyo5omA5bGe6LWE5rqQ566h55CG6Lev5b6E5LiL55qE5a2Q6Lev5b6EXHJcbiAgICAgKiAqIOi1hOa6kOaWh+S7tuWtkOi3r+W+hFxyXG4gICAgICovXHJcbiAgICBwYXRoPzogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDopoHliqDovb3nmoTmqKHlnovnmoTotYTmupDmlofku7blkI3np7BcclxuICAgICAqICog6LWE5rqQ5paH5Lu25ZCN56ewXHJcbiAgICAgKi9cclxuICAgIGZpbGVOYW1lOiBzdHJpbmc7XHJcbiAgICBvbmx5VXNlUm9vdD86IGJvb2xlYW47XHJcbiAgICBpc0VmZmVjdD86IGJvb2xlYW47XHJcbiAgICBhbmltRGVmYXVsdD86IGJvb2xlYW47XHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9veaIkOWKn+eahOWbnuiwg1xyXG4gICAgICovXHJcbiAgICBsb2FkZWRDYWxsPyhtb2RlbDogQXBwZW5kTW9kZWxPYmopOiBhbnk7XHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9veaIkOWKn+eahOWbnuiwg1xyXG4gICAgICovXHJcbiAgICBpbnNlcnRlZENhbGw/KG1vZGVsOiBJbnNlcnRNb2RlbE9iaik6IGFueTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOaooeWei+eahCDlrZAg5qih5Z6L5Yqg6L295pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbENoaWxkT3B0IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6L5Yqg6L295Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIG1vZGVsT3B0PzogSU1vZGVsT3B0O1xyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHlnotcclxuICAgICAqL1xyXG4gICAgbW9kZWw/OiBJbnNlcnRNb2RlbE9iajtcclxuICAgIC8qKlxyXG4gICAgICogTUVTSFxyXG4gICAgICovXHJcbiAgICBtZXNoPzogQkFCWUxPTi5NZXNoO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlj5jmjaLorr7nva5cclxuICAgICAqL1xyXG4gICAgdHJhbnNmb3JtPzogSVRyYW5zZm9ybUNmZztcclxuICAgIC8qKlxyXG4gICAgICog6ZmE5Yqg5oiQ5Yqf5qCH6K+GXHJcbiAgICAgKi9cclxuICAgIGlzRmluaXNoZWQ/OiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovInlpb3nmoTli5Xnlavni4DmhYtcclxuICAgICAqL1xyXG4gICAgaXNMb29wPzogYm9vbGVhbjtcclxuXHJcbiAgICBzdWNjZXNzQ2FsbD8oT1BUOiBJTW9kZWxDaGlsZE9wdCk6IHZvaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmqKHlnovnmoQg6ZmE5YqgPOmZhOWKoOS6juS4gOS4quaooeWei+S4ij4g5pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbEF0dGFjaE9wdCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOaooeWei+WKoOi9veWPguaVsFxyXG4gICAgICovXHJcbiAgICBtb2RlbE9wdD86IElNb2RlbE9wdDtcclxuICAgIC8qKlxyXG4gICAgICog5qih5Z6LXHJcbiAgICAgKi9cclxuICAgIG1vZGVsPzogSW5zZXJ0TW9kZWxPYmo7XHJcbiAgICAvKipcclxuICAgICAqIE1FU0hcclxuICAgICAqL1xyXG4gICAgbWVzaD86IEJBQllMT04uTWVzaDtcclxuICAgIC8qKlxyXG4gICAgICog6ZmE5Yqg5Yiw55uu5qCHIHNrZWxldG9uXHJcbiAgICAgKi9cclxuICAgIHNrZWxldG9uTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmYTliqDliLDnm67moIcg6aqo5aS0XHJcbiAgICAgKi9cclxuICAgIGJvbmVOYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOWPmOaNouiuvue9rlxyXG4gICAgICovXHJcbiAgICB0cmFuc2Zvcm0/OiBJVHJhbnNmb3JtQ2ZnO1xyXG59XHJcblxyXG4vKipcclxuICog5qih5Z6L5Yqo55S76YWN572uIOaVsOaNrue7k+aehFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJTW9kZWxBbmltT3B0IHtcclxuICAgIC8qKlxyXG4gICAgICog55uu5qCH5Yqo55S75ZCN56ewXHJcbiAgICAgKi9cclxuICAgIGFuaW1OYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGdvRW5kPzogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5b6q546v5pKt5pS+XHJcbiAgICAgKi9cclxuICAgIGlzTG9vcDogYm9vbGVhbjtcclxuICAgIC8qKlxyXG4gICAgICog5Yqo55S757uT5p2f54q25oCBXHJcbiAgICAgKi9cclxuICAgIHN0b3BGbGFnPzogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqjnlLvnu5PmnZ/lm57osINcclxuICAgICAqL1xyXG4gICAgZW5kQ2FsbD86IEZ1bmN0aW9uO1xyXG4gICAgLyoqXHJcbiAgICAgKiDliqjnlLvpgJ/luqZcclxuICAgICAqL1xyXG4gICAgc3BlZWQ/OiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuimgeWBnOatouWJjeS4gOS4quWKqOeUu1xyXG4gICAgICovXHJcbiAgICBuZWVkU3RvcD86IGJvb2xlYW47XHJcbn0iLCJpbXBvcnQgeyBSZW5kZXJGbGFncywgSU1vZGVsT3B0IH0gZnJvbSBcIi4vc2NlbmVfYmFzZVwiO1xyXG5pbXBvcnQgeyBJbnNlcnRNb2RlbE9iaiwgQXBwZW5kTW9kZWxPYmogfSBmcm9tIFwiLi9tb2RlbF9pbnN0YW5jZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lSW5zdGFuY2Uge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyByZWFkb25seSBzY2VuZTogQkFCWUxPTi5TY2VuZTtcclxuICAgIHB1YmxpYyByZWFkb25seSBlbmdpbmU6IEJBQllMT04uRW5naW5lO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyRmxhZzogUmVuZGVyRmxhZ3M7XHJcbiAgICBwcml2YXRlIF9jYW1lcmE6IEJBQllMT04uQ2FtZXJhIHwgdW5kZWZpbmVkO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlnLrmma/lhoXmuLLmn5PlhYnooahcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWdodE1hcDogTWFwPHN0cmluZywgQkFCWUxPTi5MaWdodD4gPSBuZXcgTWFwKCk7XHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+WGheebuOacuuihqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2FtZXJhTWFwOiBNYXA8c3RyaW5nLCBCQUJZTE9OLkNhbWVyYT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBlbmdpbmU6IEJBQllMT04uRW5naW5lLCBvcHQ/OiBCQUJZTE9OLlNjZW5lT3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMubmFtZSAgID0gbmFtZTtcclxuICAgICAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcclxuICAgICAgICB0aGlzLnNjZW5lICA9IG5ldyBCQUJZTE9OLlNjZW5lKGVuZ2luZSwgb3B0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmFNYXAgICAgICA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnICAgID0gUmVuZGVyRmxhZ3MucGF1c2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTGlnaHQobG5hbWU6IHN0cmluZywgbGlnaHQ6IEJBQllMT04uTGlnaHQpIHtcclxuICAgICAgICBpZiAodGhpcy5saWdodE1hcC5nZXQobG5hbWUpKSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0TWFwLnNldChsbmFtZSwgbGlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVMaWdodChsbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGlnaHRNYXAuZ2V0KGxuYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0TWFwLmRlbGV0ZShsbmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyByZWFkTGlnaHQobG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxpZ2h0TWFwLmdldChsbmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZUNhbWVyYSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FtZXJhO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBhY3RpdmVDYW1lcmEoY2FtZXJhOiBCQUJZTE9OLkNhbWVyYSB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChjYW1lcmEpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFjdGl2ZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbmRlckZsYWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckZsYWc7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHJlbmRlckZsYWcoZmxhZzogUmVuZGVyRmxhZ3MpIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnID0gZmxhZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0aXZlT2JzZXJ2ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBTY2VuZSAke3RoaXMubmFtZX0gYWN0aXZlIWApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGRpc3Bvc2VPYnNlcnZlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLndhcm4oYFNjZW5lICR7dGhpcy5uYW1lfSBkaXNwb3NlIWApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNoYW5nZUNhbWVyYU9ic2VydmVyID0gKGNhbWVyYTogQkFCWUxPTi5DYW1lcmEpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgU2NlbmUgJHt0aGlzLm5hbWV9IGNhbWVyYSBjaGFuZ2U6ICR7Y2FtZXJhLm5hbWV9YCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlQ2FtZXJhT2JzZXJ2ZXIgPSAoY2FtZXJhOiBCQUJZTE9OLkNhbWVyYSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBTY2VuZSAke3RoaXMubmFtZX0gY2FtZXJhIGNoYW5nZTogJHtjYW1lcmEubmFtZX1gKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5b2T5YmN5rS75Yqo55u45py6XHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhTmFtZSDnm67moIfnm7jmnLrlkI3np7BcclxuICAgICAqICog5Zyo5Zy65pmv5YaF6YOo55u45py66KGo5Lit5p+l5om+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRBY3RpdmVDYW1lcmEoY2FtZXJhTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdGhpcy5jYW1lcmFNYXAuZ2V0KGNhbWVyYU5hbWUpO1xyXG4gICAgICAgIGlmICghIWNhbWVyYSkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhbWVyYSA9IGNhbWVyYTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQ2FtZXJhT2JzZXJ2ZXIodGhpcy5hY3RpdmVDYW1lcmEpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgKEZvcm1hdENhbnZhc0Rpc3BsYXkuZ2V0SXNXZWl4aW5HQU1FKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIENhbWVyYVRvb2wuY29tcHV0ZVZpZXdQb3J0KGNhbWVyYSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFNjZW5lU3RydWN0LnNldEN1cnJDYW1lcmHvvJrnm67moIflnLrmma/msqHmnIlOYW1l5Li6JHtjYW1lcmFOYW1lfeeahOebuOacumApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6ZSA5q+B55u45py6XHJcbiAgICAgKiBAcGFyYW0gY2FtZXJhTmFtZSDnm67moIfnm7jmnLrlkI3np7BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUNhbWVyYShjYW1lcmFOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNhbWVyYU1hcC5nZXQoY2FtZXJhTmFtZSk7XHJcblxyXG4gICAgICAgIGlmIChjYW1lcmEgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ2FtZXJhID09PSBjYW1lcmEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2FtZXJhT2JzZXJ2ZXIoY2FtZXJhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FtZXJhICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckZsYWcgICAgID0gUmVuZGVyRmxhZ3MucGF1c2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhTWFwLmRlbGV0ZShjYW1lcmFOYW1lKTtcclxuICAgICAgICAgICAgY2FtZXJhLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYSDnm67moIfnm7jmnLrlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENhbWVyYShjYW1lcmE6IEJBQllMT04uQ2FtZXJhKSB7XHJcbiAgICAgICAgdGhpcy5jYW1lcmFNYXAuc2V0KGNhbWVyYS5uYW1lLCBjYW1lcmEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwaWNrQ2FsbCA9IChlOiBCQUJZTE9OLlBvaW50ZXJJbmZvLCBzOiBCQUJZTE9OLkV2ZW50U3RhdGUpID0+IHtcclxuICAgICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZSA5q+BXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG5cclxuICAgICAgICB0aGlzLnNjZW5lLmRpc3Bvc2UoKTtcclxuICAgICAgICB0aGlzLl9jYW1lcmEgICAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJGbGFnID0gUmVuZGVyRmxhZ3MuZGlzcG9zZTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW1lcmFNYXAuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwb3NlT2JzZXJ2ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaaguWBnOa4suafk1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGF1c2UgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJGbGFnID0gUmVuZGVyRmxhZ3MucGF1c2U7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5vblBvaW50ZXJPYnNlcnZhYmxlLnJlbW92ZUNhbGxiYWNrKHRoaXMucGlja0NhbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5r+A5rS75riy5p+TXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgLy8g5pyq6ZSA5q+BXHJcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyRmxhZyAhPT0gUmVuZGVyRmxhZ3MuZGlzcG9zZSkge1xyXG5cclxuICAgICAgICAgICAgLy8g5pyq5r+A5rS7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlckZsYWcgIT09IFJlbmRlckZsYWdzLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNjZW5lLm9uUG9pbnRlck9ic2VydmFibGUuaGFzT2JzZXJ2ZXJzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5vblBvaW50ZXJPYnNlcnZhYmxlLmFkZCh0aGlzLnBpY2tDYWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmxhZyA9IFJlbmRlckZsYWdzLmFjdGl2ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVPYnNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYOWcuuaZryAke3RoaXMubmFtZX0g5pyq5YeG5aSH5a6M5q+V77yM5LiN6IO95r+A5rS7YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGDlnLrmma8gJHt0aGlzLm5hbWV9IOmHjeWkjea/gOa0u2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGDlnLrmma8gJHt0aGlzLm5hbWV9IOW3suiiq+mUgOavgWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5qOA5p+l5Zy65pmv5piv5ZCm5YeG5aSH57uT5p2f77yM5Y+v5r+A5rS7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1JlYWR5KCkge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgJiYgdGhpcy5hY3RpdmVDYW1lcmEgIT09IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNjZW5lSW5zdGFuY2UzRCBleHRlbmRzIFNjZW5lSW5zdGFuY2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlnLrmma/lhoUg5Zy65pmv546v5aKD57qn5Yir6IqC54K56KGoXHJcbiAgICAgKiAqIGFwcGVuZCDmlrnlvI/liqDovb3nmoRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhcHBlbmRNZXNoTWFwOiBNYXA8c3RyaW5nLCBBcHBlbmRNb2RlbE9iaj4gPSBuZXcgTWFwKCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc2VydE1lc2hNYXA6IE1hcDxzdHJpbmcsIEluc2VydE1vZGVsT2JqPiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwb2ludGVyRG93bkxpc3Rlbk1hcDogICBNYXA8RnVuY3Rpb24sIChpbmZvOiBhbnkpID0+IGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcG9pbnRlck1vdmVMaXN0ZW5NYXA6ICAgTWFwPEZ1bmN0aW9uLCAoaW5mbzogYW55KSA9PiBhbnk+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBvaW50ZXJVcExpc3Rlbk1hcDogICAgIE1hcDxGdW5jdGlvbiwgKGluZm86IGFueSkgPT4gYW55PiA9IG5ldyBNYXAoKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBwb2ludGVyQ2xpY2tMaXN0ZW5NYXA6ICBNYXA8RnVuY3Rpb24sIChpbmZvOiBhbnkpID0+IGFueT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7zlhaXlnLrmma/mqKHlnotcclxuICAgICAqIEBwYXJhbSBvYmpOYW1lIOaooeWei+WRveWQjVxyXG4gICAgICogKiDnlKjkuo7pobnnm67lsYLnrqHnkIZcclxuICAgICAqIEBwYXJhbSBvcHQg5qih5Z6L5Yqg6L296YWN572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBlbmRTY2VuZShvYmpOYW1lOiBzdHJpbmcsIG9wdDogSU1vZGVsT3B0ID0gPGFueT57fSkge1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gbmV3IEFwcGVuZE1vZGVsT2JqKG9iak5hbWUsIHRoaXMsIG9wdCk7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwZW5kTWVzaE1hcC5zZXQob2JqTmFtZSwgbW9kZWwpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZUFwcGVuZChtb2RlbDogQXBwZW5kTW9kZWxPYmopIHtcclxuICAgICAgICB0aGlzLmFwcGVuZE1lc2hNYXAuZGVsZXRlKG1vZGVsLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5o+S5YWl5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gb2JqTmFtZSDmqKHlnovlkb3lkI1cclxuICAgICAqICog55So5LqO6aG555uu5bGC566h55CGXHJcbiAgICAgKiBAcGFyYW0gb3B0IOaooeWei+WKoOi9vemFjee9rlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5zZXJ0TWVzaChvYmpOYW1lOiBzdHJpbmcsIG9wdDogSU1vZGVsT3B0ID0gPGFueT57fSkge1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bm5lY2Vzc2FyeS1sb2NhbC12YXJpYWJsZVxyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gbmV3IEluc2VydE1vZGVsT2JqKG9iak5hbWUsIHRoaXMsIG9wdCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5zZXJ0TWVzaE1hcC5zZXQob2JqTmFtZSwgbW9kZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUluc2VydChtb2RlbDogSW5zZXJ0TW9kZWxPYmopIHtcclxuICAgICAgICB0aGlzLmluc2VydE1lc2hNYXAuZGVsZXRlKG1vZGVsLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREb3duTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJEb3duTGlzdGVuTWFwLnNldChsaXN0ZW5lciwgbGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZURvd25MaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckRvd25MaXN0ZW5NYXAuZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRVcExpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyVXBMaXN0ZW5NYXAuc2V0KGxpc3RlbmVyLCBsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlVXBMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlclVwTGlzdGVuTWFwLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTW92ZUxpc3RlbiA9IChsaXN0ZW5lcjogKGluZm86IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZUxpc3Rlbk1hcC5zZXQobGlzdGVuZXIsIGxpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVNb3ZlTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuTWFwLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkQ2xpY2tMaXN0ZW4gPSAobGlzdGVuZXI6IChpbmZvOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMucG9pbnRlckNsaWNrTGlzdGVuTWFwLnNldChsaXN0ZW5lciwgbGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZUNsaWNrTGlzdGVuID0gKGxpc3RlbmVyOiAoaW5mbzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJDbGlja0xpc3Rlbk1hcC5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZSA5q+BXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCkge1xyXG4gICAgICAgIHN1cGVyLmRpc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBlbmRNZXNoTWFwLmNsZWFyKCk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHsgSVRyYW5zZm9ybUNmZywgSVRyYW5zZm9ybU9iajIgfSBmcm9tICcuL3NjZW5lX2Jhc2UnO1xyXG5pbXBvcnQgeyBBcHBlbmRNb2RlbE9iaiwgSW5zZXJ0TW9kZWxPYmogfSBmcm9tICcuL21vZGVsX2luc3RhbmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb2RlVG9vbHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiDml4vovawgTWVzaCAtIOiHqui9rFxyXG4gICAgICogQHBhcmFtIG1lc2gg55uu5qCHbWVzaFxyXG4gICAgICogQHBhcmFtIHJvdGF0ZSDml4vovazlj4LmlbDvvJogWyB4LCB5LCB6IF1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVOb2RlKG5vZGU6IElUcmFuc2Zvcm1PYmoyLCByb3RhdGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIGlmICghbm9kZS5yb3RhdGlvblF1YXRlcm5pb24pIHtcclxuICAgICAgICAgICAgbm9kZS5yb3RhdGlvblF1YXRlcm5pb24gPSBuZXcgQkFCWUxPTi5RdWF0ZXJuaW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBOb2RlVG9vbHMucm90YXRlUXVhdGVybmlvbihub2RlLnJvdGF0aW9uUXVhdGVybmlvbiwgcm90YXRlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5peL6L2sIE1lc2ggLSDoh6rovaxcclxuICAgICAqIEBwYXJhbSBxdWF0ZXJuaW9uIOebruaghyBRdWF0ZXJuaW9uXHJcbiAgICAgKiBAcGFyYW0gcm90YXRlIOaXi+i9rOWPguaVsO+8miBbIHgsIHksIHogXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZVF1YXRlcm5pb24ocXVhdGVybmlvbjogQkFCWUxPTi5RdWF0ZXJuaW9uLCByb3RhdGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIC8vIFlYWlxyXG4gICAgICAgIEJBQllMT04uUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbFRvUmVmKHJvdGF0ZVsxXSAtIE1hdGguUEksIHJvdGF0ZVswXSwgLXJvdGF0ZVsyXSwgcXVhdGVybmlvbik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHBvc2l0Tm9kZShub2RlOiBJVHJhbnNmb3JtT2JqMiwgZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgLy8gbm9kZS5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoLWRhdGFbMF0sIGRhdGFbMV0sIC1kYXRhWzJdKTtcclxuICAgICAgICAoPEJBQllMT04uVmVjdG9yMz5ub2RlLnBvc2l0aW9uKS5zZXQoLWRhdGFbMF0sIGRhdGFbMV0sIC1kYXRhWzJdKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGVOb2RlKG5vZGU6IElUcmFuc2Zvcm1PYmoyLCBkYXRhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBub2RlLnNjYWxpbmcgPSBuZXcgQkFCWUxPTi5WZWN0b3IzKGRhdGFbMF0sIGRhdGFbMV0sIC1kYXRhWzJdKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgbm9kZUxvb2tBdChub2RlOiBCQUJZTE9OLk1lc2gsIGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIG5vZGUubG9va0F0KG5ldyBCQUJZTE9OLlZlY3RvcjMoZGF0YVswXSwgZGF0YVsxXSwgLWRhdGFbMl0pKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgbm9kZVRyYW5zZm9ybShub2RlOiBCQUJZTE9OLk1lc2gsIHRyYW5zZm9ybTogSVRyYW5zZm9ybUNmZyB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0cmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtLnBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBOb2RlVG9vbHMucG9zaXROb2RlKDxJVHJhbnNmb3JtT2JqMj5ub2RlLCB0cmFuc2Zvcm0ucG9zaXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm0uc2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIE5vZGVUb29scy5zY2FsZU5vZGUoPElUcmFuc2Zvcm1PYmoyPm5vZGUsIHRyYW5zZm9ybS5zY2FsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIE5vZGVUb29scy5yb3RhdGVOb2RlKDxJVHJhbnNmb3JtT2JqMj5ub2RlLCB0cmFuc2Zvcm0ucm90YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRlUG9zaXRpb24oZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgZGF0YVswXSA9IC1kYXRhWzBdO1xyXG4gICAgICAgIGRhdGFbMV0gPSBkYXRhWzFdO1xyXG4gICAgICAgIGRhdGFbMl0gPSAtZGF0YVsyXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRlUm90YXRlKGRhdGE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIGRhdGFbMF0gPSBkYXRhWzBdO1xyXG4gICAgICAgIGRhdGFbMV0gPSBkYXRhWzFdIC0gTWF0aC5QSTtcclxuICAgICAgICBkYXRhWzJdID0gLWRhdGFbMl07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0ZVF1YXRlcm5pb24oZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbjogQkFCWUxPTi5RdWF0ZXJuaW9uID0gbmV3IEJBQllMT04uUXVhdGVybmlvbigpO1xyXG4gICAgICAgIE5vZGVUb29scy5yb3RhdGVRdWF0ZXJuaW9uKHF1YXRlcm5pb24sIGRhdGEpO1xyXG5cclxuICAgICAgICByZXR1cm4gcXVhdGVybmlvbjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRlU2NhbGUoZGF0YTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgZGF0YVswXSA9IGRhdGFbMF07XHJcbiAgICAgICAgZGF0YVsxXSA9IGRhdGFbMV07XHJcbiAgICAgICAgZGF0YVsyXSA9IC1kYXRhWzJdO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktY2xhc3NcclxuZXhwb3J0IGNsYXNzIExvYWRlclRvb2wge1xyXG4gICAgcHVibGljIHN0YXRpYyBhcHBlbmRNZXNoKG1vZGVsOiBBcHBlbmRNb2RlbE9iaikge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgICAgICA9IG1vZGVsLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcGF0aCAgICAgID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSAgPSBtb2RlbC5maWxlTmFtZTtcclxuICAgICAgICBjb25zdCBtb2RlbE5hbWUgPSBtb2RlbC5tb2RlbE5hbWU7XHJcbiAgICAgICAgY29uc3Qgc2NlbmVJbXBsID0gbW9kZWwuc2NlbmUuc2NlbmU7XHJcblxyXG4gICAgICAgIC8vIEJBQllMT04uU2NlbmVMb2FkZXIuQXBwZW5kKGAke1Jlc1BhdGh9JHtTY2VuZVJlc1BhdGh9JHtwYXRofWAsIGAke2ZpbGVOYW1lfS5zY2VuZS5nbHRmYCwgc2NlbmVJbXBsLCBtb2RlbC5hcHBlbmVkKTtcclxuICAgICAgICBCQUJZTE9OLlNjZW5lTG9hZGVyLkFwcGVuZEFzeW5jKGAke3BhdGh9YCwgYCR7ZmlsZU5hbWV9YCwgc2NlbmVJbXBsKS50aGVuKFxyXG4gICAgICAgICAgICAocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbC5hcHBlbmVkKHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTWVzaChtb2RlbDogSW5zZXJ0TW9kZWxPYmopIHtcclxuICAgICAgICBjb25zdCBuYW1lID0gbW9kZWwubmFtZTtcclxuICAgICAgICBjb25zdCBwYXRoID0gbW9kZWwucGF0aDtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IG1vZGVsLmZpbGVOYW1lO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm1vZGVsTmFtZTtcclxuICAgICAgICBjb25zdCBzY2VuZUltcGwgPSBtb2RlbC5zY2VuZS5zY2VuZTtcclxuXHJcbiAgICAgICAgQkFCWUxPTi5TY2VuZUxvYWRlci5JbXBvcnRNZXNoKG1vZGVsTmFtZSwgYCR7cGF0aH1gLCBgJHtmaWxlTmFtZX1gLCBzY2VuZUltcGwsIG1vZGVsLmxvYWRlZCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRFZmZlY3QobW9kZWw6IEluc2VydE1vZGVsT2JqKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IG1vZGVsLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IG1vZGVsLnBhdGg7XHJcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBtb2RlbC5maWxlTmFtZTtcclxuICAgICAgICBjb25zdCBtb2RlbE5hbWUgPSBtb2RlbC5tb2RlbE5hbWU7XHJcbiAgICAgICAgY29uc3Qgc2NlbmVJbXBsID0gbW9kZWwuc2NlbmUuc2NlbmU7XHJcblxyXG4gICAgICAgIEJBQllMT04uU2NlbmVMb2FkZXIuSW1wb3J0TWVzaChtb2RlbE5hbWUsIGAke3BhdGh9YCwgYCR7ZmlsZU5hbWV9YCwgc2NlbmVJbXBsLCBtb2RlbC5sb2FkZWQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluZGV4IH0gZnJvbSBcIi4vYXBwL2RlbW8wMDBcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBJbml0T2sgPSAoKSA9PiB7XHJcbiAgICBJbmRleC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKVswXSk7XHJcbn07Il19
