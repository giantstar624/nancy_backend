import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        name: {type: String, required: true, minlength: 3, maxlength:200},
        phone: {type: String, minlength: 6, maxlength:20},
        email: {type: String, required: true, minlength: 6, maxlength:200, unique: true},
        avatar: {type: String, default:""},
        password: {type: String, minlength: 6, maxlength: 1024},
        role: { type: Number, default: 0 },
        verify: { type: Boolean, default: false },
        status: {type: String, default:"active"},
    },
    { timestamps: true},
);

userSchema.index( { name: "text", email: "text", status:"text" } );

const User = mongoose.model("User", userSchema);

export default User;
