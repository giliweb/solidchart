import _ from 'lodash'

export default class Axis {
    constructor(settings){
        _.merge({
        }, settings)
        this.settings = settings

        return this
    }
}