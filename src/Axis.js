import _ from 'lodash'
import moment from 'moment'
import * as PIXI from "pixi.js"

export default class Axis {
    constructor(settings, chart){
        this.settings = _.merge({
            type: 'time',
            min: moment().subtract(60, 'seconds'),
            max: moment(),
            paddingBottom: 20

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

        let mask = new PIXI.Graphics()
        this.chart.pixi.stage.addChild(mask)
        mask.x = 60
        mask.beginFill(0x8bc5ff, 0.4);
        mask.moveTo(0, 0);
        mask.lineTo(this.chart.pixi.renderer.width, 0);
        mask.lineTo(this.chart.pixi.renderer.width, this.chart.pixi.renderer.height);
        mask.lineTo(0, this.chart.pixi.renderer.height);

        this.labelContainer.mask = mask;
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


        let temp = {}
        _.forOwn(this.labels, (label, i) => {
            //console.log(label)
            if(
                label.value.isAfter(moment(currentDateTime).subtract(totalRangeSpan, 'seconds')) &&
                label.value.isBefore(moment(currentDateTime).add(padding + 10, 'seconds'))
            ){
                temp[i] = label
            } else {
                this.labelContainer.removeChild(label)
                this.labelContainer.removeChild(label.axis)
            }
        })
//console.log(temp)
        this.labels = temp
        let h = this.chart.pixi.renderer.height - 50
        do {
            labelValue.add(labelsInterval, 'seconds')


            if(this.labels[labelValue.unix()]){ // this label already exists
                let x = this.chart.pixi.renderer.width - (((moment(currentDateTime).add(padding * 2, 'seconds').diff(labelValue)) / (totalRangeSpan * 1000)) * this.chart.pixi.renderer.width)
                let y = this.chart.pixi.renderer.height - this.settings.paddingBottom
                this.labels[labelValue.unix()].position.set(x, y)
                this.labels[labelValue.unix()].axis.position.x = x + (this.labels[labelValue.unix()].width / 2)
            } else {

                let text = new PIXI.Text(labelValue.format('HH:mm:ss'), {
                        fontFamily : 'Arial',
                        fontSize: 14,
                        fill : 0x000000,
                        align : 'center'
                });
                text.value = labelValue


                this.labels[labelValue.unix()] = text


                let x = this.chart.pixi.renderer.width - (((moment(currentDateTime).add(padding * 2, 'seconds').diff(labelValue)) / (totalRangeSpan * 1000)) * this.chart.pixi.renderer.width)
                let y = this.chart.pixi.renderer.height - this.settings.paddingBottom
                text.position.set(x, y)
                text.cacheAsBitmap = true
                //console.log(x, y)

                this.labelContainer.addChild(text)

                text.axis = new PIXI.Graphics();
                text.axis.moveTo(0, (.01 * this.chart.pixi.renderer.height));
                text.axis.lineStyle(1, 0xbbbbbb, 1);
                text.axis.lineTo(0, this.chart.pixi.renderer.height - this.settings.paddingBottom - 10)
                this.labelContainer.addChild(text.axis)

            }

        } while(labelValue.isBefore(toDate))
        //console.log(this.labelContainer.children)
        //console.log(this.labels)
    }

    resetLabels(){
        this.labelContainer.removeChildren()
        this.labels = []
    }
}