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



app.use("/thailottery/api/user", user);                                       // OK
app.use("/thailottery/api/admin", user);                                      // OK

app.use("/thailottery/api/user/payment", userpayment);                        // OK
app.use("/thailottery/api/admin/payment", userpayment);                       // OK


app.use("/thailottery/api/admin", dashboard);                                 // OK 

app.use("/thailottery/api/admin", lotteryprice,);                             // OK 

app.use("/thailottery/api/admin/lottery", lottery,);                           // OK

app.use("/thailottery/api/user/lottery", lottery,);                            // OK


//Middeware for Error 

app.use(errorMiddleware);

module.exports = app;                                                