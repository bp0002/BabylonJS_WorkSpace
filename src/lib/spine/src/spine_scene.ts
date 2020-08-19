import { spine } from "./spine_webgl";
import { SpineModel } from "./spine_model";
import { ResTab } from "pi_sys/util/res_mgr";

/**
 * Spine 模型渲染控制
 */

export interface SpineRenderOpt {
    /**
     * 离屏渲染目标 - 存在则说明需要离屏渲
     */
    fbo?: WebGLFramebuffer;
    /**
     * 目标画布
     */
    canvas: HTMLCanvasElement;
    /**
     * webgl 上下文
     */
    gl: WebGLRenderingContext;
    /**
     * 目标宽度
     */
    width: number;
    /**
     * 目标高度
     */
    height: number;
    /**
     * 当 fbo 有效时, 使用的目标宽度
     */
    useWidth?: number;
    /**
     * 当 fbo 有效时, 使用的目标高度
     */
    useHeight?: number;
}

export class SpineScene {
    public static vao: any;
    /**
     * 场景名称
     */
    public name: string;
    /**
     * 渲染上下文
     */
    public gl: WebGLRenderingContext;
    /**
     * 场景内创建的模型列表
     */
    public spineModels: SpineModel[] = [];
    /**
     * 渲染循环内的活动 模型 - 即实际要渲染的模型
     */
    public activeSpineModels: SpineModel[] = [];
    /**
     * 资源管理
     */
    public resTab: ResTab = new ResTab();
    /**
     * spine 渲染器
     */
    public renderer: spine.webgl.SceneRenderer;
    /**
     * 时间记录
     */
    public time: number = 0;
    /**
     * 是否自动清屏
     */
    public autoClear: boolean = false;
    /**
     * 场景是否已销毁
     */
    private _isDisposed: boolean;
    /**
     * 相机
     */
    private _camera: spine.webgl.OrthoCamera;
    /**
     * 外部传入的渲染设置
     */
    private _renderOpt: SpineRenderOpt;
    public get renderOpt() {
        return this._renderOpt;
    }
    public renderOffetX: number = 0;
    public renderOffetY: number = 0;
    /**
     * 创建一个Spine的渲染场景
     * @param name 创建的场景名称
     * @param canvas 渲染的目标canvas
     * @param fbo 外部给的渲染目标 - 将内容渲染到
     */
    constructor(name: string, renderOpt?: SpineRenderOpt) {
        this.name       = name;
        this._renderOpt = renderOpt;
        this.gl         = renderOpt.gl;
        this.renderer   = new spine.webgl.SceneRenderer(renderOpt.canvas, this.gl);
        this._camera    = this.renderer.camera;
        if (renderOpt.fbo) {
            this.renderer.camera.viewportWidth = renderOpt.width;
            this.renderer.camera.viewportHeight = renderOpt.height;
            // this.renderOffetX = (renderOpt.width - renderOpt.useWidth) / 2;
            // this.renderOffetY = (renderOpt.height - renderOpt.useHeight) / 2;
        }

        if (SpineScene.vao === undefined) {
            SpineScene.vao = this.gl.getExtension('OES_vertex_array_object');
        }
    }
    public render = () => {
        const now = Date.now();
        if (this.time === 0) {
            this.time = now;
        }
        const delta = (now - this.time) / 1000;

        if (!this._isDisposed) {
            this.beforeRender();

            if (this.activeSpineModels.length > 0) {
                const autoFitSpine = this.activeSpineModels.find((spine) => spine.autofit === true);
                if (autoFitSpine) {
                    this.renderer.camera.position.x = autoFitSpine.offset.x + autoFitSpine.bounds.x / 2;
                    this.renderer.camera.position.y = autoFitSpine.offset.y + autoFitSpine.bounds.y / 2;
                    this.renderer.camera.viewportWidth = autoFitSpine.bounds.x;
                    this.renderer.camera.viewportHeight = autoFitSpine.bounds.y;

                    let sourceWidth = this._renderOpt.width, sourceHeight = this._renderOpt.height;
                    let targetWidth = this.renderer.camera.viewportWidth, targetHeight = this.renderer.camera.viewportHeight;
                    let targetRatio = targetHeight / targetWidth;
                    let sourceRatio = sourceHeight / sourceWidth;
                    let scale = targetRatio < sourceRatio ? targetWidth / sourceWidth : targetHeight / sourceHeight;
                    this.renderer.camera.viewportWidth = sourceWidth * scale;
                    this.renderer.camera.viewportHeight = sourceHeight * scale;

                    this.renderer.camera.update();
                }

                this.renderer.begin();

                this.activeSpineModels.forEach((spine) => {
                    spine.render(delta);
                });

                this.renderer.end();

            }

            this.afterRender();
        }

        this.time = now;
    }
    public destroy = () => {
        this._isDisposed = true;

        for (let i = this.spineModels.length - 1; i >= 0; i--) {
            this.spineModels[i].destroy();
        }

        this.spineModels.length = 0;
    }
    public removeSpine(spine: SpineModel) {
        spine.destroy();
    }
    /**
     * 渲染前的调用
     */
    private beforeRender = () => {

        if (SpineScene.vao) {
            SpineScene.vao.bindVertexArrayOES(null);
        }

        /**
         * 切换渲染目标
         */
        if (this._renderOpt.fbo) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._renderOpt.fbo);
        } else {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        /**
         * spine 渲染必须的设置 - 视口设置之前
         */
        this.gl.disable(this.gl.SCISSOR_TEST);

        // 视口
        this.gl.viewport(0, 0, this._renderOpt.width, this._renderOpt.height);

        /**
         * 清屏
         */
        if (this.autoClear) {
            this.gl.clearColor(0, 0, 0, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }

        this.gl.disable(this.gl.DEPTH_TEST);

        this.gl.disable(this.gl.CULL_FACE);

        this.activeSpineModels.length = 0;
        this.spineModels.forEach((spine) => {
            if (spine.isLoaded && !spine.isDisposed) {
                this.activeSpineModels.push(spine);
            }
        });

        this.beforeRenderCall && this.beforeRenderCall(this);

        this.renderer.camera.update();
        // this.renderer.resize(spine.webgl.ResizeMode.Fit);
    }
    /**
     * 渲染后的调用
     */
    private afterRender = () => {
        this.afterRenderCall && this.afterRenderCall(this);

        /**
         * 重置渲染目标
         */
        if (this._renderOpt.fbo) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
    }
    /**
     * 外部修改相机位置
     * @param x
     * @param y
     * @param z
     */
    public setCameraPosition(x: number, y: number, z: number) {
        this._camera.position.x = x;
        this._camera.position.y = y;
        this._camera.position.z = z;
    }
    /**
     * 外部修改相机方向
     * @param x
     * @param y
     * @param z
     */
    public setCameraDirection(x: number, y: number, z: number) {
        this._camera.direction.x = x;
        this._camera.direction.y = y;
        this._camera.direction.z = z;
    }
    /**
     * 外部修改相机可视范围
     * @param viewWidth
     * @param viewHeight
     */
    public setCameraView(viewWidth: number, viewHeight: number) {
        this._camera.viewportWidth = viewWidth;
        this._camera.viewportHeight = viewHeight;
    }
    /**
     * 外部修改相机缩放参数
     * @param zoom
     */
    public setCameraZoom(zoom: number) {
        this._camera.zoom = zoom;
    }
    /**
     * 外部修改相机可视深度范围
     * @param near
     * @param far
     */
    public setCameraNearFar(near: number, far: number) {
        this._camera.near   = near;
        this._camera.far    = far;
    }
    /**
     * @description 可重载
     * @description 在可渲染的 spine 模型列表准备好之后，在渲染之前 调用
     * @description 例如对可渲染模型列表进行 重排序 或 剔除
     * @param spineScene 所属场景
     */
    public beforeRenderCall = (spineScene: SpineScene) => {

    }
    /**
     * @description 可重载
     * @description 在渲染之后 调用
     * @param spineScene 所属场景
     */
    public afterRenderCall = (spineScene: SpineScene) => {

    }
}