import _ from 'lodash'
import Point from "./Point"

export default class Series {
    constructor(data, settings, chart){
        _.merge({

        }, settings)
        this.settings = settings
        this.data = data
        this.chart = chart
        this.points = []
        this.addPoints(data)
        return this
    }
    addPoints(data){
        _.forEach(data, p => {
            this.addPoint(p)
        })
    }
    addPoint(point){
        this.points.push(new Point(point.x, point.y, this))
    }
}