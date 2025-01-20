const mongoose = require("mongoose");

// const connectdatabase = () => {
//     mongoose.connect(process.env.DB_URL).then((data) => {
//         console.log(`mongoDB connected with server: ${data.connection.host}`);
//     })
// }

const connectdatabase = () => {
    mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`mongoDB connected with server: ${data.connection.host}`);
    })
}
module.exports = connectdatabase;