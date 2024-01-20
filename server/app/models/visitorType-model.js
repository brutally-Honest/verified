const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const visitorTypeSchema=new Schema({
    type:String,
})

const VisitorType=model('VisitorType',visitorTypeSchema)
module.exports=VisitorType