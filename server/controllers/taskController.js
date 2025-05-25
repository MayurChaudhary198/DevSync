const Project = require("../models/Project");
const Task = require("../models/Task");

const createTask = async (req, res) => {
    const { title, description, status, projectId, assignedTo } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }

        if (assignedTo){
            const isCreator = project.createdBy.toString() == assignedTo;
            const isTeamMember = project.teamMembers.includes(assignedTo);

            if (!isCreator && !isTeamMember) {
                return res.status(400).json({
                    message: "Assigned user is not a member of this project",
                    success: false
                });
            }
        }



        //Create the task
        const task = new Task({
            title,
            description,
            status: status || "pending",
            projectId,
            createdBy: req.user._id,
        });

        await task.save();

        return res.status(201).json({
            message: "Task created successfully",
            success: true,
            task,
        });

    } catch (err) {
        console.error("Error creating task:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

const getTasks = async (req, res) => {
    const { projectId } = req.params;

    try {
        const tasks = await Task.find({ projectId }).populate("assignedTo", "name email");

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "No tasks found for this project",
                success: false
            });
        }

        return res.status(200).json({
            message: "Tasks fetched successfully",
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                success: false
            });
        }

        
        if (assignedTo) {
            const project = await Project.findById(task.projectId);
            if (!project) {
                return res.status(404).json({
                    message: "Associated project not found",
                    success: false
                });
            }

            const isCreator = project.createdBy.toString() === assignedTo;
            const isTeamMember = project.teamMembers.includes(assignedTo);

            if (!isCreator && !isTeamMember) {
                return res.status(400).json({
                    message: "Assigned user is not a member of this project",
                    success: false
                });
            }
        }  
        
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "Task updated successfully",
            success: true,
            task: updatedTask
        });

    } catch (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                success: false
            });
        }

        if (Project.createdBy.toString() !== req.user._id) {
            return res.status(403).json({
                message: "You are not authorized to delete this task",
                success: false
            });
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Task deleted successfully",
            success: true,
            task: deletedTask
        });

    } catch (err) {
        console.error("Error deleting task:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
}