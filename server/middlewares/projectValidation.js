const Joi = require("joi");

//Project Validation 
const createProjectValidation = (req ,res ,next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().optional(),
        teamMembers: Joi.array().items(Joi.string()).optional()
    });
    const { error } =  schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({ message: "Bad request", error})
    }
    next();

}

module.exports = {
    createProjectValidation
}