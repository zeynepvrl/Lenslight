import express from "express";
import * as userController from "../controllers/userController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();

router.route('/register').post(userController.userCreate)          // localhost... user/router adrese post isteği gidecek       Bu adres register.ejs deki formun action işleminde çalışacak
router.route("/login").post(userController.userLogin)               //login.ejs deki username password olan formun actionu
router.route('/dashboard').get(authMiddleware.authenticateToken,  userController.getDashboardPage)
router.route("/").get(authMiddleware.authenticateToken, userController.getAllUsers)
router.route("/:id").get(authMiddleware.authenticateToken, userController.getSelectedUser)
router.route("/:id/follow").put(authMiddleware.authenticateToken,userController.follow)         //findByIdandUpdate var olanı değiştirdiğimiz için vs put 
router.route("/:id/unfollow").put(authMiddleware.authenticateToken,userController.unfollow)     //PUT isteğini tarayıcı yardımıyla göndermek için: npm i method-override , ile indirip app.js de import edip configıre etmeliyiz, sonra user.ejs de ilgili butona put isteği olduğunu linklerken belirteceğiz

export default router                                        