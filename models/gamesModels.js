import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    image: { type: String },
    url : { type: String },
},
    {timestamps: true},
)


const Games = mongoose.model("Games", gameSchema);
export default Games;