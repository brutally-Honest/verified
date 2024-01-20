const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const gaurdSchema=new Schema({
    group:{type:Schema.Types.ObjectId,ref:"Group"},
    userAuthId:{type:Schema.Types.ObjectId,ref:"UserAuth"},
},{timestamps:true})

const Gaurd=model("Gaurd",gaurdSchema)

module.exports=Gaurd