import Review from '../models/reviewModels.js';

const reviewController = {
    create: async (req, res) => {
        if (req.body.title.length === 0 || req.body.content.length === 0) {
            res.status(400).json({ msg: 'Bad Request', success: false });
        }

        const review = new Review({
            ...req.body,
            user: req.user.id,
            status: 'pending'
        });
        review.save();
        res.status(200).json({ success: true });
    },
    getAll: async (req, res) => {
        let reviews = await Review.find({ status: 'active' }).populate('user', ['name', 'avatar']).sort({ createdAt: -1 }).skip(parseInt(req.query.page) * 3).limit(3);
        res.status(200).json({ success: true, reviews });
    }
}

export default reviewController;