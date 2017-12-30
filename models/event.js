const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title   : {type: String, required: true},
    start   : {type: Date, default: Date.now},
    end     : {type: Date, default: Date.now},
    allDay  : {type: Boolean},
    bgColor : {type: String, default: '#00a65a'},
    owner   : {type: String, required: true}
});

eventSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        let retJson = {
            id     : ret._id,
            title  : ret.title,
            start  : ret.start,
            end    : ret.end,
            allDay : ret.allDay,
            backgroundColor: ret.bgColor,
        };
        return retJson;
    }
});

module.exports = mongoose.model('Event', eventSchema);