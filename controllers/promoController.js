import Promo from '../models/promoModels.js';

const promoController = {
    getAll: async (req, res) => {
        let promos = await Promo.find({ status: 'show' }).populate('user', ['name']).sort({ createdAt: -1 }).skip(parseInt(req.query.page) * 3).limit(3);
        res.status(200).json({ success: true, promos });
    }
}

export default promoController;
