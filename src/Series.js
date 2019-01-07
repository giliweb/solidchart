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
        let x = this.settings.type === 'time' ? moment(point.x) : point.x
        this.points.push(new Point(x, point.y, this))
        this.redraw()
    }
    redraw(){
        this.graphics.clear()
        this.graphics.moveTo(0, 0);
        this.graphics.lineStyle(1, this.settings.color, 1);
        let dx = 0
        let dy = 0
        let chartWidth = this.chart.getWidth()
        let step = chartWidth / this.points.length

        _.forEach(this.points, (p, i) => {
            let x = dx + p.x + (step * i)
            let y = dy + p.y
            this.graphics.lineTo(x, y)
        })
    }
}