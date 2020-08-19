
export const FactorySceneGUI = (engine: BABYLON.Engine) => {
    return new BABYLON.Scene(engine);
};

export const FactoryScene3D = (engine: BABYLON.Engine) => {
    return new BABYLON.Scene(engine);
};

export const FactoryEngineOnlyGUI = (canvas: any) => {
    // 引擎创建 - 注意参数配置
    return new BABYLON.Engine(canvas, false, {
        disableWebGL2Support: true
    }, false);
};

export const FactoryEngine = (canvas: HTMLCanvasElement) => {
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
