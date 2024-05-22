import mongoose from 'mongoose' 
import {envs} from "../utils/envChecks.js"
import chalk from 'chalk';

export const configureDB=async()=>{
    
    try{
       const connectionInstance= await mongoose.connect(`${envs.db_url}/${envs.db_name}`)
        console.log(`[DB] : ${connectionInstance.connection.name}`)
    }catch(e){
        console.log(('Error connecting to db'));
    }
}



