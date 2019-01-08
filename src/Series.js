import _ from 'lodash'
import Point from "./Point"
import * as PIXI from 'pixi.js'
import moment from 'moment'

export default class Series {
    constructor(data, settings, chart){
        this.settings = _.merge({
            type: 'time',
            color: '#FFFFFF'
        }, settings)
        this.data = data
        this.chart = chart
        this.points = []
        this.init()
        return this
    }
    init(){
        this.graphics = new PIXI.Graphics();
        this.chart.pixi.stage.addChild(this.graphics);
        this.addPoints(this.data)
    }
    addPoints(data){
        _.forEach(data, p => {
            this.addPoint(p)
        })
    }
    addPoint(point){
        let x
        if(this.settings.type === 'time'){
            x = moment(point.x).add(1, 'seconds')
        } else {
            x = point.x
        }

        this.points.push(new Point(x, point.y, this))

    }
    redraw(){
        this.graphics.clear()
        this.graphics.moveTo(0, 0);

        let dx = 0
        let dy = 0
        let chartWidth = this.chart.getWidth()
        let step = chartWidth / this.points.length

        let currentDateTime = this.chart.settings.currentDateTime
        let totalRangeSpan = this.chart.settings.totalRangeSpan
        let padding = this.chart.settings.padding
        //x = this.chart.pixi.renderer.width - (((moment(currentDateTime).add(padding * 2, 'seconds').diff(labelValue)) / (totalRangeSpan * 1000)) * this.chart.pixi.renderer.width)

        let temp = []

        _.forEach(this.points, (p, i) => {
            if(moment(p.x).isAfter(moment(currentDateTime).subtract(totalRangeSpan, 'seconds').subtract(padding, 'seconds'))){
                temp.push(p)
            }
        })

        this.points = temp

        //console.log(this.points.length)
        _.forEach(this.points, (p, i) => {
            let x = this.chart.pixi.renderer.width - ((moment(currentDateTime).diff(moment(p.x)) / (totalRangeSpan * 1000) )  * this.chart.pixi.renderer.width)
            //console.log(x)
            let y = dy + p.y
            this.graphics.lineTo(x, y)
            this.graphics.lineStyle(1, this.settings.color, 1);

        })
    }
}