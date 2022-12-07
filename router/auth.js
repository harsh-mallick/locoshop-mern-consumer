const express = require('express');
const app = express()
const router = express.Router();
require("../db/conn");
const Shop = require('../model/ShopuserSchema');
const Products = require('../model/Addproduct');
const Email = require('../model/email');
const Consumer = require('../model/ConsumerUserSchema');
const bcrypt = require('bcryptjs')
const cors = require("cors");
const authenticate = require('../middleware/authenticate');
const consumerauthenticate = require('../middleware/consumerauthenticate');
const idauthenticate = require('../middleware/idauth');
const cookieParser = require('cookie-parser');
const Token = require("../model/verifytoken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const uploads = require("../middleware/upload")
app.use(cors());
app.use(cookieParser())

//<------------------------------------------------------------------------------------------------------------------------------------------------------------------------->


// Consumer routes
router.post('/consumer-signup', async (req, res) => {
    const { name_consumer, house, lane, locality, state, pincode, phonenumber, email, password } = req.body;
    console.log(req.body)
    // Checking if any field is blank
    if (!name_consumer || !house || !lane || !locality || !state || !pincode || !phonenumber || !email || !password) {
        console.log("Cannot cannot retrieve data as field is/ are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }

    try {
        // Checking if a user with an email already exists
        const userExist = await Consumer.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "The email Id already exists" });
        }

        // Registering a new user 
        const user = new Consumer(req.body);

        // Checking that registration successful or failed
        try {
            await user.save();

            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to register" });
        }
    } catch (error) {
        console.log(error);
    }
});

// Post Request: Making a Consumer Login
router.post('/consumer-signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Checking if any field is blank
        if (!email || !password) {
            console.log("Cannot cannot retrieve data as a feild is blank")
            return res.status(422).json({ error: "None of the feilds can be blank" });
        }

        // Checking if a user with an email  exists
        const userLogin = await Consumer.findOne({ email: email });


        if (userLogin) {
            const isMatch = await bcrypt.compare(password + "23945", userLogin.password)

            const token = await userLogin.generateAuthToken();
            console.log(token)

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            })
            console.log(isMatch)

            if (!isMatch) {
                res.status(400).json({ error: "Incorrect credential" })
            } else {
                res.json({ message: "Login successful              Your JWT: " + token })
            }
        } else {
            res.status(400).json({ error: "Incorrect credential" })
        }

    } catch (error) {
        console.log(error);
    }
});


// Get Request: Retrieve Consumer Profile Info
router.get('/getConsumerdata', consumerauthenticate, (req, res) => {
    res.send(req.rootUser);
})
// Get Request: Retrieve Consumer Profile Info
router.get('/getShopdata', consumerauthenticate, async (req, res) => {
    const pincode = req.rootUser.pincode
    console.log(pincode)
    const allshop = await Shop.find({pincode: pincode})
    console.log(allshop)
    res.send(allshop)
})
router.get('/allproduct', consumerauthenticate, async (req, res) => {
    const itemid = req.cookies.itemid
    console.log(itemid)
    const allproduct = await Products.find({user: itemid})
    console.log(allproduct)
    res.send(allproduct)
})
router.get('/singleproduct', consumerauthenticate, async (req, res) => {
    const itemidone = req.cookies.itemidone
    console.log(itemidone)
    const singleproduct = await Products.find({_id: itemidone})
    console.log(singleproduct)
    res.send(singleproduct)
})



// Home page send email route
router.post('/sendEmail', authenticate, async (req, res) => {
    const { cname, cemail, cmessage } = req.body;
    // Checking if any field is blank
    if (!cname || !cemail || !cmessage) {
        console.log("Cannot retrieve data as a field is blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }
    try {

        // Adding a new admission form
        const email = new Email({
            cname, cemail, cmessage, user: req.rootUser._id
        });
        // Checking that adding successful or failed
        try {
            await email.save();

            res.status(201).json({ message: "Message sent successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to send message" });
            // console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
})

// Logging out a user
router.get('/logout', (req, res) => {
    console.log("Logout Page");
    res.clearCookie('jwtoken', { path: "/" })
    res.clearCookie('itemid', { path: "/" })
    res.status(200).send("User Logged out")
})

module.exports = router;