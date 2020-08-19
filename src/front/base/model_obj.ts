import { AnimationGroupChange } from "./animation_group_change";
import { NodeTools, LoaderTool } from "./scene_tool";
import { IModelAnimOpt, IModelChildOpt, IModelAttachOpt, IModelOpt, IImageSolt, IMaterialSolt, INodeObj } from "./base";
import { SceneInstance3D } from "./scene_struct";

export class AppendModelObj implements INodeObj {
    public rayID: number = -1;
    public name: string;
    public path: string;
    public fileName: string | undefined;
    public modelName: string | string[] | undefined;
    public loadedCall: ((model: AppendModelObj) => any) | undefined;
    public scene: SceneInstance3D | undefined;
    // public impl: BABYLON.AbstractMesh;
    public rootImpl: BABYLON.AbstractMesh | undefined = undefined;
    public isDisposed: boolean = false;
    public isLoaded: boolean = false;
    private loadPromise: Promise<AppendModelObj> | undefined = undefined;
    public get isReady() {
        return this.rootImpl && this.rootImpl.isReady;
    }
    /**
     * 创建模型
     * @param meshName 模型对象命名
     * @param scene 目标场景
     * @param opt 模型配置 - 可以不传，后续通过 loadAsync 加载
     */
    constructor(meshName: string, scene: SceneInstance3D, opt: IModelOpt = {}) {
        this.name = meshName;
        this.scene = scene;
        this.path = opt.path || '';
        this.fileName = opt.fileName;
        this.modelName = opt.modelName;
        this.loadedCall = opt.loadedCall;

        if (this.fileName) {
            LoaderTool.loadScene(this);
        }
    }
    public dispose() {
        if (this.isLoaded) {
            this.rootImpl && this.rootImpl.dispose();
        }

        this.scene = undefined;

        this.loadPromise = undefined;
        this.isDisposed = true;
    }
    public appened = (scene: BABYLON.Scene) => {
        if (!this.isDisposed) {
            this.isLoaded = true;
            this.loadedCall && this.loadedCall(this);
        }
    }
    /**
     * 返回 Promise
     * @param opt 
     */
    public loadAsync(opt: IModelOpt) {
        if (!this.fileName) {
            this.path = opt.path || '';
            this.fileName = opt.fileName;
            this.modelName = opt.modelName;
            // this.loadedCall = opt.loadedCall;
            this.loadPromise = new Promise((resolve, reject) => {
                LoaderTool.loadSceneAsync(this).then(() => {
                    resolve(this);
                })
                .catch(reject);
            });
        } else {
            this.loadPromise = Promise.reject(`已在创建时进行加载`);
        }

        return this.loadPromise;
    }
}

export class InsertModelObj implements INodeObj {
    public rootImpl: BABYLON.AbstractMesh | undefined;
    public isDisposed: boolean = false;
    public isLoaded: boolean = false;
    public position: number[] | undefined;
    public scale: number[] | undefined;
    public rotate: number[] | undefined;
    public lookAt: number[] | undefined;
    public isVisible: boolean = false;
    public alpha: number = 1;
    public animOpt: IModelAnimOpt | undefined;
    public isEnabled: boolean;
    /**
     * 导入的动画是否默认播放
     */
    public animDefault: boolean = false;
    public particleAutoStart: boolean = true;
    public imageSolts: string[] | IImageSolt[] | undefined;
    public materialSolts: string[] | IMaterialSolt[] | undefined;
    /**
     * 切换动画时是否平滑过渡
     */
    public changeAnimEnableBlending: boolean = false;
    /**
     * 切换动画时过渡速度 默认 0.01
     */
    public changeAnimBlendSpeed: number = 0.01;
    public workWithAnimationGroupChange: boolean = false;
    public needDepthPrePass: boolean = false;
    public readonly scene: SceneInstance3D;
    /**
     * 父节点
     */
    // public parent: ModelObj;
    private _parent: InsertModelObj | undefined;
    public get parent() {
        return this._parent;
    }
    // public readonly rayID: number;
    private _rayID: number = -1;
    public get rayID() {
        return this._rayID;
    }
    // public readonly name: string;
    private _name: string = "";
    public get name() {
        return this._name;
    }
    // public readonly path: string;
    private _path: string | undefined;
    public get path() {
        return this._path;
    }
    // public readonly fileName: string;
    private _fileName: string | undefined;
    public get fileName() {
        return this._fileName;
    }
    // public readonly modelName: string | string[];
    private _modelName: string | string[] | undefined;
    public get modelName() {
        return this._modelName;
    }
    public insertedCall: ((model: InsertModelObj) => any) | undefined;
    public readonly meshMap: Map<string, BABYLON.AbstractMesh> = new Map();
    public readonly skeletonMap: Map<string, BABYLON.Skeleton> = new Map();
    public readonly animationMap: Map<string, BABYLON.AnimationGroup> = new Map();
    public readonly particleSysMap: Map<string, BABYLON.IParticleSystem> = new Map();
    public readonly particleSysList: BABYLON.IParticleSystem[] = [];
    public readonly attachOptList: (IModelAttachOpt | undefined)[] = [];
    public readonly childOptList: IModelChildOpt[] = [];
    /**
     * 动画执行结束的回调
     */
    private animEndCB: Function | undefined;
    /**
     * 模型当前动画
     */
    private animation: BABYLON.AnimationGroup | undefined;
    /**
     * 当前动画是否循环播放
     */
    private isAnimationLoop: boolean = false;
    private loadPromise: Promise<InsertModelObj> | undefined;
    private animEventMap: Map<string, BABYLON.AnimationEvent> | undefined;
    public get isReady() {
        return this.rootImpl && this.rootImpl.isReady;
    }
    constructor(meshName: string, scene: SceneInstance3D, opt: IModelOpt = {}) {
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
                    LoaderTool.insertMeshAsync(this).then(() => {
                        resolve(this);
                    });
                });
            } else {
                this.loadPromise = new Promise((resolve, reject) => {
                    LoaderTool.insertEffectAsync(this).then(() => {
                        resolve(this);
                    });
                });
            }
        }
    }
    /**
     * 添加动画事件监听
     * @param key 动画事件关键字
     * @param func 监听 - 返回值为 true 表示该监听仅生效一次
     */
    public addAnimationEventListen(key: string, func: (curFrame?: number) => boolean) {
        // if (this.loadPromise) {
        if (this.loadPromise && !1) {
            return this.loadPromise.then(() => {
                this.initAnimationEventMap();
                if (this.animEventMap) {
                    const event = this.animEventMap.get(key);
                    if (event) {
                        if ((<any>event)._pi_listenList.includes(func)) {
                            console.warn(`再次相同监听 AnimationEvent - ${key}, 被忽略`);
                        }
                        else {
                            (<any>event)._pi_addListen(func);
                        }
                        return;
                    }
                }
                console.warn(`AnimationEvent Not Found - ${key}`);
            });
        } else {
            return Promise.reject("未创建");
        }
    }
    /**
     * 返回 Promise
     * @param opt 
     */
    public loadAsync(opt: IModelOpt) {
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
                    LoaderTool.insertMeshAsync(this).then(() => {
                        resolve(this)
                    }).catch(reject);
                } else {
                    LoaderTool.insertEffectAsync(this).then(() => {
                        resolve(this)
                    }).catch(reject);
                }
            })
        }
        else {
            this.loadPromise = Promise.reject(`已在创建时进行加载`);
        }

        return this.loadPromise;
    }
    public dispose = () => {
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
            } else if (opt.mesh !== undefined) {
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
    }
    // tslint:disable-next-line:max-line-length
    public loaded = (meshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.IParticleSystem[], skeletons: BABYLON.Skeleton[], animationGroups: BABYLON.AnimationGroup[]) => {

        if (this.isDisposed) {
            meshes[0].dispose();

            return;
        }

        this.isLoaded = true;

        this.rootImpl = meshes[0];

        if (meshes !== undefined) {
            meshes.forEach((mesh) => {
                this.meshMap.set(mesh.id, mesh);
                (<any>mesh).rayID = this.rayID;
                if (mesh.material){
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
        } else if (!this.animDefault) {
            this.changeAnim();
        }

        if (this.insertedCall) {
            this.insertedCall(this);
        }
    }
    public animEndCall = () => {

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
    }
    public setAttach(opt: IModelAttachOpt) {
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
        } else if (opt.model !== undefined) {
            opt.mesh = opt.model.rootImpl;
            if (this.isLoaded) {
                this.updateAttachOpt();
            }
        } else if (opt.mesh !== undefined) {
            if (this.isLoaded) {
                this.updateAttachOpt();
            }
        }
    }
    public setChildModelOpt(opt: IModelChildOpt) {
        this.childOptList.push(opt);

        if (opt.modelOpt !== undefined) {
            opt.modelOpt.insertedCall = () => {
                if (this.isLoaded) {
                    this.updateChildOpt();
                }
                opt.successCall && opt.successCall(opt);
            };

            opt.model = this.scene.insertMesh(opt.name, opt.modelOpt);
        } else if (opt.model !== undefined) {
            if (this.isLoaded) {
                this.updateChildOpt();
            }
        } else if (opt.mesh !== undefined) {
            if (this.isLoaded) {
                this.updateChildOpt();
            }
        }
    }

    public setAlpha(data: number) {
        this.alpha = data;
        if (this.isLoaded) {
            this.changeAlpha();
        }
    }
    public setPostion(data: number[]) {
        this.position = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changePostion();
        }
    }
    public setScale(data: number[]) {
        this.scale = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeScale();
        }
    }
    public setRotate(data: number[]) {
        this.rotate = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeRotate();
        }
    }
    public setLookAt(data: number[]) {
        this.lookAt = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeLookAt();
        }
    }
    public setVisible(data: boolean) {
        this.isVisible = data;
        if (this.isLoaded) {
            this.changeVisible();
        }
    }

    public setEnabled(isEnabled: boolean) {
        this.isEnabled = isEnabled;
        if (this.isLoaded && this.isEnabled !== undefined) {
            this.changeEnable();
        }
    }

    public setAnim(animOpt: IModelAnimOpt) {
        this.animOpt = animOpt;
        if (this.isLoaded) {
            this.changeAnim();
        }
    }
    public stopAnim() {
        if (this.workWithAnimationGroupChange) {
            return;
        }
        if (this.isLoaded) {
            this.stopAnimation();
        } else {
            this.animOpt = undefined;
        }
    }
    public pauseAnim() {
        if (this.isLoaded) {
            this.pauseAnimation();
        } else {
            this.animOpt = undefined;
        }
    }
    private changeAlpha() {
        if (this.alpha !== undefined && this.alpha !== null && this.rootImpl) {
            this.rootImpl.getChildMeshes().forEach((mesh) => {
                if (mesh.material) {
                    mesh.material.alpha = this.alpha;
                }
            });
        }
    }
    private changePostion() {
        if (this.position && this.rootImpl) {
            NodeTools.positNode(this.rootImpl, this.position);
        }
    }
    private changeScale() {
        if (this.scale && this.rootImpl) {
            NodeTools.scaleNode(this.rootImpl, this.scale);
        }
    }
    private changeRotate() {
        if (this.rotate && this.rootImpl) {
            NodeTools.rotateNode(this.rootImpl, this.rotate);
        }
    }
    private changeLookAt() {
        if (this.lookAt && this.rootImpl) {
            NodeTools.nodeLookAt(this.rootImpl, this.lookAt);
        }
    }

    private changeVisible() {
        if (this.isVisible !== undefined && this.rootImpl) {
            this.rootImpl.isVisible = this.isVisible;
        }
    }

    private changeEnable() {
        if (this.isEnabled !== undefined && this.rootImpl) {
            this.rootImpl.setEnabled(this.isEnabled);
        }
    }
    private updateAttachOpt() {
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
                            opt.transform && NodeTools.nodeTransform(opt.mesh, opt.transform);
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
    private updateChildOpt() {
        this.childOptList.forEach((opt) => {
            if (opt.isFinished !== true) {
                if (opt.model !== undefined) {
                    if (opt.model.rootImpl !== undefined) {
                        opt.isFinished = true;
                        this.rootImpl && (opt.model.rootImpl.parent = this.rootImpl);
                        opt.transform && NodeTools.nodeTransform(opt.model.rootImpl, opt.transform);
                    }
                } else if (opt.mesh !== undefined) {
                    opt.isFinished = true;
                    this.rootImpl && (opt.mesh.parent = this.rootImpl);
                    opt.transform && NodeTools.nodeTransform(opt.mesh, opt.transform);
                }
            }
        });
    }
    private updateAttach() {
        //
    }
    private changeAnim() {
        if (this.workWithAnimationGroupChange) {
            if (this.animOpt) {
                this.animation = AnimationGroupChange.animChangeTo(this.name, this.animOpt.animName, this.animationMap, this.animation, this.animOpt ? this.animOpt.startCall : undefined, this.animOpt ? this.animOpt.endCall : undefined);
            }
        } else {
            this.stopAnimation();
            if (this.animOpt) {
                this.changeAnimation();
            }
        }
    }
    /**
     * 更改模型动画
     * @param animName 目标动画名称
     * @param isLoop 是否循环播放
     * @param stopFlag 动画停止配置
     * @param endCall 动画结束回调
     */
    private changeAnimation = () => {
        if (this.animOpt) {
            const speed = this.animOpt.speed === undefined ? 1 : this.animOpt.speed;
            const animName = this.animOpt.animName;
            const endCall = this.animOpt.endCall;
            const isLoop = this.animOpt.isLoop;

            const animGroup = this.animationMap.get(animName);

            if (animGroup !== undefined) {
                if (this.changeAnimEnableBlending) {
                    animGroup.targetedAnimations.forEach((anim) => {
                        anim.animation.enableBlending   = true;
                        anim.animation.blendingSpeed    = this.changeAnimBlendSpeed;
                    });
                }
                if (animGroup.isStarted && isLoop) {
                    console.warn(`${animName} 动画已经执行！`);
                    animGroup.onAnimationGroupEndObservable.clear();
                    animGroup.stop();
                }

                animGroup.onAnimationGroupEndObservable.clear();
                endCall && animGroup.onAnimationGroupEndObservable.add(<any>endCall);
                animGroup.start(isLoop, speed);
                if (this.animOpt.goEnd) {       // 是否跳转到动画最后一帧(非循环动画设置)
                    animGroup.goToFrame(animGroup.to);
                }
            } else {
                console.warn(`${animName} 动画不存在！`);
            }

            // this.animEndCB = endCall;
            this.animation = animGroup;
            this.isAnimationLoop = isLoop;
        }
    }
    private stopAnimation = () => {
        if (this.animation && this.changeAnimEnableBlending && this.animation.isStarted) {
            (<any>this.animation).loopAnimation = false;
            this.animation.targetedAnimations.forEach((anim) => {
                anim.animation.enableBlending   = true;
                anim.animation.blendingSpeed    = this.changeAnimBlendSpeed;
            });
        } else {
            if (this.animation) {
                this.animation.onAnimationGroupEndObservable.clear();
                this.animation.stop();
            }
        }
    }
    private pauseAnimation = () => {
        this.animation && this.animation.pause();
    }
    private initAnimationEventMap() {
        // 动画事件
        this.animationMap.forEach((ag) => {
            if (ag.animatables) {
                ag.animatables.forEach(at => {
                    const list = at.getAnimations();
                    list && list.forEach((a) => {
                        const events = (<BABYLON.AnimationEvent[]>(<any>a)._events);
                        events.forEach((event) => {
                            if (!this.animEventMap) {
                                this.animEventMap = new Map();
                            }
                            this.animEventMap.set((<any>event)._pi_eventKey, event);
                        });
                    });
                });
            }
        });
    }
}
