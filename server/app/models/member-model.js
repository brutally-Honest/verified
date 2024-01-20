const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const memberSchema=new Schema({
    group:{type:Schema.Types.ObjectId,ref:"Group"},
    userAuthId:{type:Schema.Types.ObjectId,ref:"UserAuth"},
    status:{type:String,enum:["pending","Unit Pending","approved"],default:"pending"},
    property:{type:Schema.Types.ObjectId,ref:"Unit"},
},{timestamps:true})

const Member=model("Member",memberSchema)

module.exports=Member