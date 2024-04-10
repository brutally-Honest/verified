const {
    TWILIO_SERVICE_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_ACCOUNT_SID,
    TWILIO_FROM,
    TWILIO_TO,
  } = process.env;
  const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendSMS=async(OTP) =>{
    try{

        const msgOptions = {
            body:OTP,
            // to: `+91${visitor.visitorPhoneNumber}`, // actuall visitor Number
            to: TWILIO_TO,
            from: TWILIO_FROM, // From a valid Twilio number
        };
        const msg=await client.messages.create(msgOptions)
        console.log("Message sent",msg);
        return msg
    }catch(error){
        console.log("Error sending message",error);
    }
};

module.exports={sendSMS}