import mongoose from "mongoose";

const promoSchema = mongoose.Schema(

    {
        //we are linking users and admin to products to know which user picks which products
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        content: {
            type: String, required: true
        },
        status: { type: String, required: true },
        image: { type: String },
        showTag: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
)

const Promo = mongoose.model("Promo", promoSchema);
export default Promo;