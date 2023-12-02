import  express  from "express";
import * as PhotoController from "../controllers/photoController.js"

const router=express.Router();

router.route("/").post(PhotoController.createPhoto).get(PhotoController.getAllPhotos)   //post isteği ilk parantezin içeriğine yönlenririr, get isteği geldiğinde ikincisine
router.route("/:id").get(PhotoController.getSelectedPhoto)                 //photos.ejs deki /photo/photo.id linkine tıklanınca burası çalışacak

export default router