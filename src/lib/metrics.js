var mongoose = require('mongoose');

var Metrics = new mongoose.Schema({
    id_user : String,
    timestamp : String,
    value : String
});

var Metrics = mongoose.model('myMetric',Metrics);

module.exports = Metrics;