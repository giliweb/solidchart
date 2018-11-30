import _ from 'lodash'

export default class Line {
    constructor(settings){
        _.merge({
        }, settings)
        this.settings = settings

        return this
    }
}