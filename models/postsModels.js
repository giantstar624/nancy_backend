import mongoose from "mongoose";

const postSchema = mongoose.Schema(

    {
        //we are linking users and admin to products to know which user picks which products
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        image: {
            type: String
        },
        status: {
            type: String
        },
        content: { type: String, required: true },
        comment: { type: Array }
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema);
export default Post;