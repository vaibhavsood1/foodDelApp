var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var querySchema= new Schema({
    
 username:String,
 ques:String

});

module.exports = mongoose.model("query",querySchema);