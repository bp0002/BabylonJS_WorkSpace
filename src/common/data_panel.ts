
type DataPanelInfo  = [string, number, (v: number) => void];

export namespace DataPanel {
    const recycleList: [HTMLDivElement, HTMLSpanElement, HTMLDivElement][] = [];
    const usingList: [HTMLDivElement, HTMLSpanElement, HTMLDivElement][] = [];
    let root: HTMLDivElement;
    let content: HTMLDivElement;
    let downFlag: boolean = false;
    let downNode: HTMLElement | undefined;
    let lastX: number = 0;
    let lastY: number = 0;
    let infoList: DataPanelInfo[] | undefined;

    export function init(cfg: DataPanelInfo[]) {
        infoList = cfg;

        createRoot();

        for (let i = 0, len = cfg.length; i < len; i++) {
            createInfo(cfg[i], i);
        }

        root.addEventListener('pointerdown', downListen);
        window.addEventListener('pointerup', upListen);
    }

    export function uninit() {
        root.removeEventListener('pointerdown', downListen);
        window.removeEventListener('pointerup', upListen);

        recycle();

        root.style.display = 'none';
        infoList = undefined;
    }

    function createRoot() {
        if (!root) {
            const rootWidth = 300;
            root = document.createElement('div');
            root.style.position = 'absolute';
            root.style.width = `${rootWidth}px`;
            root.style.height = '50%';
            root.style.right = '0';
            root.style.top = '50%';
            root.style.transform = 'translateY(-50%)';
            root.style.backgroundColor = '#55555566';
            root.style.overflowX = 'hidden';
            root.style.overflowY = 'hidden';
            root.style.zIndex = '99999999';
            root.style.color = '#fbda41';

            content = document.createElement('div');
            content.style.position = 'absolute';
            content.style.top = '0px';
            content.style.width = '100%';
            content.style.height = 'auto';

            content.addEventListener('pointermove', (e) => {
                if (downFlag) {
                    const rootHeight = root.clientHeight;
                    let canScroll = content.clientHeight - rootHeight;
                    canScroll = canScroll < 0 ? 0 : canScroll;

                    if (canScroll > 0) {
                        const delta = (e.y - lastY);

                        let top = <any>content.style.top.replace('px', '') - 0;
                        top = delta + top;
                        top = top > 0 ? 0 : top;
                        top = top < -canScroll ? -canScroll : top;
                        content.style.top = `${top}px`;
                    }

                }

                lastY = e.y;
            });
            root.appendChild(content);
        }

        root.style.display = 'block';

        document.body.appendChild(root);
    }

    function createInfo(info: DataPanelInfo, index: number) {
        let nodes: [HTMLDivElement, HTMLSpanElement, HTMLDivElement] | undefined;
        let div: HTMLDivElement, span: HTMLSpanElement, btn: HTMLDivElement;
        nodes = recycleList.pop();
        const btnSize = 20;

        if (!nodes) {
            div = document.createElement('div');
            div.style.backgroundColor = 'transparent';
            div.style.borderWidth = '1px 0';
            div.style.borderColor = '#134857';
            div.style.borderStyle = 'double';
            div.style.width = '100%';
            div.style.height = '60px';

            span = document.createElement('span');
            span.style.display = 'block';
            span.style.width = '100%';
            span.style.height = '50%';

            const bottomPlate = document.createElement('div');
            bottomPlate.style.content = 'border-box';
            bottomPlate.style.bottom = '0';
            bottomPlate.style.width = '100%';
            bottomPlate.style.height = '50%';

            const valueNode = document.createElement('div');
            valueNode.style.position = 'relative';
            valueNode.style.backgroundColor = '#de1c31';
            valueNode.style.height = '2px';
            valueNode.style.width = `calc(100% - ${btnSize}px)`;
            valueNode.style.top = '12px';
            valueNode.style.left = `${btnSize / 2}px`;

            btn = document.createElement('div');
            btn.style.position = 'relative';
            btn.style.backgroundColor = '#8abcd1';
            btn.style.bottom = '0';
            btn.style.width = `${btnSize}px`;
            btn.style.fontSize = '10px';
            btn.style.height = '90%';
            btn.style.borderRadius = '4px';
            btn.style.textAlign = 'center';
            btn.style.textJustify = 'center';

            div.appendChild(span);
            div.appendChild(bottomPlate);
            bottomPlate.appendChild(valueNode);
            bottomPlate.appendChild(btn);

            bottomPlate.addEventListener('pointermove', (e: PointerEvent) => {

                e.preventDefault();

                if (downNode === btn) {
                    const delta = (e.x - lastX);
                    let left = <any>btn.style.left.replace('px', '') - 0;
                    left = Math.round(left + delta);
                    left = left < 0 ? 0 : left;
                    left = left > (div.clientWidth - btnSize) ? (div.clientWidth - btnSize) : left;
                    btn.style.left = `${left}px`;
                    const value = (left) / ((div.clientWidth) - btnSize);
                    btn.textContent = value == 0 ? '0' : value == 1 ? '1' : `${value}`.substr(1, 3);
                    moveListen(<any>div.getAttribute('index') - 0, value);
                }

                lastX = e.x;
            });

            nodes = [div, span, btn];
        } else {
            [div, span, btn] = nodes;

        }

        div.setAttribute('index', `${index}`);
        content.appendChild(div);
        usingList.push(nodes);

        const value = !info ? 0 : info[1];
        btn.textContent = `${value}`;
        span.textContent = !info ? 'undefined' : info[0];
        setTimeout(() => {
            btn.style.left = `${value * (div.clientWidth - 20)}px`;
        }, 20);

    }

    function recycle() {
        for (let i = 0, len = usingList.length; i < len; i++) {
            usingList[i][0].remove();
            recycleList.push(usingList[i]);
        }
        usingList.length = 0;
    }

    function downListen(e: PointerEvent) {
        downFlag    = true;
        downNode    = <any>e.srcElement;
        lastX       = e.x;
        lastY       = e.y;
    }
    function upListen() {
        downFlag    = false;
        downNode    = undefined;
        lastX       = 0;
        lastY       = 0;
    }
    function moveListen(index: number, value: number) {
        if (infoList) {
            infoList[index] && infoList[index][2] && (infoList[index][2](value));
        }
        console.log(index, value);
    }
}