import _ from 'lodash'

export default class Point {
    constructor(x, y, series){
        this.x = x
        this.y = y
        this.series = series
        return this
    }
}