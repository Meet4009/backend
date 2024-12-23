const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const cors = require('cors');


app.use(cors({
  origin: '*'
}));



const errorMiddleware = require("./src/middleware/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));

// Route Imports

const user = require("./src/routes/userRoutes");
const lotteryprice = require("./src/routes/lotteryprice");
const payment = require("./src/routes/payment");
const lottery = require("./src/routes/lottery");
const dashboard = require("./src/routes/dashboard");


app.use("/api/admin", user);
app.use("/api/user", user);

app.use("/api/admin/payment", payment);
app.use("/api/user/payment", payment);


app.use("/api/admin", dashboard);
app.use("/api/admin", lotteryprice);

app.use("/api/admin/lottery", lottery);
app.use("/api/user/lottery", lottery);


//Middeware for Error 

app.use(errorMiddleware);

module.exports = app;                                                