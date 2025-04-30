const Project = require("../models/Project");

const createProject = async(req, res) => {
    try {
    const { title, description, teamMembers} = req.body;
    const createdBy = req.user._id;

    const projectModel = new Project({ title, description, createdBy ,teamMembers });
    await projectModel.save();

    return res.status(201)
                .json({
                    message: 'Project created successfully',
                    success: true,
                    project: projectModel
                })
                    
    } catch (err) {
        console.error(err);
        return res.status(500)
        .json({
            message: 'Internal server error',
            success: false
        })
    }
}

module.exports = {
    createProject
}