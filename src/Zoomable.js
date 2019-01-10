import _ from "lodash"
import * as PIXI from "pixi.js"
const support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
        "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
let _addEventListener, prefix
if ( window.addEventListener ) {
    _addEventListener = "addEventListener";
    prefix = ""
} else {
    _addEventListener = "attachEvent";
    prefix = "on";
}

export default class Zoomable {


    constructor(settings, chart) {
        this.settings = _.merge({

        }, settings)
        this.chart = chart
        this.init()
        return this
    }

    init() {
        let canvas = this.chart.pixi.renderer.view


        let _this = this
        this.onZoom = (e) => {
            let x, y, isZoomIn
            [x, y, isZoomIn] = [e.clientX, e.clientY, e.deltaY < 0]
            //console.log(x, y, isZoomIn)
            if(isZoomIn){
                _this.chart.setTotalRangeSpan(_this.chart.getTotalRangeSpan() / 1.5)
            } else {
                _this.chart.setTotalRangeSpan(_this.chart.getTotalRangeSpan() * 1.5)
            }
        }
        this.addWheelListener(canvas, this.onZoom)
    }



    addWheelListener( elem, callback, useCapture ) {
        this._addWheelListener( elem, support, callback, useCapture );

        // handle MozMousePixelScroll in older Firefox
        if( support === "DOMMouseScroll" ) {
            this._addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };

    _addWheelListener( elem, eventName, callback, useCapture ) {

        elem[ _addEventListener ]( prefix + eventName, support === "wheel" ? callback : function( originalEvent ) {

            !originalEvent && ( originalEvent = window.event );

            // create a normalized event object
            let event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if ( support === "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback( event );

        }, useCapture || false );
    }
}