import {
    anyHash as _anyHash,
    nextHash as _nextHash
} from '../../pi_utils/util/hash';
import {
    Desc,
    VNode,
    createVNode,
    createBlock,
    createDesc
} from '../../pi_gui/widget/vnode';
import {
    Widget
} from '../../pi_gui/widget/widget';
import {
    styleStr2Json as _styleStr2Json
} from '../../pi_gui/compile/style';
import {
    addJson as _addJson,
    installText as _installText,
    addText as _addText,
    addContent
} from '../../pi_gui/widget/tpl';

const _path = 'app_left/desc/desc.tpl';
let staticNode: {
    [index: string]: VNode
};
let staticDesc: any;
let staticFlag: boolean;
export const tpl = (_cfg: any, it: any, it1: any, w: Widget): VNode => {
    if (!staticDesc) {
        staticDesc = {
            "1": {
                style: {
                    width: [1, 30, ],
                    height: [1, 100, ],
                    pointerEvents: 1,
                    backgroundColor: [0.92, 0.92, 0.92, 0.53, ],
                    display: 1,
                },
                attrs: {
                    isSendNextLayer: "1",
                },
                tag: "div",
            },
            "5": {
                style: {
                    position: 1,
                    top: [0, 66, ],
                    width: [1, 100, ],
                },
                tag: "div",
            },
            "8": {
                style: {
                    width: [1, 100, ],
                },
                tag: "div",
            },
        };
    }
    if (!staticNode) {
        staticNode = {
            "2": {
                desc: {
                    style: {
                        width: [0, 300, ],
                        height: [0, 33, ],
                        position: 1,
                        left: [0, 0, ],
                        top: [0, 0, ],
                        fontSize: 30,
                        color: [1, 0, 0, 1, ],
                    },
                    tag: "span",
                    content: "Demo-说明",
                },
                type: 1,
                sid: 2,
            },
            "3": {
                desc: {
                    style: {
                        position: 1,
                        top: [0, 33, ],
                    },
                    tag: "div",
                },
                type: 1,
                sid: 3,
                children: [{
                    desc: {
                        style: {
                            fontSize: 30,
                            color: [0.93, 1, 0, 1, ],
                            whiteSpace: 2,
                        },
                        tag: "span",
                        content: "控制台运行 demo01() | demo02 ....",
                    },
                    type: 1,
                    sid: 4,
                }, ],
            },
        };
    }
    let props = it;
    let cfg = _cfg;
    let state = it1;
    let widget = w; {
        it.strs = it.strs || ["null"];
        let node_6 = createVNode(null, [], 2);
        for (let k in it.strs) {
            let v = it.strs[k];
            var nodeDesc_9: Desc = createDesc("span", null, {
                fontSize: 30,
                color: [0, 0.38, 1, 1, ],
                whiteSpace: 2,
            }, null, null, "");
            addContent(v, nodeDesc_9);
            let node_9 = createVNode(nodeDesc_9, undefined, 512, );
            let node_8 = createVNode(staticDesc[8], node_9, 0, );
            let node_7 = createBlock(undefined, node_8, 0, [node_9]);
            ( < VNode[] > node_6.children).push(node_7);
        }
        let node_5 = createVNode(staticDesc[5], node_6, 0, );
        let node_1 = createVNode(staticDesc[1], [staticNode[2], staticNode[3], node_5], 0, );
        node_1.indexs = [node_6];
        return node_1;
    }
}