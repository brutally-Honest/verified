require('dotenv').config()
const {envChecks}=require('./app/utils/envChecks')
envChecks()
const {server}=require("./app/app")
const {startSocket}=require('./app/socket/index')
startSocket()
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
