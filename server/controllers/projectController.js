const Project = require("../models/Project");
const Task = require("../models/Task");

const createProject = async(req, res) => {
    try {
    const { title, description, teamMembers} = req.body
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


const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user._id });

        return res.status(200).json({
            message: "Projects fetched successfully",
            success: true,
            projects
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


const updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description, teamMembers } = req.body;

    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }

        if (project.createdBy.toString() !== req.user._id) {
            return res.status(403).json({
                message: "You are not authorized to update this project",
                success: false
            });
        }

        const updateData = { title, description, teamMembers };

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "Project updated successfully",
            success: true,
            project: updatedProject
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


const deleteProject = async(req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);

        if(!project){
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }

        if (project.createdBy.toString() !== req.user._id) {
            return res.status(403).json({
                message: "You are not authorized to delete this project",
                success: false
            });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Project deleted successfully",
            success: true,
            project: deletedProject
        });


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


const getProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }

        if (project.createdBy.toString() !== req.user._id) {
            return res.status(403).json({
                message: "You are not authorized to view this project",
                success: false
            });
        }

        return res.status(200).json({
            message: "Project fetched successfully",
            success: true,
            project
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


const searchProjects = async(req, res) => {
    const { title } =  req.query;

    let query = { createdBy : req.user._id };
    if(title) {
        query.title = { $regex: title, $options: "i" };
    }

    try {
        const projects = await Project.find(query);
        return res.status(200).json({
            success: true,
            results: projects.length,
            projects
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getProjectDashboard = async (req, res) =>  {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }

        const isCreator = project.createdBy.toString() === req.user._id;
        const isTeamMember = project.teamMembers.includes(req.user._id);

         if (!isCreator && !isTeamMember) {
            return res.status(403).json({
                message: "You are not authorized to see this dashboard",
                success: false
            });
        }

        const totalTasks = await Task.countDocuments({ projectId: id });

        const completed = await Task.countDocuments({ projectId: id, status: "Completed" });
        const inProgress = await Task.countDocuments({ projectId: id, status: "In Progress" });
        const pending = await Task.countDocuments({ projectId: id, status: "Pending" })

        return res.status(200).json({
            success: true,
            projectId: id,
            totalTasks,
            completed,
            inProgress,
            pending,
            teamMembers: project.teamMembers.length
        });

        
    } catch (err) {
         return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


module.exports = {
    createProject,
    getUserProjects,
    updateProject,
    deleteProject,
    getProjectById,
    searchProjects,
    getProjectDashboard
}