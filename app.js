const express = require("express");
const app = express();
const morgan = require("morgan"); 
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser");
const path = require('path');
const cors = require('cors');


 app.use(cors({
    origin: '*'
  }));
  


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
app.set('views', path.join(__dirname, 'views'));


// app.use(morgan('tiny'))
app.use('/css', express.static(path.resolve(__dirname, "public/app-assets")));
app.use('/img', express.static(path.resolve(__dirname, "public/app-assets")));
app.use('/js', express.static(path.resolve(__dirname, "public/app-assets")));


app.use("/api/user", user);                                       // OK
app.use("/api/admin", user);                                       // OK

app.use("/api/admin/payment", userpayment);                       // OK
app.use("/api/user/lottery", lottery);                            // OK
app.use("/api/user/payment", userpayment);                        // OK


app.use("/api/admin", dashboard);                                 // OK 
app.use("/api/admin", lotteryprice);                             // OK 

app.use("/api/admin/lottery", lottery);                           // OK


//Middeware for Error 

app.use(errorMiddleware);

module.exports = app;                                                