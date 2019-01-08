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
        this.labelContainer = new PIXI.Container()
        this.chart.pixi.stage.addChild(this.graphics);
        this.chart.pixi.stage.addChild(this.labelContainer);
        //this.redraw()
    }
    redraw(){
        this.graphics.clear()
        this.graphics.moveTo(0, this.chart.pixi.renderer.height - this.settings.paddingBottom);
        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.lineTo(this.chart.pixi.renderer.width, this.chart.pixi.renderer.height - this.settings.paddingBottom)
    }
    update(){
        let currentDateTime = this.chart.settings.currentDateTime
        let totalRangeSpan = this.chart.settings.totalRangeSpan
        let padding = this.chart.settings.padding
        let fromDate = moment(currentDateTime).subtract(totalRangeSpan + padding, 'seconds')
        let toDate = moment(currentDateTime).add(padding, 'seconds')
        let howManyLabels = 6
        let labelsInterval = Math.ceil(totalRangeSpan / howManyLabels)
        //console.log(labelsInterval)

        // remove old labels
        //this.labelContainer.clear()
        this.labelContainer.removeChildren()

        let labelValue = moment(fromDate).seconds(0).milliseconds(0)
        //console.log(labelValue)
        //return
        let i = 0
        do {
            labelValue.add(labelsInterval, 'seconds')
            //console.log(labelValue)

            let text = new PIXI.Text(labelValue.format('HH:mm:ss'),{
                fontFamily : 'Arial',
                fontSize: 24,
                fill : 0x000000,
                align : 'center'
            });


            let x = this.chart.pixi.renderer.width - (((moment(currentDateTime).add(padding * 2, 'seconds').diff(labelValue)) / (totalRangeSpan * 1000)) * this.chart.pixi.renderer.width)

            let y = this.chart.pixi.renderer.height - this.settings.paddingBottom
            text.position.set(x, y)
            //console.log(x, y)
            this.labelContainer.addChild(text)
            i++
        } while(labelValue.isBefore(toDate) && i <= 20)

    }
    clearAllLabels(){

    }
    getLabels(){
        let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    }
}