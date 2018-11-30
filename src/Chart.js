import _ from 'lodash'
import Series from "./Series"
import * as PIXI from 'pixi.js'

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
        if(this.settings.series){
            this.series = this.addSeries(this.settings.series)
            delete this.settings.series
        }
        this.createCanvas()

        let t = this.pixi.ticker.add((a, b) => {

            this.series[0].graphics.x -= .3
        });
    }
    addSeries(series){
        return _.map(series, (s) => {
            return new Series(s.data, s.settings, this)
        })
    }
    createCanvas(){

        this.settings.container.appendChild(this.pixi.view);



/*
        PIXI.loader.add('bunny', 'bunny.png').load((loader, resources) => {
            // This creates a texture from a 'bunny.png' image
            const bunny = new PIXI.Sprite(resources.bunny.texture);

            // Setup the position of the bunny
            bunny.x = this.pixi.renderer.width / 2;
            bunny.y = this.pixi.renderer.height / 2;

            // Rotate around the center
            bunny.anchor.x = 0.5;
            bunny.anchor.y = 0.5;

            // Add the bunny to the scene we are building
            this.pixi.stage.addChild(bunny);

            // Listen for frame updates
            this.pixi.ticker.add(() => {
                // each frame we spin the bunny around a bit
                bunny.rotation += 0.01;
            });
        });
*/
    }

}
