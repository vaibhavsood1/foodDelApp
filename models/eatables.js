var mongoose = require("mongoose");
var user  = require("../models/user.js")
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var eatablesSchema= new Schema({
    
    price:String,
    itemName:String,
    desc:String,
    author: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    username:String
   
});

module.exports = mongoose.model("eatable",eatablesSchema);