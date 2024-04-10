const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const paymentSchema=new Schema({
    amount:Number,
    payer: { type: Schema.Types.ObjectId, ref: "GroupAdmin" },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    endsAt:Date,
    plan:String,
    subscriptionId:String,
},{timestamps:true})

const Payment=model('Payment',paymentSchema)
module.exports=Payment