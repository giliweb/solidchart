import _ from 'lodash'
import moment from 'moment'
import * as PIXI from "pixi.js"

export default class Axis {
    constructor(settings, chart){
        this.settings = _.merge({
            type: 'time',
            min: moment().subtract(60, 'seconds'),
            max: moment(),
            paddingBottom: 50

        }, settings)
        this.chart = chart
        this.init()
        return this
    }
    init(){
        this.graphics = new PIXI.Graphics();
        this.chart.pixi.stage.addChild(this.graphics);
        this.redraw()
    }
    redraw(){
        this.graphics.clear()
        this.graphics.moveTo(0, this.chart.pixi.renderer.height - this.settings.paddingBottom);
        this.graphics.lineStyle(1, 0xFFFFFF, 1);
        this.graphics.lineTo(this.chart.pixi.renderer.width, this.chart.pixi.renderer.height - this.settings.paddingBottom)

    }
    getLabels(){
        let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    }
}