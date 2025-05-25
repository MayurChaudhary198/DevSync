const Joi = require("joi");

//Tasks Validation
const createTaskValidation =  (req, res, next) => {
    const  schema = Joi.object({
        title: Joi.string().min(2).required(),
        description: Joi.string().allow(""),
        status: Joi.string().valid("pending", "in-progress", "completed").insensitive(),
        projectId: Joi.string().required()
    });
    const { error } =  schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({ message: "Bad request", error})
    }
    next();
    
}

module.exports = {
    createTaskValidation
}