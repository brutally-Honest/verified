const mongoose=require('mongoose')
const mongo_url=process.env.MONGO_URI

const configureDB=async()=>{
    try{
        await mongoose.connect(mongo_url)
        console.log('Connected to db');
    }catch(e){
        console.log('Error connecting to db');
    }
}

module.exports=configureDB

