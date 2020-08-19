/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Stats {

    REVISION: number;
    dom: any;
    addPanel: Function;
    showPanel: Function;
    domElement: any;
    setMode: Function;
    begin: Function;
    end: Function;
    update: Function;

    constructor() {
        var mode = 0;

        var container = document.createElement('div');
        container.style.cssText = 'position:fixed;top:20px;right:0;cursor:pointer;opacity:0.8;z-index:10000';
        container.addEventListener('click', function(event) {

            event.preventDefault();
            showPanel(++ mode % container.children.length);

        }, false);

        //

        function addPanel(panel: any) {

            container.appendChild(panel.dom);
            return panel;

        }

        function showPanel(id: any) {

            for (var i = 0; i < container.children.length; i ++) {

                (<any>container.children[ i ]).style.display = i === id ? 'block' : 'none';

            }

            mode = id;

        }

        //

        var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;

        var fpsPanel = addPanel(new Panel('FPS', '#0ff', '#002'));
        var msPanel = addPanel(new Panel('MS', '#0f0', '#020'));

        if (self.performance && (<any>self.performance).memory) {

            var memPanel = addPanel(new Panel('MB', '#f08', '#201'));

        }

        showPanel(0);

        this.REVISION    = 16,

        this.dom        = container,

        this.addPanel    = addPanel,
        this.showPanel    = showPanel,

        this.begin = function() {

            beginTime = (performance || Date).now();

        },

        this.end = function() {

            frames ++;

            var time = (performance || Date).now();

            msPanel.update(time - beginTime, 200);

            if (time >= prevTime + 1000) {

                fpsPanel.update((frames * 1000) / (time - prevTime), 60);

                prevTime = time;
                frames = 0;

                if (memPanel) {

                    var memory = (<any>performance).memory;
                    memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);

                }

            }

            return time;

        },

        this.update = function() {

            beginTime = this.end();

        },

        // Backwards Compatibility

        this.domElement = container,
        this.setMode = showPanel;

    }

}

export class Panel{
    dom: any;
    update: Function | undefined;
    constructor(name: any, fg: any, bg: any) {
        var min = Infinity, max = 0, round = Math.round;
        var PR = round(window.devicePixelRatio || 1);

        var WIDTH = 80 * PR, HEIGHT = 48 * PR,
                TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
                GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
                GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

        var canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.cssText = 'width:80px;height:48px';

        var context = canvas.getContext('2d');
        if (context) {
            context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
            context.textBaseline = 'top';

            context.fillStyle = bg;
            context.fillRect(0, 0, WIDTH, HEIGHT);

            context.fillStyle = fg;
            context.fillText(name, TEXT_X, TEXT_Y);
            context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

            this.dom = canvas;
            this.update = function(value: any, maxValue: any, isRecordMax?: boolean) {

                min = Math.min(min, value);
                max = isRecordMax ? maxValue : Math.max(max, value);

                if (context) {
                    context.fillStyle = bg;
                    context.globalAlpha = 1;
                    context.fillRect(0, 0, WIDTH, GRAPH_Y);
                    context.fillStyle = fg;
                    context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

                    context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

                    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

                    context.fillStyle = bg;
                    context.globalAlpha = 0.9;
                    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
                }
            };
        }
    }

}

// export { Stats as default };