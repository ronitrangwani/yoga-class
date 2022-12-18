//Import all dependencies,frameworks,models,routes
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const CORS = require("cors");
const PORT = process.env.PORT || 3000;
const hostname = "localhost";
const userRoute = require("./Routes/userInfoRoute");
const paymentRoute = require("./Routes/paymentInfoRoute");
const path = require("path");

//require("dotenv").config();

dotenv.config({ path: "./config.env" });

//Setup database entities
const DB_LINK = process.env.MY_MONGO_URI;

//Middleware
app.use(CORS());
app.use(express.json());

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(DB_LINK);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

//Implement routing
app.use(userRoute);
app.use(paymentRoute);

if (process.env.NODE_ENV === "production") {
    //*Set static folder up in production
    app.use(express.static("client/build"));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
}

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    });
});