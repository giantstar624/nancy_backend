import asyncHandler from 'express-async-handler';
import path from 'path';
import Games from '../models/gamesModels.js';

// @desc  Get posts
// @routes GET /posts
// @access private
export const getGames = asyncHandler(async (req, res) => {
    const games = await Games.find();
    res.json({ success: true, games }).status(200);
});

export const updateIcon = asyncHandler(async (req, res) =>  {
    let { id } = req.body;
    const { file } = req.files;

    try {

        const ext = file.name.substring(file.name.length - 4, file.name.length);
        const filename = req.user.id + new Date().getTime() + ext;
        if (!file) return res.sendStatus(400);
        const __dirname = path.resolve();
        file.mv(path.join(__dirname, 'public/games/' + filename));

        let results = await Games.updateOne({ _id: req.body.id }, { image:filename }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true, image:filename, id:id })
        } else res.status(200).json({ success: false })

    } catch (error) {
        console.log(error);
    }
});

export const updateUrl = asyncHandler(async (req, res) =>  {
    let { id, url } = req.body;

    try {

        let results = await Games.updateOne({ _id: req.body.id }, { url:url }).exec();

        if (results.modifiedCount > 0) {
            res.status(200).json({ success: true, url:url, id:id })
        } else res.status(200).json({ success: false })

    } catch (error) {
        console.log(error);
    }
});

// @desc  Post posts
// @routes POST /posts
// @access public
export const postGame = asyncHandler(async (req, res) => {

    const { file } = req.files;
    
    const ext = file.name.substring(file.name.length - 4, file.name.length);
    const filename = req.user.id + new Date().getTime() + ext;
    if (!file) return res.sendStatus(400);
    const __dirname = path.resolve();
    file.mv(path.join(__dirname, 'public/games/' + filename));

    const game = new Games({
        url: req.body.url,
        image: filename
    });

    game.save();

    res.status(200).json({ success: true, image:filename, url:req.body.url });
});

// @desc  Delete posts
// @routes DELETE /posts/:id
// @access private
export const deleteGame = asyncHandler(async (req, res) => {
    const game = await Games.findById(req.body.id);
    console.log(game);
    if (!game) {
        res.status(400);
        throw new Error(" Post not found !");
    }
    await game.remove();
    res.status(200).json({ id: req.params.id });
});
