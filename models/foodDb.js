var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var foodSchema= new Schema({
    
    vendor:String,
    phNo:String,
    name:String
});
foodSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("foodDb",foodSchema);