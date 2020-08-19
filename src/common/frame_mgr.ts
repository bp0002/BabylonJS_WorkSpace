export namespace FrameMgr {
    const funcList: Function[] = [];
    let flag: boolean = false;
    export function setPermanent(func: Function) {
        if (!flag) {
            flag = true;
            loop();
        }
        funcList.push(func);
    }
    function loop() {
        funcList.forEach((f) => {
            try {
                f && f();
            }
            catch (e) {
                console.error(e);
            }
        });
        requestAnimationFrame(loop);
    }
}