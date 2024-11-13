import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, required: true},
    size: {type: Number, required: true},
    mimeType: {type: String, required: true},
})

export default mongoose.model('MongoFile', fileSchema);