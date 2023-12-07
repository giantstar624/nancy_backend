import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(

    {
        //we are linking users and admin to products to know which user picks which products
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        title: {
            type: String, required: true
        },
        content: {
            type: String, required: true
        },
        status: { type: String, required: true },
        reply: {
            content: { type: String },
            replier: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            createdAt: Date
        }
    },
    {
        timestamps: true
    }
)

const Review = mongoose.model("Review", reviewSchema);
export default Review;