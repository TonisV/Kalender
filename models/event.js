const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title   : {type: String, required: true},
    start   : {type: Date, default: Date.now},
    end     : {type: Date, default: Date.now},
    allDay  : {type: Boolean},
    bgColor : {type: String, default: '#00a65a'},
    owner   : {type: String, required: true}
});

module.exports = mongoose.model('Event', eventSchema);