const Project = require("../models/Project");
const User = require("../models/User");

const inviteToProject = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    // Check permission
    if (project.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        message: "You are not authorized to update this project",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No user found with that email",
        success: false,
      });
    }

    // Check if already invited
    const alreadyAdded = project.teamMembers.includes(user._id);
    if (alreadyAdded) {
      return res.status(400).json({
        message: "User is already a team member",
        success: false,
      });
    }

    // Add user
    project.teamMembers.push(user._id);
    await project.save();

    return res.status(200).json({
      message: "User invited successfully",
      success: true,
      teamMembers: project.teamMembers,
    });
  } catch (err) {
    console.error("Invite error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const removeFromProject = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    if (project.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        message: "You are not authorized to update this project",
        success: false,
      });
    }

    const isInTeam = project.teamMembers.includes(userId);
    if (!isInTeam) {
      return res.status(400).json({
        message: "User is not a team member",
        success: false,
      });
    }

    project.teamMembers = project.teamMembers.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    return res.status(200).json({
      message: "User removed from project",
      success: true,
      teamMembers: project.teamMembers,
    });
  } catch (err) {
    console.error("Remove error:", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  inviteToProject,
  removeFromProject,
};
