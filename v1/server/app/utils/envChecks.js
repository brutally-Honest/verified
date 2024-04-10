const envs = [
  "PORT",
  "DB_NAME",
  "DB_URL",
  "MONGO_URI",
  "JWT_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_SERVICE_SID",
  "TWILIO_FROM",
  "TWILIO_TO",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_ENDPOINT",
  "RETURN_URL",
  "SUCCESS_URL",
  "CANCEL_URL",
  "S3_BUCKET_NAME",
  "S3_BUCKET_REGION",
  "S3_ACCESS_KEY",
  "S3_SECRET_KEY",
];

const envChecks = (envArray) => {
const missingVariables=[]

  envArray.forEach((env) => {
    const value = process.env[env];
    if (value === undefined || value === null) {
        missingVariables.push(env)
    }
  });

  if (missingVariables.length > 0) {
    console.log("\nMissing environment variables \n");
    missingVariables.forEach(env=>console.log(`${env} : ${process.env[env]}`))
    process.exit(1)
  }

  console.log("Envs GOOD To GO !!!");
};

const ENV=()=>envChecks(envs);

module.exports = { ENV };
