const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const blockSchema=new Schema({
    blockName:String,
    units:[{unitId:{type:Schema.Types.ObjectId,ref:"Unit"},_id:false}],
    group:{type:Schema.Types.ObjectId,ref:"Group"},
},{timestamps:true})

const Block=model("Block",blockSchema)

module.exports=Block