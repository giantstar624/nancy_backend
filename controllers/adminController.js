import path from 'path';

import Post from '../models/postsModels.js';
import Review from '../models/reviewModels.js';
import Promo from '../models/promoModels.js';
import User from '../models/userModels.js';
import Message from '../models/messageModels.js';
import Validator from 'validator';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModels.js';
import Maq from '../models/MaqModel.js';

const AdminController = {

    getCustomers: async (req, res) => {
        let { page, row, search } = req.query;
        try {
            let results = await User.find({ $or: [{ name: { $regex: search } }, { email: { $regex: search } }], role: 0 }).sort({ createdAt: -1 }).skip(parseInt(page) * parseInt(row)).limit(parseInt(row));
            let total = await User.find({ $or: [{ name: { $regex: search } }, { email: { $regex: search } }], role: 0 }).countDocuments();
            res.status(200).json({ success: true, users: results, total });
        } catch (error) {
            console.log(error);
        }
    },

    getPosts: async (req, res) => {
        let { page, row } = req.query;
        try {
            let results = await Post.find().populate('user', ['name', 'email']).sort({ createdAt: -1 }).skip(parseInt(page) * parseInt(row)).limit(parseInt(row));
            let total = await Post.find().countDocuments();
            res.status(200).json({ success: true, posts: results, total });
        } catch (error) {
            console.log(error);
        }
    },
    updateStatus: async (req, res) => {

        let status = req.body.tmp;
        let results = await Post.updateOne({ _id: req.body.id }, { status }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true })
        } else res.status(200).json({ success: false })
    },
    deletePost: async (req, res) => {
        console.log("deleting post...");
        await Post.deleteOne({ _id: req.body.id });
        res.status(200).json({ success: true });
    },
    getReviews: async (req, res) => {
        let { page, row } = req.query;
        console.log("get Reviews!!!");
        try {
            let results = await Review.find().populate('user', ['name', 'email']).sort({ createdAt: -1 }).skip(parseInt(page) * parseInt(row)).limit(parseInt(row));
            let total = await Review.find().countDocuments();
            res.status(200).json({ success: true, posts: results, total });
        } catch (error) {
            console.log(error);
        }
    },
    updateReviewStatus: async (req, res) => {
        let status = req.body.tmp;
        let results = await Review.updateOne({ _id: req.body.id }, { status }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true })
        } else res.status(200).json({ success: false })
    },
    onReply: async (req, res) => {
        let results = await Review.updateOne(
            { _id: req.body.id },
            {
                reply: { replier: req.user.id, content: req.body.reply, createdAt: new Date() }
            }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true })
        } else res.status(200).json({ success: false })
    },
    deleteReview: async (req, res) => {
        console.log("deleting review...");
        await Review.deleteOne({ _id: req.body.id });
        res.status(200).json({ success: true });
    },
    createPromo: async (req, res) => {
        const { file } = req.files;
        const ext = file.name.substring(file.name.length - 4, file.name.length);
        const filename = req.user.id + new Date().getTime() + ext;
        if (!file) return res.sendStatus(400);
        const __dirname = path.resolve();
        file.mv(path.join(__dirname, 'public/promoImg/' + filename));

        const promo = new Promo({
            user: req.user.id,
            status: 'hide',
            content: req.body.content,
            image: filename,
            showTag: false
        });

        promo.save();

        res.status(200).json({ success: true });
    },
    getPromos: async (req, res) => {
        let { page, row } = req.query;
        let promos = await Promo.find().populate('user', ['name']).sort({ createdAt: -1 }).skip(parseInt(page) * parseInt(row)).limit(parseInt(row));
        let total = await Promo.find().countDocuments();
        res.status(200).json({ success: true, promos, total });
    },
    actionPromo: async (req, res) => {
        let status = req.body.tmp;
        let results = await Promo.updateOne({ _id: req.body.id }, { status }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true })
        } else res.status(200).json({ success: false })
    },
    setPromoTag: async (req, res) => {
        let showTag = req.body.tmp;
        let results = await Promo.updateOne({ _id: req.body.id }, { showTag }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true })
        } else res.status(200).json({ success: false })
    },
    deletePromo: async (req, res) => {
        console.log("deleting promo...");
        await Promo.deleteOne({ _id: req.body.id });
        res.status(200).json({ success: true });
    },
    blockUser: async (req, res) => {
        console.log("block user...");
        await User.updateOne({ _id: req.body.id }, { status: "blocked" });
        res.status(200).json({ success: true });
    },

    activeUser: async (req, res) => {
        console.log("unblock user...");
        await User.updateOne({ _id: req.body.id }, { status: "active" });
        res.status(200).json({ success: true });
    },

    deleteUser: async (req, res) => {
        console.log("delete user...");
        await User.deleteOne({ _id: req.body.id });
        res.status(200).json({ success: true });
    },

    addChat: async (req, res) => {
        console.log("add chat user...");
        const chatUser = await Message.findOne({ user: req.body.id });
        let newMessage;
        if (!chatUser) {
            newMessage = await Message.create({
                user: req.body.id,
                messageList: []
            });
            await newMessage.save();
            console.log("new message created");
            res.status(200).json({ success: true, id: newMessage._id });

        } else {
            console.log("message is already created");
            res.status(200).json({ success: true, id: req.body.id });
        }
    },

    getSupports: async (req, res) => {
        let { page, row } = req.query;
        try {
            let results = await User.find({ role: 2 }).sort({ createdAt: -1 }).skip(parseInt(page) * parseInt(row)).limit(parseInt(row));
            let total = await User.find({ role: 2 }).countDocuments();
            res.status(200).json({ success: true, users: results, total });
        } catch (error) {
            console.log(error);
        }
    },

    deleteSupports: async (req, res) => {
        console.log("deleting support...");
        await User.deleteOne({ _id: req.body.id });
        res.status(200).json({ msg: 'An agent is removed successfully!', success: true });
    },
    registerSupports: async (req, res) => {
        console.log("register support...");
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            console.error("Please fill all fields");
            return res.status(200).json({ msg: 'Incorrect form data!', success: false });
        }

        if (!Validator.isEmail(email)) {
            return res.status(200).json({ msg: 'Invalid email!', success: false });
        }

        if (password.length < 6 || password.length > 30) {
            console.error("Please fill all fields");
            return res.status(200).json({ msg: 'Password must be at least 6 letters and max 30 letters!', success: false });
        }

        if (name.length == 0) {
            console.error("Please fill all fields");
            return res.status(200).json({ msg: 'Please insert name!', success: false });
        }

        const isExistMail = await User.findOne({ email });
        const isExist = await User.findOne({ name });

        if (isExistMail) {
            res.status(200).json({ msg: 'Email already exists !', success: false });
            console.error("User mail already exists !");
        } else if (isExist) {
            res.status(200).json({ msg: 'Username already exists !', success: false });
            console.error("User name already exists !");
        } else {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            const user = new User({
                firstname: "sungames",
                lastname: "support",
                name: name,
                email: email,
                role: 2,
                verify: true,
                password: hash
            });
            user.save();

            res.status(200).json({ success: true, msg: 'An agent is registered successfully!' });
        }
    },


    getBanners: async (req, res) => {
        try {
            let results = await Admin.find();
            if (!results) results = [];

            res.status(200).json({ success: true, banners: results });
        } catch (error) {
            console.log(error);
        }
    },

    updateBanner: async (req, res) => {
        let { id } = req.body;
        const { file } = req.files;

        try {

            const ext = file.name.substring(file.name.length - 4, file.name.length);
            const filename = req.user.id + new Date().getTime() + ext;
            if (!file) return res.sendStatus(400);
            const __dirname = path.resolve();
            file.mv(path.join(__dirname, 'public/banner/' + filename));

            let results = await Admin.updateOne({ _id: req.body.id }, { url: filename }).exec();

            if (results.modifiedCount > 0) {
                res.status(200).json({ success: true, url: filename, id: id })
            } else res.status(200).json({ success: false })

        } catch (error) {
            console.log(error);
        }
    },

    createBanner: async (req, res) => {
        const { file } = req.files;

        const ext = file.name.substring(file.name.length - 4, file.name.length);
        const filename = req.user.id + new Date().getTime() + ext;
        if (!file) return res.sendStatus(400);
        const __dirname = path.resolve();
        file.mv(path.join(__dirname, 'public/banner/' + filename));

        const admin = new Admin({
            url: filename
        });

        admin.save();

        res.status(200).json({ success: true, _id: admin._id, url: filename });
    },

    deleteBanner: async (req, res) => {

        await Admin.deleteOne({ _id: req.body.id });
        res.status(200).json({ success: true });
    },

    getMaq: async (req, res) => {
        try {
            let results = await Maq.find().limit(1);
            res.status(200).json({ success: true, maq: results });
        } catch (error) {
            console.log(error);
        }
    },

    changeMaqText: async (req, res) => {

        const { text, id } = req.body;

        const checkMaq = Maq.findOne({ _id: id });

        console.log(id);
        console.log(checkMaq);

        let maq = null;
        if (!checkMaq || id == undefined) {
            maq = new Maq({
                text: text
            });

            maq.save();
        } else {
            await Maq.updateOne({ _id: id }, { text });
            maq = {
                id: id,
                text: text,
            }
        }

        res.status(200).json({ success: true, maq: maq });
    },

}

export default AdminController;
