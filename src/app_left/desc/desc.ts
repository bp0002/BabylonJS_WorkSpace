import { Forelet } from "../../pi_gui/widget/forelet";
import { Widget } from "../../pi_gui/widget/widget";

/**
 * Demo 操作/说明 界面
 */

export const forelet = new Forelet();

export class Desc extends Widget {
    public firstPaint() {
        super.firstPaint();
        console.log(`Desc 界面已打开`)
    }
    public updateProps(prop: any, old?: any) {
        if (this.props) {
            const call = this.props.call;
            call && call();
        }
        super.updateProps(prop, old);
    }
}