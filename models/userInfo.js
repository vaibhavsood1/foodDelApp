var mongoose = require("mongoose");
var user  = require("../models/user.js")
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var infoSchema= new Schema({
    
    vendor:Boolean,
    name:String,
    username:String,
    author: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    hostel:String,
    roomNo:String,
    phNo:String
});

module.exports = mongoose.model("info",infoSchema);