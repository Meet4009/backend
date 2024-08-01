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



app.use("/api/v1", user);
app.use("/api/v1/payment", userpayment);
app.use("/api/v1/admin", lotteryprice, lottery, dashboard);



//Middeware for Error 

app.use(errorMiddleware);
module.exports = app;                                                 // server.js     