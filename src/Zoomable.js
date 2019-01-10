import _ from "lodash"
import * as PIXI from "pixi.js"

export default class Zoomable {
    constructor(settings, chart) {
        this.settings = _.merge({

        }, settings)
        this.chart = chart
        this.init()
        return this
    }

    init() {

    }
}