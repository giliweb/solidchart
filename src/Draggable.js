import _ from "lodash"
import * as PIXI from "pixi.js"
import moment from 'moment'

export default class Draggable {
    constructor(settings, chart) {
        this.settings = _.merge({

        }, settings)
        this.chart = chart
        this.init()
        return this
    }

    init() {

        let _this = this
        this.onDragMove = (event) => {
            if (_this.dragging) {
                _this.toX = event.data.global.x
                let dx = _this.toX - _this.fromX
                dx = ((dx / (_this.chart.pixi.renderer.width )) * 60)
                this.chart.setCurrentDateTime(moment(_this.dragTime).subtract(dx, 'seconds'))
            }
        }

        this.onDragStart = (event) => {
            _this.chart.pause(true)
            _this.dragging = true;
            _this.fromX = event.data.global.x
            _this.dragTime = this.chart.getCurrentDateTime()
        }

        this.onDragEnd = (event) => {
            _this.dragging = false;
        }

        this.chart.pixi.stage.interactive = true
        this.chart.pixi.stage
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);
    }




}