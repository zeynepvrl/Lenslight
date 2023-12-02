import express from 'express';
import conn from "./db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";  //npm install cokkie-parser. Express.js uygulamalarında çerezleri (cookies) işlemek ve oluşturmak için kullanılan bir Node.js modülüdür. Çerezler, web tarayıcıları ile sunucu arasında küçük bilgi parçalarını depolamak için kullanılan veri yapılardır. biz jsonwebtoken ı cookie ye kaydetmek için kullancağız bu paketi
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import { checkUser } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

conn();

//static files middleware
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))  //register daki form body sinin içindeki bilgileri parse edebilmesi için, okuyabilmesi için
app.use(cookieParser());     //import ettiğimizi burda çalıştırıyoruz

app.set('view engine', 'ejs')




//route
app.get('*', checkUser)   //* ın anlamı bütün get işlemlerinde check et user ı
app.use('/' , pageRoute);
app.use('/photos' , photoRoute)
app.use('/users', userRoute)            //sadece localhost yazarsa ilkine gidecek, home pagedeyken register a tıklarsan register sayfasına gidecek burdayken formu doldurup 
                                       // gönderirsen user/register adresine 

/* app.get('/', (req, res) => {
    res.render("index")
})
app.get('/about', (req, res) => {
    res.render("about")
}) */

app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
})