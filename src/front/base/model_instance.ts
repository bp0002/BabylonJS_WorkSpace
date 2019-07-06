import { IModelInstance, IModelOpt, IModelAnimOpt, IModelAttachOpt, IModelChildOpt, ITransformObj, ITransformObj2 } from "./scene_base";
import { SceneInstance3D } from "./scene_instance";
import { LoaderTool, NodeTools } from "./scene_tool";

/**
 * 作为场景导入的模型数据
 */
export class AppendModelObj implements IModelInstance {
    /**
     * 用于射线检测时的附加检查数据
     */
    public rayID: number = -1;
    /**
     * 模型名称
     * * 项目的命名
     */
    public readonly name: string;
    /**
     * 所在路径
     */
    public readonly path: string;
    /**
     * 目标文件名
     */
    public readonly fileName: string;
    /**
     * 要导入的文件内的指定模型名称
     * * 为 '' 则表示导入目标文件中所有模型
     */
    public readonly modelName: string | null;
    /**
     * 导入成功后的调用
     */
    public readonly loadedCall?: (model: AppendModelObj) => any;
    /**
     * 所属 场景
     */
    public readonly scene:       SceneInstance3D;
    /**
     * 导入后的模型根节点
     */
    public impl:        BABYLON.Mesh | undefined;
    /**
     * 导入后的根节点 - <由BABYLON 加载时创建，用以在场景内定位导入的模型>
     */
    public rootImpl:    BABYLON.Mesh | undefined;
    /**
     * 是否在逻辑里被销毁
     */
    public isDisposed:  boolean = false;
    /**
     * 是否加载结束
     */
    public isLoaded:    boolean = false;
    public get isReady() {
        return this.impl && this.impl.isReady;
    }
    constructor(meshName: string, scene: SceneInstance3D, opt: IModelOpt = <any>{}) {
        this.name       = meshName;
        this.scene      = scene;
        this.path       = opt.path || '';
        this.fileName   = opt.fileName;
        this.modelName  = opt.modelName;
        this.loadedCall = opt.loadedCall;

        LoaderTool.appendMesh(this);
    }
    /**
     * 销毁
     * * 手动调用时，会自动从所属 scene 实例中移除
     */
    public dispose() {
        if (this.isLoaded && this.rootImpl) {
            this.rootImpl.dispose();
        }

        this.scene.removeAppend(this);

        this.isDisposed = true;
    }
    /**
     * 导入成功后调用
     * * 由加载模块调用 - LoadTools
     */
    public appened = (scene: BABYLON.Scene) => {
        if (!this.isDisposed) {
            this.isLoaded = true;
            this.loadedCall && this.loadedCall(this);
        }
    }
}

/**
 * 导入的非场景类模型
 * * 项目层 封装的 模型数据结构，处理 逻辑的同步操作 在 加载的异步过程 中的安全
 * * 控制 动画切换
 * * 控制 模型 附加 与 被附加
 * * 控制 模型 变换 - 旋转 缩放 py
 * * 控制 模型 逻辑释放
 */
export class InsertModelObj implements IModelInstance {
    public impl: BABYLON.Mesh | undefined;
    public rootImpl: BABYLON.Mesh | undefined;
    public root: InsertModelObj | undefined;
    public isDisposed: boolean = false;
    public isLoaded: boolean = true;
    /**
     * 父节点
     */
    public parent: InsertModelObj | undefined;
    public linkUI: BABYLON.GUI.Control | undefined;
    public position: [number, number, number] | undefined;
    public scale: [number, number, number] | undefined;
    public rotate: [number, number, number] | undefined;
    public lookAt: [number, number, number] | undefined;
    public isVisible: boolean = false;
    public animOpt: IModelAnimOpt | undefined;
    /**
     * 导入的动画是否默认播放
     */
    public animDefault: boolean;
    public readonly scene: SceneInstance3D;
    public readonly rayID: number;
    public readonly name: string;
    public readonly path: string;
    public readonly fileName: string;
    public readonly modelName: string | null;
    public insertedCall: ((model: InsertModelObj) => any) | undefined;
    public readonly meshMap: Map<string, BABYLON.Mesh> = new Map();
    public readonly skeletonMap: Map<string, BABYLON.Skeleton> = new Map();
    public readonly animationMap: Map<string, BABYLON.AnimationGroup> = new Map();
    public readonly particleSysMap: Map<string, BABYLON.ParticleSystem> = new Map();
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
    public get isReady() {
        return this.impl && this.impl.isReady;
    }
    constructor(meshName: string, scene: SceneInstance3D, opt: IModelOpt = <any>{}) {
        this.scene  = scene;
        this.name   = meshName;
        this.parent = opt.parent;
        this.rayID  = opt.rayID || -1;
        this.path   = opt.path || '';

        this.fileName       = opt.fileName;
        this.modelName      = opt.modelName;
        this.insertedCall   = opt.insertedCall;
        this.animDefault    = !!opt.animDefault;

        if (!opt.isEffect) {
            LoaderTool.loadMesh(this);
        } else {
            LoaderTool.loadEffect(this);
        }
    }
    public dispose = () => {
        if (this.isDisposed === true) {
            return;
        }

        this.animationMap.clear();

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

        if (this.isLoaded) {
            this.rootImpl && this.rootImpl.dispose(false, true);
            this.rootImpl && (this.rootImpl.parent = null);
        }

        this.meshMap.clear();
        this.skeletonMap.clear();
        this.particleSysMap.clear();
        this.animationMap.clear();

        this.animation  = undefined;
        this.parent     = undefined;
        this.root       = undefined;
        this.rootImpl   = undefined;
        this.impl       = undefined;
        this.lookAt     = undefined;
        this.rotate     = undefined;
        this.position   = undefined;
        this.scale      = undefined;
        this.linkUI     = undefined;
        this.insertedCall = undefined;

        this.isDisposed = true;
    }
    // tslint:disable-next-line:max-line-length
    public loaded = (ameshes: BABYLON.AbstractMesh[], particleSystems: BABYLON.IParticleSystem[], skeletons: BABYLON.Skeleton[], animationGroups: BABYLON.AnimationGroup[]) => {
        const meshes = <BABYLON.Mesh[]>ameshes;

        if (this.isDisposed) {
            meshes[0].dispose();

            return;
        }

        this.isLoaded   = true;

        this.rootImpl   = meshes[0];
        this.impl       = meshes[1];

        this.impl.animations.forEach((anim) => {
            anim.framePerSecond = 20;
        });

        if (meshes !== undefined) {
            meshes.forEach((mesh) => {
                this.meshMap.set(mesh.id, mesh);
                (<any>mesh).rayID = this.rayID;
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
                this.particleSysMap.set(particleSys.id, <BABYLON.ParticleSystem>particleSys);
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
        } else  if (!this.animDefault) {
            this.changeAnim();
        }

        if (this.insertedCall) {
            this.insertedCall(this);
        }
    }
    public animEndCall = () => {
        // if (this.isAnimationLoop === true) {
        //     this.animation.play();
        // }

        if (this.animEndCB !== undefined) {
            this.animEndCB();
            this.animEndCB = undefined;
        }
    }
    public setAttach(opt: IModelAttachOpt) {
        this.attachOptList.push(opt);

        if (opt.modelOpt !== undefined) {
            opt.modelOpt.insertedCall = () => {
                opt.mesh = opt.model && opt.model.rootImpl;
                if (this.isLoaded) {
                    this.updateAttachOpt();
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
    public setPostion(data: [number, number, number]) {
        this.position = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changePostion();
        }
    }
    public setScale(data: [number, number, number]) {
        this.scale = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeScale();
        }
    }
    public setRotate(data: [number, number, number]) {
        this.rotate = [data[0], data[1], data[2]];
        if (this.isLoaded) {
            this.changeRotate();
        }
    }
    public setLinkUI(node: BABYLON.GUI.Control) {
        this.linkUI = node;
        if (this.isLoaded) {
            this.changeLinkUI();
        }
    }
    public setLookAt(data: [number, number, number]) {
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
    public setAnim(animOpt: IModelAnimOpt) {
        this.animOpt = animOpt;
        if (this.isLoaded) {
            this.changeAnim();
        }
    }
    public stopAnim() {
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
    private changePostion() {
        if (this.position && this.rootImpl) {
            NodeTools.positNode(<ITransformObj2>this.rootImpl, this.position);
        }
    }
    private changeScale() {
        if (this.scale && this.rootImpl) {
            NodeTools.scaleNode(<ITransformObj2>this.rootImpl, this.scale);
        }
    }
    private changeRotate() {
        if (this.rotate && this.impl) {
            NodeTools.rotateNode(<ITransformObj2>this.impl, this.rotate);
        }
    }
    private changeLookAt() {
        if (this.lookAt && this.impl) {
            NodeTools.nodeLookAt(<BABYLON.Mesh>this.impl, this.lookAt);
        }
    }
    private changeLinkUI() {
        if (this.linkUI && this.rootImpl) {
            this.linkUI.linkWithMesh(this.rootImpl);
        }
    }
    private changeVisible() {
        if (this.isVisible !== undefined && this.rootImpl) {
            this.rootImpl.isVisible = this.isVisible;
        }
    }
    private updateAttachOpt() {
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
                        opt.mesh.attachToBone(skeleton.bones[boneIndex], <BABYLON.Mesh>this.rootImpl);
                        NodeTools.nodeTransform(opt.mesh, opt.transform);
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
    private updateChildOpt() {
        this.childOptList.forEach((opt) => {
            if (opt && opt.isFinished !== true) {
                if (opt.model !== undefined) {
                    if (opt.model.rootImpl !== undefined) {
                        opt.isFinished = true;
                        opt.model.rootImpl.parent = <BABYLON.Mesh>this.rootImpl;
                        NodeTools.nodeTransform(opt.model.rootImpl, opt.transform);
                    }
                } else if (opt.mesh !== undefined) {
                    opt.isFinished  = true;
                    opt.mesh.parent = <BABYLON.Mesh>this.rootImpl;
                    NodeTools.nodeTransform(opt.mesh, opt.transform);
                }
            }
        });
    }
    private updateAttach() {
        //
    }
    private changeAnim() {
        this.stopAnimation();
        if (this.animOpt) {
            this.changeAnimation();
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
            const speed     = this.animOpt.speed === undefined ? 1 : this.animOpt.speed;
            const animName  = this.animOpt.animName;
            const endCall   = this.animOpt.endCall;
            const isLoop    = this.animOpt.isLoop;

            const animGroup = this.animationMap.get(animName);

            if (animGroup !== undefined) {
                if (animGroup.isStarted && isLoop) {
                    console.warn(`${animName} 动画已经执行！`);
                    animGroup.onAnimationGroupEndObservable.clear();
                    animGroup.stop();
                }

                animGroup.onAnimationGroupEndObservable.add(this.animEndCall);
                animGroup.start(isLoop, speed);
                if (this.animOpt.goEnd) {       // 是否跳转到动画最后一帧(非循环动画设置)
                    animGroup.goToFrame(animGroup.to);
                }
            } else {
                console.warn(`${animName} 动画不存在！`);
            }

            this.animEndCB = endCall;
            this.animation = animGroup;
            this.isAnimationLoop = isLoop;
        }

    }
    private stopAnimation = () => {
        if (this.animation && this.animation.isStarted) {
            this.animation.onAnimationGroupEndObservable.clear();
            this.animation.stop();
        }
    }
    private pauseAnimation = () => {
        this.animation && this.animation.pause();
    }
}