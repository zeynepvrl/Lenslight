import mongoose from "mongoose";
import { Schema } from "mongoose";

const photoSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
})

const Photo = mongoose.model("Photo", photoSchema)        //photoM adında modeli oluşturur, photoSchemayı kullanrak, Photo adında

export default Photo