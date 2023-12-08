import jwt from "jsonwebtoken";
import Validator from 'validator';
import bcrypt from 'bcryptjs';
import { CourierClient } from '@trycourier/courier';
import User from '../models/userModels.js';
const template_verify = "8B40YYSEGGMQ9NJBNK54AH3EGRNT";
const template_reset = "4A3Y3GQ7VT48QRH77TKAYXVSBENC";

const courier = new CourierClient({ authorizationToken: "pk_prod_2EW1NFN7VY4635Q81ZFZ0EB0BVGJ" });
const generateToken = ({ id, name, email, role }) => {
    return jwt.sign({ id, name, email, role, iat: new Date().getTime() }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const authController = {
    onLogin: async (req, res) => {
        const { email, password } = req.body;
        const femail = email.toLowerCase()
        const user = await User.findOne({ email: femail });
        if (!user) {
            res.status(200).json({ msg: 'Incorrect password or username!', success: false });
            console.log('No exist User');
        } else {
            if (user.verify) {
                if (bcrypt.compareSync(password, user.password)) {
                    
                    if(user.status == "blocked") {
                        res.status(200).json({ msg: 'You are blocked from Admin!', success: false });
                        return;
                    }
                    
                    res.status(200).json({
                        success: true,
                        token: generateToken({ id: user._id, name: user.name, email: user.email, role: user.role }),
                        username: user.name,
                        id: user._id,
                        avatar: user.avatar,
                        role: user.role,
                        msg: 'Hello ' + user.name + ", welcome!"
                    });
                }
                else
                    res.status(200).json({ msg: 'Incorrect password or username!', success: false });
            } else {
                res.status(200).json({ msg: 'Please email verify', success: false });
            }

        }
    },
    onSignup: async (req, res) => {
        const { email, password, name, firstname, lastname } = req.body;

        const femail = email.toLowerCase();

        if (!Validator.isEmail(femail)) {
            return res.status(200).json({ msg: 'Invalid email!', success: false });
        }

        if (password.length < 6 || password.length > 30) {
            console.error("Please fill all fields");
            return res.status(200).json({ msg: 'Password must be at least 6 letters and max 30 letters!', success: false });
        }

        if (name.length < 6 || name.length > 30) {
            console.error("Please fill all fields");
            return res.status(200).json({ msg: 'Username must be at least 6 letters and max 30 letters!', success: false });
        }

        if(name.length == 0) {
            console.error("Please fill all fields");
            return res.status(200).json({ msg: 'Please insert name!', success: false });
        }

        const isExistMail = await User.findOne({ email:femail });
        const isExist = await User.findOne({ name });

        console.log("sign up controller");
        if (isExistMail) {
            res.status(200).json({ msg: 'Email already exists !', success: false });
            console.error("User mail already exists !");
        } else if (isExist) {
            res.status(200).json({ msg: 'Username already exists !', success: false });
            console.error("User name already exists !");
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            // verify connection configuration
            let link = `${req.protocol}://${req.get('host')}/api/v1/auth/verify?email=${email}&code=${hash}`;
            const user = new User({
                ...req.body,
                email: femail,
                password: hash
            });
            await user.save();

            courier.send({
                message: {
                  to: {
                    email: email
                  },
                  template: template_verify,
                  data: {
                    link: link,
                  },
                },
            }).then((response)=>{
                console.log("Email sent", response);
                res.status(200).json({ success: true, msg: 'Plesae verify from your mailbox, please also check your spam folder' });
            }).catch((error)=>{
                console.error(error);
            });
        }
    },
    onVerify: async (req, res) => {
        var { email, code } = req.query;
        const femail = email.toLowerCase();
        const user = await User.findOne({ email:femail });
        if (user) {
            console.log('ok');
            if (user.password == code) {
                await User.updateOne({ email:femail }, { verify: true });
                res.redirect(`${process.env.FRONTENDURL}/#/dashboard/app/mail-confirmed`)
            } else {
                res.status(400).json({ success: false });
            }
        } else {
            res.status(401).json({ success: false });
        }
    },
    onSendResetPasswordLink: async (req, res) => {
        const {email} = req.body;
        const femail = email.toLowerCase();

        const isExist = await User.findOne({ email:femail });

        if(isExist) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(getRandomString(), salt);

            let link = `${process.env.FRONTENDURL}/#/reset-password?email=${email}&code=${hash}`;
            
            courier.send({
                message: {
                  to: {
                    email: email
                  },
                  template: template_reset,
                  data: {
                    link: link,
                  },
                },
            }).then((response)=>{
                console.log("Email sent", response);
                res.status(200).json({ success: true, msg: 'Plesae check your mail' });
            }).catch((error)=>{
                console.error(error);
                res.status(400).json({ success: false, msg: 'Error sending mail' });
            });
            await User.updateOne({ email:femail }, { password: hash });
        }
        else {
            res.status(200).json({ success: false, msg:"User not found." });
        }
    },

    onPasswordReset: async (req, res) => {
        var { email, code, newpassword } = req.body;
        const femail = email.toLowerCase();

        const user = await User.findOne({ email:femail });
        if (user) {
            if (user.password == code) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newpassword, salt);
                await User.updateOne({ email:femail }, { password: hash });
                res.status(200).json({ success: true, msg: 'Plesae login new with new password' });
            } else {
                res.status(200).json({ success: false, msg:"Wrong request" });
            }
        } else {
            res.status(200).json({ success: false, msg:"User not found." });
        }
    },
}

const getRandomString = () => {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            
            //specify the length for the new string
	var lenString = 20;
	var randomstring = '';

            //loop to select a new character in each iteration
	for (var i=0; i < lenString; i++) {
		var rnum = Math.floor(Math.random() * characters.length);
		randomstring += characters.substring(rnum, rnum+1);
	}

    return randomstring;
}

export default authController

// module.exports = authController;