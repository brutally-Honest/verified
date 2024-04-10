const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const groupSchema=new Schema({
    groupName:String,
    groupPhoneNumber:Number,
    groupCode:String,
    groupAdmin:{type:Schema.Types.ObjectId,ref:"GroupAdmin"},
    gaurd:{type:Schema.Types.ObjectId,ref:"Gaurd"},
    members:[{memberId:{type:Schema.Types.ObjectId,ref:"Member"},_id:false}],
    blocks:[{blockId:{type:Schema.Types.ObjectId,ref:"Block"},_id:false}],
    status:{type:String,enum:["pending","approved"],default:"pending"},
    address:String
},{timestamps:true})

const Group=model("Group",groupSchema)

module.exports=Group