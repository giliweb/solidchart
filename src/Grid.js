import _ from 'lodash'
import moment from "./Axis"
import * as PIXI from "pixi.js"

export default class Grid {
    constructor(settings, chart){
        this.settings = _.merge({
            step: 50,
            unit: ''
        }, settings)
        this.chart = chart

        this.init()
        return this
    }
    init(){
        this.graphics = new PIXI.Graphics();
        this.chart.pixi.stage.addChild(this.graphics);
        this.lastMin = false
        this.lastMax = false
    }

    update(){

        let min = Infinity, max = -Infinity
        _.forEach(this.chart.series, (series) => {
            _.forEach(series.data, e => {
                min = Math.min(min, e.y)
                max = Math.max(max, e.y)
            })
        })

        if(this.lastMin !== min || this.lastMax !== max){
            this.graphics.clear()
            this.graphics.removeChildren()
            this.lastMin = min
            this.lastMax = max
            let roundedMin, roundedMax

            roundedMin = Math.round(min / this.settings.step) * this.settings.step
            roundedMax = (Math.round(Math.ceil(max) / this.settings.step) * this.settings.step) + this.settings.step

            console.log(min, roundedMin, max, roundedMax)


            let i = roundedMin

            let h = this.chart.pixi.renderer.height - 50
            do {

                let y = (1 - ( i / roundedMax * .99 ) ) * h
                this.graphics.moveTo(60, y);
                this.graphics.lineStyle(.5, 0x999999, 1);
                this.graphics.lineTo(this.chart.pixi.renderer.width, y)

                let text = new PIXI.Text(i + " " + this.settings.unit, {
                    fontFamily : 'Arial',
                    fontSize: 12,
                    fill : 0x000000,
                    align : 'center'
                });
                text.position.set(8, y - 8)
                this.graphics.addChild(text)
                //console.log(y)
                i += this.settings.step



            } while(i < roundedMax + 1)

            this.graphics.moveTo(60, h);
            this.graphics.lineStyle(.5, 0x999999, 1);
            this.graphics.lineTo(60, .01 * h)

            this.graphics.moveTo(this.chart.pixi.renderer.width, h);
            this.graphics.lineStyle(.5, 0x999999, 1);
            this.graphics.lineTo(this.chart.pixi.renderer.width, .01 * h)

        }




    }
}