import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, default: null},
    size: {type: Number, default: null},
    mimeType: {type: String, default: null},
    directory: {type: String, required: true},
    isFile: {type: Boolean, required: true},
});

export default mongoose.model('MongoFile', fileSchema);