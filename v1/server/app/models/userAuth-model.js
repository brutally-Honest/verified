const mongoose=require('mongoose')
const {Schema ,model}=mongoose

const userAuthSchema=new Schema({
    userName:String,
    userPhoneNumber:Number,
    email:String,
    password:String,
    role:{type:String,enum:["admin","groupAdmin","member","gaurd"]}
},{timestamps:true})

const UserAuth=model('UserAuth',userAuthSchema)
module.exports=UserAuth