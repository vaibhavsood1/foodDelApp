var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var commentSchema= new Schema({
 query_id : String,    
 username:String,
 comment:String 

});

module.exports = mongoose.model("comment",commentSchema);