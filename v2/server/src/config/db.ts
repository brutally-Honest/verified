import mongoose from 'mongoose' 
import {envs} from "../utils/envChecks.js"

export const configureDB=async()=>{
    
    try{
       const connectionInstance= await mongoose.connect(`${envs.db_url}/${envs.db_name}`)
        console.log('Connected to db',connectionInstance.connection.host);
    }catch(e){
        console.log(('Error connecting to db'));
    }
}



