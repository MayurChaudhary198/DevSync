const router = require("express").Router();
const protect  = require("../middlewares/authMiddleware");
const { createProject } = require("../controllers/projectController");
const { createProjectValidation } = require("../middlewares/projectValidation")

router.post("/", protect , createProjectValidation, createProject)


module.exports = router;