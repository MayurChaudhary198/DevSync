const router = require("express").Router();
const protect  = require("../middlewares/authMiddleware");
const { createProject, getUserProjects, updateProject, deleteProject, getProjectById, searchProjects, getProjectDashboard} = require("../controllers/projectController");
const { inviteToProject, removeFromProject } = require("../controllers/teamController");
const { createProjectValidation } = require("../middlewares/projectValidation");
const { generateAISummary } = require("../controllers/aiSummaryController");


//Creating New Project
router.post("/", protect , createProjectValidation, createProject)

//Show All Projects
router.get("/", protect, getUserProjects)

//Upadte Project
router.put("/:id", protect, updateProject )

//Delete Projectz
router.delete("/:id", protect, deleteProject)

//Show single Project
router.get("/:id", protect, getProjectById)

// Search Project
router.get("/search", protect, searchProjects)

//Dashboard 
router.get("/:id/dashboard",protect, getProjectDashboard)

//Team member Management
//Adding Team member
router.post("/:id/invite", protect, inviteToProject)

//Removing Team member
router.delete("/:id/remove", protect, removeFromProject)

//Get Project summary by AI
router.post("/:id/summary", protect, generateAISummary);



module.exports = router;