import Message from '../models/messageModels.js';
import path from 'path';

const reviewController = {
    getHistory: async (req, res) => {
        
        let history = [];

        // console.log(req.user.id);

        if(req.user.role==0) {
            const userData = await Message.findOne({user: req.user.id});
            // console.log(userData);
            if(userData) {
                history = userData.messageList;
            }
        } else {
            const userData = await Message.findOne({user: req.body.roomId});
            if(userData) {
                history = userData.messageList;
            }
        }

        res.status(200).json({ history });
    },

    getUsers: async (req, res) => {
        const users = await Message.find().select('-messageList').populate('user', ['name', 'email', 'avatar', 'firstname', 'lastname']);
        res.status(200).json({ users });
    },

    sendImage: async (req, res) => {

        const { files } = req.files;
        const ext = files.name.substring(files.name.length - 4, files.name.length);
        const filename = req.user._id + new Date().getTime() + ext;
        if (!files) return res.sendStatus(400);
        const __dirname = path.resolve();
        files.mv(path.join(__dirname, 'public/chat/' + filename));
    
        res.status(200).json({ success: true, image: filename });
    },

    deleteChat: async (req, res) => {

        await Message.deleteOne({user:req.body.roomId});
        res.status(200).json({ success: true, roomId: req.body.roomId });
    },
}

export default reviewController;