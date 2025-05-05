const router = require("express").Router();
const protect  = require("../middlewares/authMiddleware");
const { createProject, getUserProjects, updateProject} = require("../controllers/projectController");
const { createProjectValidation } = require("../middlewares/projectValidation")


//Creating New Project
router.post("/", protect , createProjectValidation, createProject);

//Show All Project
router.get("/",protect,getUserProjects)

//Upadte Project
router.put("/:id",protect, updateProject )

module.exports = router;