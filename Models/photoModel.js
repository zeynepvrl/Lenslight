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
    },                                                                                                        //bunu zaten photoCreate de belirteceğiz <=
    user:{                           //her fotoğraf hangi user a ait olduğuna dair bilgi taşıyacak  , üstteki 3 bilgiyi fotoğrafın oluşturulduğu formdan olacağız ama user bilgisini req.locals.user dan alacağız, tokenı decode edip buraya user ı yerleştirmiştik zaten
        type:Schema.Types.ObjectId,
        ref:'User'                  //User modelini referans gösterdik
    }
})

const Photo = mongoose.model("Photo", photoSchema)        //photoM adında modeli oluşturur, photoSchemayı kullanrak, Photo adında

export default Photo