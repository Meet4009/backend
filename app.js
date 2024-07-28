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


app.use("/api/v1", user);
app.use("/api/v1/admin",lotteryprice );
app.use("/api/v1/payment", userpayment);


//Middeware for Error 

app.use(errorMiddleware);
module.exports = app;                                                 // server.js     