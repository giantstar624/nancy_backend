import mongoose from "mongoose";

const messageSchema = mongoose.Schema(

    {
        //we are linking users and admin t o products to know which user picks which products
        //we are linking users and admin to products to know which user picks which products
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        isnew: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
        },
        messageList: [
            {
                from: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                to: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                message: {
                    type: String,
                },
                caption: {
                    type: String,
                },
                replyTo: {
                    type: Object
                },
                senderName: {
                    type: String,
                },
                type: {
                    type: String,
                    default: "Text",
                },
                date: {
                    type: Date,
                }
            }
        ]
    },
    {
        timestamps: true
    }
)
const Message = mongoose.model("Message", messageSchema);
export default Message;

