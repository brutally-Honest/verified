const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
  } = require("@aws-sdk/client-s3");
  const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

  const {
    S3_BUCKET_NAME,
    S3_BUCKET_REGION,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
  } = process.env;

  const s3 = new S3Client({
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    region: S3_BUCKET_REGION,
  });

  const getUrl=async(Key)=>{
      try{
        // console.log("S3 url generator");

        const getObjectParams = {
            Bucket: S3_BUCKET_NAME,
            Key
        };
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
        // console.log(url);
        return url
    }
    catch(error){
        console.log("Error fetching url",error);
    }
  }

  const uploadImage=async(imageName,buffer,mimetype)=>{
    try{
        console.log("Upload Image");
        putCommand = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: imageName,
            Body: buffer,
            ContentType: mimetype,
        });
         await s3.send(putCommand);
    }catch(error){
        console.log("Error uploading image to S3",error);
    }
  }

module.exports={getUrl,uploadImage}