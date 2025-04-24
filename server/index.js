const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const User = require("./models/User")

// Middleware
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
    }
}

main();

// Basic Route
app.get("/", (req, res) => {
    res.send("👋 Hii DevSync");
});


//// Testing User Model
// app.get("/test",async(req,res)=>{

//     let sample = new User({
//         name:"mayur",
//         email:"mayur@gmail.com",
//         password:"1234"
//     });

//     await sample.save();
//     console.log("Saved");
//     res.send("Succesefull")
    
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});