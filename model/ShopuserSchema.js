const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    shop: {
        type: String,
        required: true,
    },
    lane: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    
    phonenumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token:{
                type: String,
                required: true,
            }
        }
    ]
})





userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password + "23945", 12)
    }
    next();
})


userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id:this._id}, "HARSHisAsuperCoderboy");
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
        next()
    } catch (error) {
        console.log(error)
    }
}

const Shop = mongoose.model('shops', userSchema);


module.exports = Shop;