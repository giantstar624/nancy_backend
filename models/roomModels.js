import mongoose from "mongoose";

const roomSchema = mongoose.Schema(

    {
        //we are linking users and admin to products to know which user picks which products
        isNewUser: { type: Boolean, required: true },
        Name: { type: String },
        Email: { type: String },
        Phone: { type: String },
        roomID: { type: String }
    },
    {
        timestamps: true
    }
)

const Room = mongoose.model("Room", roomSchema);
export default Room;
