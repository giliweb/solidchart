import _ from 'lodash'
import Series from "./Series"
import * as PIXI from 'pixi.js'
import moment from 'moment'
import Axis from "./Axis"
import Grid from "./Grid"
import Draggable from "./Draggable"
import Zoomable from "./Zoomable"

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
            padding: 10,
            paused: false,
            pausedAt: null,
            draggable: true,
            isLoading: false,
            websocket: null,
            resolution: 1,
            loadData: (series) => {

            }
        }, settings)
        this.pixi = new PIXI.Application({
            width: this.settings.width,
            height: this.settings.height,
            backgroundColor: 0xFFFFFF,
            antialias: true,
            autoResize: true,
            resolution: devicePixelRatio
        });
        this.init()
        return this
    }
    init(){
        this.settings.container.appendChild(this.pixi.view)
        // initiate x Axis
        if(this.settings.xAxis){
            this.xAxis = this.addXAxis(this.settings.xAxis)
        } else { // if none, create a default one
            this.xAxis = this.addXAxis([{}])
        }
        if(this.settings.series){
            this.series = this.addSeries(this.settings.series)
        }

        this.grid = new Grid(this.settings.grid, this)
        this.draggable = new Draggable({}, this)
        this.zoomable = new Zoomable({}, this)
        //this.createCanvas()

        let animate = () => {
            if(!this.settings.paused){
                this.settings.currentDateTime = moment()
            }

            _.forEach(this.series, (s) => {
                s.redraw()
            })
            this.xAxis[0].update()
            this.grid.update()
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
        worker.onmessage = (e) =>{
            animate();
        };

        URL.revokeObjectURL( blobURL );
        let _this = this
        this.resize = () => {

            // Get the p
            const parent = _this.pixi.view.parentNode;

            // Resize the renderer
            _this.pixi.renderer.resize(parent.clientWidth, parent.clientHeight);

            // You can use the 'screen' property as the renderer visible
            // area, this is more useful than view.width/height because
            // it handles resolution
            _this.pixi.position.set(_this.pixi.screen.width, _this.pixi.screen.height);

        }
        window.onresize = this.resize
        this.resize()

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
    pause(e){
        this.settings.paused = e
        if(e){
            this.settings.pausedAt = moment()
        } else {
            this.settings.pausedAt = null
        }
        //this.settings.currentDateTime = moment().subtract(5, 'seconds')
    }
    isPaused(){
        return this.settings.paused
    }
    setCurrentDateTime(dt){
        if(dt.isAfter(this.settings.pausedAt)) {
            //this.pause(false)
            return
        }
        this.settings.currentDateTime = dt
    }
    getCurrentDateTime(){
        return moment(this.settings.currentDateTime)
    }
    getTotalRangeSpan(){
        return this.settings.totalRangeSpan
    }
    setTotalRangeSpan(range){
        if(range < 30 || range > (60 * 10)) return
        this.settings.totalRangeSpan = range
        this.xAxis[0].resetLabels()
    }
    onDragEnd(){
        let incompleteDataSeries = []
        _.forEach(this.series, (series, i) => {
            let oldestPoint = series.getOldestPoint()
            if(moment(oldestPoint.x).isAfter(this.getCurrentDateTime().subtract(this.getTotalRangeSpan(), 'seconds'))){
                //console.log('data is missing for series ' + i)
                incompleteDataSeries.push(series)
            }
        })
        if(incompleteDataSeries.length > 0){
            this.onDataMissing(incompleteDataSeries)
        }
    }
    async onDataMissing(series){
        let missingData = await this.settings.loadData(series, this.getCurrentDateTime().subtract(this.getTotalRangeSpan(), 'seconds'), this.getCurrentDateTime(), this.settings.resolution)
        console.log(missingData)
    }
}
