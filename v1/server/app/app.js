const express = require("express");
const cors = require("cors");
const app = express();
const configureDB = require("../config/db");
const stripeWebhook=require('../app/stripe/webhook')
app.use(cors());
configureDB();

const server = require("http").createServer(app);

app.post('/webhook',express.raw({type:'application/json'}),stripeWebhook)
app.use(express.json());
const usersRoute = require("./routes/User");
const groupsRoute = require("./routes/Group");
const visitorsRoute = require("./routes/Visitor");
const noticeRoute = require("./routes/Notice");
const paymentRoute = require("./routes/Payment");
const { errorHandler } = require("./middlewares/errorHandler");


app.use("/users", usersRoute);
app.use("/groups", groupsRoute);
app.use("/visitors", visitorsRoute);
app.use("/notices",noticeRoute)
app.use('/payments',paymentRoute)
app.use(errorHandler)

module.exports={server}