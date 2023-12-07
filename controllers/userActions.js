
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModels.js';
import path from 'path';


//user route controller functions
/**
 * 
 * @param {*} req this function req, reqest the all the users listed 
 * @param {*} res we respond to the clients all the users from th*
 */
export const getUsers = asyncHandler(async(req, res) => {
    const user = await User.find({User});
    res.json(user).status(200);
});

/**
 * 
 * @param {*} req //this route get users by id ..i.e getting one user instead of getting all users 
 * @param {*} res //we  respond the user if the id passed in by the user matches the id in the database.
 */
 export const getUsersById = asyncHandler(async(req, res) => {
        const { _id, name, email } = await User.findById(req.user._id);
        console.log(req.user._id)
        res.json({
            id: _id,
            name: name,
            email: email,
        })
});
/**
 * 
 * @param {*} req this function enable the clients make request to signup and  the function first check if the user already exist if it does it will return this user already exist.
 * @param {*} res then respond depending if the user exist will respond "user with  email already exist" 
 * @returns else it will create a new user and responed "User created" and then save....
 */
 export const registerUsers =  asyncHandler(async(req, res) =>{
    const { name, email, password} = req.body;
        if(!name || !email || !password){
            res.status(400)
            throw new Error("Please fill all form fields");
        };
        
        //In this line of code we check to know if the admin already exist
        const userExist = await User.findOne({email});
            if(userExist){
                res.status(400)
                throw new Error("User alreay exist")
            };
        
        //hashing password........................
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating as new user... with the value each user should have or submit.....
        const user = await  User.create({ 
            name, 
            email, 
            password: hashedPassword
        });
            if(user){
                res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generatToken(user.id),
             })
        }  
});

/**
 * 
 * @param {*} req This will take the request of password and email.
 * @param {*} res this respond to the user an invalid user if the email and password provided by the user is invalid and return users information if email and password in correct 
 * @returns we return "incorrect form submission" if the user does not fill in any information in the email n password filled
 */
 export  const signInUsers = asyncHandler(async(req, res) => {
    const {email, password } = req.body;
        if(!email || !password){
            return res.status(400).json('Incorrect form submission');
         }
         const user = await User.findOne({email});
            if(!user){
                res.status(404)
                throw new Error(" Not found !");
         }

        let validPassword =  await bcrypt.compare(password, user.password)
            if(!validPassword){
                res.status(400)
                throw new Error(" failed ");
            }
            res.json({
                _id: user.id, 
                email: user.email,
                token: generatToken(user.id),
             });
});

/**
 * 
 * @param {*} req in this function, we request user by "id" and perform a delete action 
 * @param {*} res we respond the status of the delete action to the user if ther exsist a user.
 */
 export const deleteUsers = asyncHandler(async(req, res) => {
    const { id } = req.params
    await User.deleteOne({id: id})
        if(id){
            res.send("Deleted successfully");
    }
        else{
            res.send("No user to delete");
    }
});

/**
 * 
 * @param {*} req we request a user for update 
 * @param {*} res respond the status of the update 
 */
 export const updateUsers = asyncHandler(async(req, res) =>{
    const { id } = req.params;
    const {name, email, password} = req.body;
    const user = await User.findById({_id : id })
        if(!user){
            res.status(404);
            throw new Error(" No User Found ! ")
        }
            user.name = name || user.name;
            user.email = email || user.email;
            user.password = password || user.password;
            
            await user.save()
            res.send(user);
    
});

//Jwt token generator..........
export const generatToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}




// @desc  Post posts
// @routes POST /posts
// @access public
export const changeAvatar = asyncHandler(async (req, res) => {

    const { files } = req.files;
    const ext = files.name.substring(files.name.length - 4, files.name.length);
    const filename = req.user._id + new Date().getTime() + ext;
    if (!files) return res.sendStatus(400);
    const __dirname = path.resolve();
    files.mv(path.join(__dirname, 'public/avatars/' + filename));
    
    const userData = await User.findById(req.user._id);
    userData.avatar = filename;
    userData.save();

    res.status(200).json({ success: true, avatar: filename });
});

// @desc  Post posts
// @routes POST /posts
// @access public
export const changeUsername = asyncHandler(async (req, res) => {

    const name = req.body.username;
    let results = await User.updateOne({ _id: req.body.id }, { name }).exec();
    
    res.status(200).json({ success: true, username: name });
});
