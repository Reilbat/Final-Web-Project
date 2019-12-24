var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: String, 
    lastname: String,
    username : {type : String, unique: true},
    password: {type : String},
    metrics : []
});

var User = mongoose.model('myUUser',userSchema);

module.exports = User;