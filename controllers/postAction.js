import asyncHandler from 'express-async-handler';
import path from 'path';
import Post from '../models/postsModels.js';


// @desc  Get posts
// @routes GET /posts
// @access private
export const getPost = asyncHandler(async (req, res) => {
    const post = await Post.find({ status: 'active' }).populate('user', ['name', 'email', 'avatar']).sort({ createdAt: -1 }).skip(parseInt(req.query.page) * 3).limit(3)
    res.json({ success: true, post }).status(200);
});

// @desc  Update posts
// @routes PUT /post
// @access private
export const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(400);
        throw new Error("post not found");
    }
    const admin = await admin.findById(req.admin.id);
    //check for admin.........
    if (!admin) {
        res.status(404);
        throw new Error("Admin Not Found");
    }
    //make sure only the logged in admin matches the goal admin...............
    if (post.admin.toString() !== admin.id) {
        res.status(401)
        throw new Error("Admin not Authorized");
    };
    //the "new true" created, is to create a new post if we dont find any...
    const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatePost);
});

// @desc  Post posts
// @routes POST /posts
// @access public
export const postPost = asyncHandler(async (req, res) => {

    const { files } = req.files;
    const ext = files.name.substring(files.name.length - 4, files.name.length);
    const filename = req.user.id + new Date().getTime() + ext;
    if (!files) return res.sendStatus(400);
    const __dirname = path.resolve();
    files.mv(path.join(__dirname, 'public/postImg/' + filename));

    const post = new Post({
        user: req.user.id,
        status: 'pending',
        content: req.body.content,
        image: filename
    });

    post.save();

    res.status(200).json({ success: true });
});

// @desc  Delete posts
// @routes DELETE /posts/:id
// @access private
export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(400);
        throw new Error(" Post not found !");
    }
    const admin = await admin.findById(req.admin.id);
    //check for admin.........
    if (!admin) {
        res.status(404);
        throw new Error("Admin Not Found");
    }
    //make sure only the logged in admin matches the goal admin...............
    if (post.admin.toString() !== admin.id) {
        res.status(401)
        throw new Error("Admin not Authorized");
    };
    await post.remove();
    res.status(200).json({ id: req.params.id });
});

// @desc  PUT comment
// @routes PUT /posts/:id
// @access public
export const replyPost = asyncHandler(async (req, res) => {

    var comment = [];
    comment = req.body.post.comment ? req.body.post.comment : [];
    comment.push({
        user: req.user.name,
        content: req.body.reply
    });
    const results = await Post.updateOne({ _id: req.body.post._id }, { comment });
    if (results.modifiedCount > 0) {
        res.status(200).json({ success: true, user: req.user.name });
    } else res.status(200).json({ success: false });

});