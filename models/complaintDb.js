var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var complaintSchema= new Schema({
    
 username:String,
 complaint:String,
 phNo:String,
 vendor:String,
 vendorSol:Number,
 CustomerSol:Number
});

module.exports = mongoose.model("complaint",complaintSchema);