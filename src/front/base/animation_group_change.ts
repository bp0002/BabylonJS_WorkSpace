
export namespace AnimationGroupChange {
    export interface AnimationGroupChangeCfg {
        [changeName: string]: AnimationGroupChangeInfo;
    }
    export interface AnimationGroupChangeInfo {
        from: string;
        to: string;
        isLoop: boolean;
    }
    const cfgMap: Map<string, AnimationGroupChangeCfg> = new Map();
    export function animChangeTo(modelName: string, changeName: string, animationGroupMap: Map<string, BABYLON.AnimationGroup>, curAnim: BABYLON.AnimationGroup | undefined, startCall: Function | undefined, endCall: Function | undefined) {
        let nextAnim: BABYLON.AnimationGroup | undefined  = undefined;
        const cfg = cfgMap.get(modelName);

        if (cfg) {
            nextAnim = changeTo(changeName, animationGroupMap, cfg, curAnim, startCall, endCall);
        }

        return nextAnim;
    }
    export function changeTo(changeName: string, animationGroupMap: Map<string, BABYLON.AnimationGroup>, cfg: AnimationGroupChangeCfg, curAnim: BABYLON.AnimationGroup | undefined, startCall: Function | undefined, endCall: Function | undefined) {
        let nextAnim: BABYLON.AnimationGroup | undefined  = undefined;
        const info = cfg[changeName];

        if (info) {
            nextAnim = animationGroupMap.get(info.to);
            curAnim && ((<any>curAnim).loopAnimation = false);
            if (curAnim && curAnim.isPlaying) {
                curAnim.onAnimationGroupEndObservable.addOnce(() => {
                    try {
                        startCall && startCall();
                    } catch (err) {

                    }
                });
            } else {
                if (nextAnim) {
                    nextAnim.onAnimationGroupEndObservable.addOnce(() => {
                        try {
                            endCall && endCall();
                        } catch (err) {

                        }
                    });
                    nextAnim.play(info.isLoop);
                }
            }
        }

        return nextAnim;
    }
    export function registAnimationGroupChnageCfg(modelName: string, cfg: AnimationGroupChangeCfg) {
        cfgMap.set(modelName, cfg);
    }
    export function getAnimationGroupChnageCfg(modelName: string) {
        return cfgMap.get(modelName);
    }
}