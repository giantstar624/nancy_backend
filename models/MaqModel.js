import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({
    text: { 
        type: String ,
        default: "👍 Welcome to Lucy's game.", 
        required: true
    },
},
    {timestamps: true},
)


const Maq = mongoose.model("Maq", mapSchema);
export default Maq;