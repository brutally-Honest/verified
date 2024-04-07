const {PORT,
    DB_NAME,
    DB_URL,
    MONGO_URI,
    JWT_KEY,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_SID,
    TWILIO_FROM,
    TWILIO_TO,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_ENDPOINT,
    RETURN_URL,
    SUCCESS_URL,
    CANCEL_URL,
    S3_BUCKET_NAME,
    S3_BUCKET_REGION,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,}=process.env

const envChecks=()=>{
    if(!PORT) {
        console.log("PORT missing!",PORT);
        process.exit(1)
    }
    if(!DB_NAME) {
        console.log("DB_NAME missing!",DB_NAME);
        process.exit(1)
    }
    if(!DB_URL) {
        console.log("DB_URL missing!",DB_URL);
        process.exit(1)
    }
    if(!MONGO_URI) {
        console.log("MONGO_URI missing!",MONGO_URI);
        process.exit(1)
    }
    if(!JWT_KEY) {
        console.log("JWT_KEY missing!",JWT_KEY);
        process.exit(1)
    }
    if(!TWILIO_ACCOUNT_SID) {
        console.log("TWILIO_ACCOUNT_SID missing!",TWILIO_ACCOUNT_SID);
        process.exit(1)
    }
    if(!TWILIO_AUTH_TOKEN) {
        console.log("TWILIO_AUTH_TOKEN missing!",TWILIO_AUTH_TOKEN);
        process.exit(1)
    }
    if(!TWILIO_SERVICE_SID) {
        console.log("TWILIO_SERVICE_SID missing!",TWILIO_SERVICE_SID);
        process.exit(1)
    }
    if(!TWILIO_FROM) {
        console.log("TWILIO_FROM missing!",TWILIO_FROM);
        process.exit(1)
    }
    if(!TWILIO_TO) {
        console.log("TWILIO_TO missing!",TWILIO_TO);
        process.exit(1)
    }
    if(!STRIPE_SECRET_KEY) {
        console.log("STRIPE_SECRET_KEY missing!",STRIPE_SECRET_KEY);
        process.exit(1)
    }
    if(!STRIPE_WEBHOOK_ENDPOINT) {
        console.log("STRIPE_WEBHOOK_ENDPOINT missing!",STRIPE_WEBHOOK_ENDPOINT);
        process.exit(1)
    }
    if(!RETURN_URL) {
        console.log("RETURN_URL missing!",RETURN_URL);
        process.exit(1)
    }
    if(!CANCEL_URL) {
        console.log("CANCEL_URL missing!",CANCEL_URL);
        process.exit(1)
    }
    if(!S3_BUCKET_NAME) {
        console.log("S3_BUCKET_NAME missing!",S3_BUCKET_NAME);
        process.exit(1)
    }
    if(!S3_BUCKET_REGION) {
        console.log("S3_BUCKET_REGION missing!",S3_BUCKET_REGION);
        process.exit(1)
    }
    if(!S3_ACCESS_KEY) {
        console.log("S3_ACCESS_KEY missing!",S3_ACCESS_KEY);
        process.exit(1)
    }
    if(!S3_SECRET_KEY) {
        console.log("S3_SECRET_KEY missing!",S3_SECRET_KEY);
        process.exit(1)
    }
    console.log("Envs Checked!!!");
}

module.exports={envChecks}