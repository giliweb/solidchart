import _ from 'lodash'
import Series from "./Series"
import * as PIXI from 'pixi.js'
import Axis from "./Axis"

export default class Chart {

    constructor(settings) {
        this.pixi = new PIXI.Application();
        this.id = _.uniqueId('chart')
        this.settings = _.merge({
            width: '800px',
            height: '600px',
            pause: false
        }, settings)
        this.init()
        return this
    }
    init(){
        // initiate x Axis
        if(this.settings.xAxis){
            this.xAxis = this.addXAxis(this.settings.xAxis)
        } else { // if none, create a default one
            this.xAxis = this.addXAxis([{}])
        }
        if(this.settings.series){
            this.series = this.addSeries(this.settings.series)
        }
        this.createCanvas()

        let t = this.pixi.ticker.add(() => {
            //this.series[0].graphics.x -= .3
            _.forEach(this.series, e => e.redraw())
            _.forEach(this.xAxis, e => e.redraw())
        });
    }
    addSeries(series){
        return _.map(series, (s) => {
            return new Series(s.data, s.settings, this)
        })
    }
    addXAxis(axis){
        return _.map(axis, (a) => {
            return new Axis(a, this)
        })
    }
    createCanvas(){
        this.settings.container.appendChild(this.pixi.view);
    }

}
