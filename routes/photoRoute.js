import  express  from "express";
import * as PhotoController from "../controllers/photoController.js"

const router=express.Router();

router.route("/").post(PhotoController.createPhoto).get(PhotoController.getAllPhotos)   //post isteği ilk parantezin içeriğine yönlenririr, get isteği geldiğinde ikincisine

export default router