const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const groupAdminSchema=new Schema({
    group:{type:Schema.Types.ObjectId,ref:"Group"},
    userAuthId:{type:Schema.Types.ObjectId,ref:"UserAuth"},
    property:{type:Schema.Types.ObjectId,ref:"Unit"},
    payment:[{paymentId:{type:Schema.Types.ObjectId,ref:"Payment"},_id:false}],
},{timestamps:true})

const GroupAdmin=model("GroupAdmin",groupAdminSchema)

module.exports=GroupAdmin