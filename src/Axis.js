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
        this.labels = {}
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
        //this.labelContainer.removeChildren()

        let labelValue = moment(fromDate).seconds(0).milliseconds(0)


        _.forOwn(this.labels, (label, i) => {
            if(moment(i, 'X').isBefore(moment(currentDateTime).subtract(totalRangeSpan, 'seconds'))){
                this.labelContainer.removeChild(label)
                delete this.labels[i]
            }
        })

        do {
            labelValue.add(labelsInterval, 'seconds')
            if(this.labels[labelValue.unix()]){ // this label already exists
                let x = this.chart.pixi.renderer.width - (((moment(currentDateTime).add(padding * 2, 'seconds').diff(labelValue)) / (totalRangeSpan * 1000)) * this.chart.pixi.renderer.width)
                let y = this.chart.pixi.renderer.height - this.settings.paddingBottom
                this.labels[labelValue.unix()].position.set(x, y)
            } else {
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
                this.labels[labelValue.unix()] = text
            }
        } while(labelValue.isBefore(toDate))
        //console.log(this.labelContainer.children)
        //console.log(this.labels)
    }
    clearAllLabels(){

    }
    getLabels(){
        let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    }
}