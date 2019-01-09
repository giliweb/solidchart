import _ from 'lodash'
import Series from "./Series"
import * as PIXI from 'pixi.js'
import moment from 'moment'
import Axis from "./Axis"

export default class Chart {

    constructor(settings) {
        this.id = _.uniqueId('chart')
        this.series = []

        this.settings = _.merge({
            width: 800,
            height: 600,
            pause: false,
            currentDateTime: moment(),
            totalRangeSpan: 60,
            padding: 10
        }, settings)
        this.pixi = new PIXI.Application({
            width: this.settings.width,
            height: this.settings.height,
            backgroundColor: 0xFFFFFF,
            antialias: true
        });
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

        let animate = () => {
            this.settings.currentDateTime = moment()
            _.forEach(this.series, (s) => {
                s.redraw()
            })
            this.xAxis[0].update()
            //this.pixi.renderer.render(this.pixi.stage);
        }

        // Build a worker from an anonymous function body
        let blobURL = URL.createObjectURL( new Blob([ '(',
                function(){
                    this.onmessage = function(e){
                        setInterval(function(){
                            postMessage({});
                        }, e.data);
                        postMessage({});
                    };
                }.toString(),
                ')()' ], { type: 'application/javascript' } ) ),
            worker = new Worker( blobURL );
        worker.postMessage(10)
        worker.onmessage = function(e){
            animate();
        };

        URL.revokeObjectURL( blobURL );

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
    getWidth(){
        let fullWidth = this.pixi.renderer.width
        return fullWidth
    }
    getHeight(){
        let fullHeight = this.pixi.renderer.height
        return fullHeight
    }
}
