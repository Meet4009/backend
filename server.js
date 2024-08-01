
const app = require("./app");                                                                                                                               

const dotenv = require("dotenv");                                                                                                                           
const connectDatabase = require("./src/database/connection");

// Handling Uncaught Exception

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shuttng down the server due to Unhandle Uncaught Exception`);
    process.exit(1);
});

// Config

dotenv.config({ path: "src/config/config.env" });
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    // console.log(`server is working on http://localhost:${process.env.PORT}`);
    console.log(`server :  http://localhost:${process.env.PORT}`);
});

// Unhamdled Promise Pejection

process.on("unhandleRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shuttng down the serevr due to Unhandle Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});