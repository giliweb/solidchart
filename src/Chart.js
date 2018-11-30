import _ from 'lodash'
import Series from "./Series"

export default class Chart {

    constructor(settings) {
        this.id = _.uniqueId('chart')
        this.settings = _.merge({
            width: '800px',
            height: '600px'
        }, settings)
        this.init();
        return this
    }
    init(){
        if(this.settings.series){
            this.series = this.addSeries(this.settings.series)
            delete this.settings.series
        }
        this.createCanvas()
    }
    addSeries(series){
        return _.map(series, (s) => {
            return new Series(s.data, s.settings, this)
        })
    }
    createCanvas(){
        this.settings.container.innerHTML = '<canvas id="'+this.id+'" style="width: '+this.settings.width+';height: '+this.settings.height+';"></canvas>'
    }

}
