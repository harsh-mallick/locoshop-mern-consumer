const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const User2 = require('../model/userSchema2');

const authenticate = async (req, res, next) =>{
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, "HARSHisAsuperCoderboy");

        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});

        if(!rootUser){throw new Error('User not found')}

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        const rootdata = await User2.findOne(rootUser._id)
        if(!rootdata){throw new Error('Data not found')}
        req.data = rootdata.content;

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = authenticate;