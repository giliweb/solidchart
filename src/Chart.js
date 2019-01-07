import _ from 'lodash'
import Series from "./Series"
import * as PIXI from 'pixi.js'
import Axis from "./Axis"

export default class Chart {

    constructor(settings) {

        this.id = _.uniqueId('chart')
        this.settings = _.merge({
            width: 1200,
            height: 900,
            pause: false
        }, settings)
        this.pixi = new PIXI.Application({
            width: this.settings.width,
            height: this.settings.height,
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
            //Determine the amount of time since last frame update
            this.series[0].graphics.x -= .3
            this.series[1].graphics.x -= .3
            this.pixi.renderer.render(this.pixi.stage);
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

        // Won't be needing this anymore
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
