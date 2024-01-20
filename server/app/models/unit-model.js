const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const unitSchema=new Schema({
    unitNumber:Number,
    block: { type: Schema.Types.ObjectId, ref: "Block" },
    group:{type:Schema.Types.ObjectId,ref:"Group"},
    members: [{ memberId: { type: Schema.Types.ObjectId, ref: "User" },_id:false }],
    // visitors:[{ visitorId:{ type: Schema.Types.ObjectId, ref: "Visitor" },_id:false}],
},{timestamps:true})

const Unit=model("Unit",unitSchema)

module.exports=Unit