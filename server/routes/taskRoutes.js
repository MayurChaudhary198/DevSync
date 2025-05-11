const router = require("express").Router();
const protect  = require("../middlewares/authMiddleware");
const { createTask, getTasks, updateTask , deleteTask} = require("../controllers/taskController");
const { createTaskValidation } = require("../middlewares/taskValidation");

//Creating New Task
router.post("/", protect, createTaskValidation, createTask);

//Show All Tasks
router.get("/:projectId", protect, getTasks);

//Upadte Tasks
router.put("/:id", protect, updateTask);

//Delete Tasks
router.delete("/:id", protect, deleteTask);

module.exports = router;