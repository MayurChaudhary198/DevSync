const router = require("express").Router();
const protect  = require("../middlewares/authMiddleware");
const { createProject, getUserProjects, updateProject, deleteProject, getProjectById, searchProjects} = require("../controllers/projectController");
const { inviteToProject, removeFromProject } = require("../controllers/teamController")
const { createProjectValidation } = require("../middlewares/projectValidation")


//Creating New Project
router.post("/", protect , createProjectValidation, createProject)

//Show All Projects
router.get("/", protect, getUserProjects)

//Upadte Project
router.put("/:id", protect, updateProject )

//Delete Project
router.delete("/:id", protect, deleteProject)

//Show single Project
router.get("/:id", protect, getProjectById)

// Search Project
router.get("/search", protect, searchProjects)


//Team member Management
//Adding Team member
router.post("/:id/invite", protect, inviteToProject)

//Removing Team member
router.delete("/:id/remove", protect, removeFromProject)



module.exports = router;