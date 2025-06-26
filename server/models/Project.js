const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;