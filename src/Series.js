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
        this.graphics = new PIXI.Graphics()
        this.chart.pixi.stage.addChild(this.graphics)

        let mask = new PIXI.Graphics()
        this.chart.pixi.stage.addChild(mask)
        let count = .5
        mask.x = 60
        mask.beginFill(0x8bc5ff, 0.4);
        mask.moveTo(0, 0);
        mask.lineTo(this.chart.pixi.screen.width, 0);
        mask.lineTo(this.chart.pixi.screen.width, this.chart.pixi.screen.height);
        mask.lineTo(0, this.chart.pixi.screen.height);

        this.graphics.mask = mask;

        this.addPoints(this.data)
    }
    addPoints(data){
        _.forEach(data, p => {
            this.addPoint(p)
        })
    }
    addPoint(point){
        this.data.push(point)
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
            if(
                moment(p.x).isAfter(moment(currentDateTime).subtract(totalRangeSpan, 'seconds').subtract(padding, 'seconds')) &&
                moment(p.x).isBefore(this.chart.getCurrentDateTime().add(padding, 'seconds'))
            ){
                temp.push(p)
            }
        })

        this.points = temp
        let h = this.chart.pixi.screen.height - 50
        let max = this.getGlobalMinMax().max
        //console.log(this.points.length)
        _.forEach(this.points, (p, i) => {
            let x = this.chart.pixi.screen.width - ((moment(currentDateTime).diff(moment(p.x)) / (totalRangeSpan * 1000) )  * this.chart.pixi.screen.width)
            //console.log(x)
            let y = dy + p.y
            this.graphics.lineTo(x, ((1 - (y / max)) * .99 * h) + (.01 * h))
            this.graphics.lineStyle(1, this.settings.color, 1);

        })
    }

    getMinMax(){
        let min = Infinity, max = -Infinity
        _.forEach(this.data, e => {
            min = Math.min(min, e.y)
            max = Math.max(max, e.y)
        })
        return { min, max }
    }

    getGlobalMinMax(){
        let min = Infinity, max = -Infinity
        _.forEach(this.chart.series, (series) => {
            _.forEach(series.data, e => {
                min = Math.min(min, e.y)
                max = Math.max(max, e.y)
            })
        })
        return { min, max }
    }

    getOldestPoint(){
        let oldestPoint = this.data[0]
        _.forEach(this.data, e => {
            if(e.x < oldestPoint){
                oldestPoint = e
            }
        })
        return oldestPoint
    }

    getLatestPoint(){
        let latestPoint = this.data[0]
        _.forEach(this.data, e => {
            if(e.x < latestPoint){
                latestPoint = e
            }
        })
        return latestPoint
    }
}