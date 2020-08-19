import { spine } from "./spine_webgl";
import { SpineScene } from "./spine_scene";
import { loadJson, loadAtlas, loadImage } from "./res_mgr";

export interface SpineAnimCfg {
    aname: string;
    isLoop: boolean;
    trackIndex?: number;
    delay?: number;
    listen?: spine.AnimationStateListener2;
}

export interface SpineFiles {
    json: string;
    atlas: string;
    images: string[];
}

export interface SpineOption {
    autofit?: boolean;
    premultipliedAlpha?: boolean;
    position?: [number, number];
    rotation?: number;
    scaling?: [number, number];
    animations?: SpineAnimCfg[];
}

export class SpineModel {
    /**
     * spine资源根目录
     */
    public static SpineResPath: string = '';
    /**
     * spine模型名称
     */
    public readonly name: string;
    public fileCfg: SpineFiles;
    public scene: SpineScene;
    private _atlas: string;
    private _json: any;
    private _texs: { [index: string]: HTMLImageElement } = {};
    private _root: spine.Bone;
    public animations: Map<string, spine.TrackEntry> = new Map();
    public animeList: SpineAnimCfg[];
    public atlas: spine.TextureAtlas;
    public state: spine.AnimationState;
    public skeleton: spine.Skeleton;
    public isLoaded: boolean;
    public isDisposed: boolean;
    public position: [number, number];
    public rotation: number;
    public scaling: [number, number];
    public offset: spine.Vector2;
    public bounds: spine.Vector2;
    public autofit: boolean;
    public premultipliedAlpha: boolean;
    public debug: boolean = false;
    public visible: boolean = true;
    private _baseoffset: spine.Vector2;
    private _basebounds: spine.Vector2;
    /**
     * 创建 spine 模型
     * @param sname spine 模型名称 - 对应保存的文件夹，同时也是配置文件名称
     * @param files spine 模型所需所有文件列表 - spine对应文件夹下的保存名称 - 直接的文件名称
     */
    constructor(sname: string, scene: SpineScene, option: SpineOption, files?: SpineFiles) {
        this.name = sname;
        this.scene = scene;
        this.fileCfg = files;
        if (option) {
            this.animeList = option.animations;
            this.position = option.position;
            this.rotation = option.rotation;
            this.scaling = option.scaling;
            this.autofit = option.autofit;
            this.premultipliedAlpha = option.premultipliedAlpha;
        }
        this.load().then(this.loaded);
    }
    public render = (delta: number) => {
        if (this.visible && this.isLoaded && !this.isDisposed) {
            this.state.update(delta);
            this.state.apply(this.skeleton);

            this._changeSize();
            this.skeleton.updateWorldTransform();
            this.scene.renderer.drawSkeleton(this.skeleton, this.premultipliedAlpha);
            if (this.debug) {
                this.scene.renderer.drawSkeletonDebug(this.skeleton);
            }
        }
    }
    public loaded = () => {
        if (this.isDisposed) {
            return;
        }
        this.atlas = new spine.TextureAtlas(this._atlas, (path: string) => {
            return new spine.webgl.GLTexture(this.scene.gl, this._texs[path]);
        });

        this.isLoaded = true;

        const atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);
        const skeletonjson = new spine.SkeletonJson(atlasLoader);
        const skeletonData = skeletonjson.readSkeletonData(this._json);

        this.skeleton = new spine.Skeleton(skeletonData);
        const animationstatedata = new spine.AnimationStateData(this.skeleton.data);
        this.state = new spine.AnimationState(animationstatedata);

        this._root = this.skeleton.findBone('root');

        this.animeList.forEach((aCfg: SpineAnimCfg, index: number) => {
            this.animations.set(aCfg.aname, this.state.setAnimation(index, aCfg.aname, aCfg.isLoop));
        });

        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();

        this._baseoffset = new spine.Vector2();
        this._basebounds = new spine.Vector2();

        this.skeleton.getBounds(this._baseoffset, this._basebounds, []);
        this.skeleton.setToSetupPose();
        this.skeleton.updateWorldTransform();

        this.offset = new spine.Vector2();
        this.bounds = new spine.Vector2();
        this.offset.x = this._baseoffset.x;
        this.offset.y = this._baseoffset.y;
        this.bounds.x = this._basebounds.x;
        this.bounds.y = this._basebounds.y;

        this.scene.renderer.skeletonDebugRenderer.drawRegionAttachments = false;
        this.scene.renderer.skeletonDebugRenderer.drawMeshHull = false;
        this.scene.renderer.skeletonDebugRenderer.drawMeshTriangles = false;

        this._changeAnimation();
    }
    public load = () => {
        const path = `${SpineModel.SpineResPath}${this.name}/`;

        // const batchLoad = new BatchLoad([path]);
        // const promise = new Promise((resolve, reject) => {
        //     batchLoad.start().then(() => {
                const arr = [];

                if (this.fileCfg) {
                    const jsonP = loadJson(this.scene.resTab, `${path}${this.fileCfg.json}`).then((res) => {
                        if (!this.isDisposed) {
                            this._json = res;
                        }
                    });
                    const atlasP = loadAtlas(this.scene.resTab, `${path}${this.fileCfg.atlas}`).then((res: string) => {
                        if (!this.isDisposed) {
                            this._atlas = res;
                        }
                    });
                    this.fileCfg.images.forEach((fname) => {
                        const imgP = loadImage(this.scene.resTab, `${path}${fname}`).then((res: HTMLImageElement) => {
                            if (!this.isDisposed) {
                                this._texs[fname] = res;
                            }
                        });
                        arr.push(imgP);
                    });
                    arr.push(jsonP);
                    arr.push(atlasP);
                }

                return Promise.all(arr);
        //     });
        // });

        // return promise;
    }
    public destroy = () => {
        if (this.isDisposed) {
            return;
        }

        const index = this.scene.spineModels.indexOf(this);
        if (index >= 0) {
            this.scene.spineModels.splice(index, 1);
        }

        this.isDisposed = true;
        this.animations.clear();
        this.animeList.length = 0;

        if (this.isLoaded) {
            this.atlas.dispose();
            this.state.clearTracks();
        }

        this.fileCfg = undefined;
        this.scene = undefined;
        this._atlas = undefined;
        this._json = undefined;
        this._texs = undefined;
        this.animations = undefined;
        this.animeList = undefined;
        this.atlas = undefined;
        this.state = undefined;
        this.skeleton = undefined;
    }
    /**
     * @description 模型创建时默认位置为 (0, 0) - 如果不是 则 美术修改 或者 程序重定位时减去 json 配置里的 root 的x.y
     * @description 单位像素
     * @param x 水平位置
     * @param y 垂直位置
     */
    public setPosition(x: number, y: number) {
        this.position = [x, y];
    }
    /**
     * @description 模型创建时默认旋转为 0 - 如果不是 则 美术修改 或者 程序重定位时减去 json 配置里的 root 的 rotation
     * @description 单位角度
     * @description 逆时针为正
     * @param z
     */
    public setRotation(z: number) {
        this.rotation = z;
    }
    /**
     * @description 模型创建时默认旋转为 (1, 1) - 如果不是 则 美术修改 或者 程序重定位时除以 json 配置里的 root 的 scale
     * @description 缩放中心为模型中心
     * @param x 水平缩放
     * @param y 垂直缩放
     */
    public setScaling(x: number, y: number) {
        this.scaling = [x, y];
    }
    /**
     * 切换动画
     * @param opt 动画配置
     */
    public changeAnimation(opt: SpineAnimCfg[]) {
        this.animeList = opt;
        this._changeAnimation();
    }
    private _changeAnimation() {
        if (this.isLoaded && !this.isDisposed && this.animeList) {
            this.state.clearTracks();
            this.animations.clear();

            this.animeList.forEach((aCfg: SpineAnimCfg, index: number) => {
                const track = this.state.setAnimation(aCfg.trackIndex || 0, aCfg.aname, aCfg.isLoop);
                track.listener = aCfg.listen;
                this.animations.set(aCfg.aname, track);
            });
            this.state.apply(this.skeleton);
        }
    }
    private _changeSize() {
        if (this.isLoaded && !this.isDisposed ) {
            if (this.scaling) {
                this._root.scaleX = this.scaling[0];
                this._root.scaleY = this.scaling[1];
            }
            if (this.position) {
                this._root.x = this.position[0];
                this._root.y = this.position[1];
            }
            if (this.rotation !== undefined) {
                this._root.rotation = this.rotation;
            }
        }
    }
}