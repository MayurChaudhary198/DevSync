const router = require("express").Router();
const protect  = require("../middlewares/authMiddleware");
const { createTask, getTasks, updateTask , deleteTask, getTaskById } = require("../controllers/taskController");
const { createTaskValidation } = require("../middlewares/taskValidation");

//Creating New Task
router.post("/", protect, createTaskValidation, createTask);

//Show All Tasks
router.get("/:projectId", protect, getTasks);

//Upadte Tasks
router.put("/:id", protect, updateTask);

//Delete Tasks
router.delete("/:id", protect, deleteTask);

// get one task by ID
router.get("/single/:id", protect, getTaskById); 

module.exports = router;