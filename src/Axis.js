import _ from 'lodash'
import moment from 'moment'

export default class Axis {
    constructor(settings){
        this.settings = _.merge({
            interval: moment.duration(60, 'seconds')
        }, settings)
        this.init()
        return this
    }
    init(){

    }
}