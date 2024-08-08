const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")

const errorMiddleware = require("./src/middleware/error");

app.use(express.json());
app.use(cookieParser());

// Route Imports

const user = require("./src/routes/userRoutes");
const lotteryprice = require("./src/routes/lotteryprice");
const userpayment = require("./src/routes/payment");
const lottery = require("./src/routes/lottery");
const dashboard = require("./src/routes/dashboard")



app.use("/thailottery/api/user", user);
app.use("/thailottery/api/admin", user);

app.use("/thailottery/api/user/payment", userpayment);
app.use("/thailottery/api/admin/payment", userpayment);

app.use("/thailottery/api/payment", userpayment);
app.use("/thailottery/api", dashboard);
app.use("/thailottery/api/lottery", lottery,);
app.use("/thailottery/api/lottery", lotteryprice,);
git 

//Middeware for Error 

app.use(errorMiddleware);
module.exports = app;                                                 // server.js     