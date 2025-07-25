const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require("../models/User");
 

const signup = async(req, res) => {
    try {
        const { name, email,  password } = req.body;
        const user = await User.findOne({ email });
        if(user){
            return res.status(409)
                .json({
                    message: 'User is already exist, you can login',
                    success: false
                })
        }
        const userModel = new User({ name, email, password});
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        return res.status(201)
                .json({
                    message: 'Signup successfully',
                    success: true
                })

    } catch (err) {
        return res.status(500)
                .json({
                    message: 'Internal server error',
                    success: false
                })
        
    }
}

const login = async(req, res) => {
    try {
        const { email,  password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = "Auth failed email or password is wrong"
        if(!user){
            return res.status(401)
                .json({
                    message: errorMsg,
                    success: false
                })
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(401)
                .json({
                    message: errorMsg,
                    success: false
                })
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        return res.status(200)
                .json({
                    message: 'Login success',
                    success: true,
                    jwtToken,
                    user: {
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                })

    } catch (err) {
        return res.status(500)
                .json({
                    message: 'Internal server error',
                    success: false
                })
        
    }
}

module.exports = {
    signup,
    login
}