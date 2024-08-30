const express = require("express");
const app = express();
const morgan = require("morgan"); 
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser");
const path = require('path');


const errorMiddleware = require("./src/middleware/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }))

// Route Imports

const user = require("./src/routes/userRoutes");
const lotteryprice = require("./src/routes/lotteryprice");
const userpayment = require("./src/routes/payment");
const lottery = require("./src/routes/lottery");
const dashboard = require("./src/routes/dashboard")

app.set("view engine", "ejs")

// app.use(morgan('tiny'))
app.use('/css', express.static(path.resolve(__dirname, "public/app-assets")));
app.use('/img', express.static(path.resolve(__dirname, "public/app-assets")));
app.use('/js', express.static(path.resolve(__dirname, "public/app-assets")));

app.use('/', dashboard)
app.use('/user', user)


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