const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User");
const Project = require("./models/Project");
const authRoutes = require("./routes/authRoutes");
const ProjectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.use(cors({
  origin: ["http://localhost:5173", "https://devsync750.netlify.app/"],
  credentials: true
}));

//Authentication Routes
app.use('/api/auth',authRoutes);
//Project Routes
app.use('/api/projects',ProjectRoutes);
//Tasks Routes
app.use('/api/tasks',taskRoutes);

const MONGO_URL = process.env.MONGO_URL;


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


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});