const {env}=process.env

export const envs:{[property:string]:string}={}
export const ENVLIST=()=>{
  // console.log(('ENVLIST\n'))
  
  const envDetails=env?.split(',').reduce((acc,cv)=>{
    const [name,value]=cv.split('=')
    acc+=`${name}=${value}\n`
    envs[name.toLowerCase()]=value
    return acc
  },'')||''
  // console.log(envs);
  
  // console.log((envDetails))
}


// const envArray: stringArray = [
// "PORT",
// "JWT_KEY",
// "DB_NAME",
// "DB_URL",
// "MONGO_URI",
// "TWILIO_ACCOUNT_SID",
// "TWILIO_AUTH_TOKEN",
// "TWILIO_SERVICE_SID",
// "TWILIO_FROM",
// "TWILIO_TO",
// "STRIPE_SECRET_KEY",
// "STRIPE_WEBHOOK_ENDPOINT",
// "RETURN_URL",
// "SUCCESS_URL",
// "CANCEL_URL",
// "S3_BUCKET_NAME",
// "S3_BUCKET_REGION",
// "S3_ACCESS_KEY",
// "S3_SECRET_KEY",
// ];

// const envChecks = () => {
//   const missingVariables: string[] = [];

//   envArray.forEach((env) => {
//     const value = process.env[env];
//     console.log(value);
    
//     if (value === undefined || value === null) {
//       missingVariables.push(env);
//     }
//   });

//   if (missingVariables.length > 0) {
//     console.log("\nMissing environment variables \n");
//     missingVariables.forEach((env) =>
//       console.log(`${env} : ${process.env[env]}`)
//     );
//     process.exit(1);
//   }

//   console.log(colors.bgWhite.black("Envs Checked !!!"));
// };

