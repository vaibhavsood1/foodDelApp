var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var cartSchema= new Schema({
    
 username:String,
 item:String,
 price:String
});

module.exports = mongoose.model("cart",cartSchema);