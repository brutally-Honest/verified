const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const noticeSchema=new Schema({
    group:{type:Schema.Types.ObjectId,ref:"Group"},
    notice:String,
},{timestamps:true})

const Notice=model('Notice',noticeSchema)
module.exports=Notice