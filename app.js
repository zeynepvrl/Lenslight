import express from 'express';
import conn from "./db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";                //npm install cokkie-parser. Express.js uygulamalarında çerezleri (cookies) işlemek ve oluşturmak için kullanılan bir Node.js modülüdür. Çerezler, web tarayıcıları ile sunucu arasında küçük bilgi parçalarını depolamak için kullanılan veri yapılardır. biz jsonwebtoken ı cookie ye kaydetmek için kullancağız bu paketi
import methodOverride from 'method-override';            //Express uygulamalarında HTTP taleplerindeki _method parametresini kullanarak farklı HTTP yöntemlerini taklit etmeyi sağlayan bir middleware'dir. genellikle HTML formları üzerinden DELETE ve PUT gibi HTTP yöntemlerini kullanmak isteyen durumlar için kullanılır. Çünkü HTML formu sadece GET ve POST yöntemlerini doğrudan destekler.
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import { checkUser } from './middlewares/authMiddleware.js';
import fileUpload from 'express-fileupload';                      //npm install express-fileupload 
import {v2 as cloudinary} from "cloudinary"                   //v2 versiyonunu import ettik ama bunu cloudinary adıyla kullanabilmek için as ile import ettik

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

//connection to DB
conn();

const app = express();
const port = process.env.PORT;

//ejs template engine
app.set('view engine', 'ejs')

//static files middleware                       app.use  Express uygulamasına bir middleware eklemek için kullanılır.
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))      //register daki form body sinin içindeki bilgileri parse edebilmesi için, okuyabilmesi için
app.use(cookieParser());                          //import ettiğimizi burda çalıştırıyoruz
app.use(fileUpload({useTempFiles:true}))          //explorer daki temp dosyasını kullanması:true   // Dosya yükleme middleware'ini kullanma ve geçici dosyaların kullanılmasını etkinleştirme
app.use(methodOverride('_method',{                //_method': Bu, middleware'ın hangi parametreyi kontrol edeceğini belirtir. Yani, gelen taleplerde hangi parametrenin HTTP yöntemini belirlemek için kullanılacağını gösterir.
  methods:['POST','GET'],                         //methods: Bu, hangi HTTP yöntemlerinin değiştirilebileceğini belirten bir dizi. Yani, _method parametresinin alabileceği değerleri belirtir. Bu örnekte, sadece 'POST' ve 'GET' yöntemleri geçerlidir.
}))                          //şimdi user.ejs de PUT isteği olduğunu belirtebiliriz




//route
app.use("*", checkUser)                 //app.get('*', checkUser)   //* ın anlamı bütün get işlemlerinde check et user ı, use ile değiştirdik çünkü hem get hem post da check etmeliydi çünkü dashboard da createPhoto yu kullanırken post isteiği oluyor ve fotoğrafa oluşturan userın id sini atamak gerekiyor
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


/* Bir web sitesinde fotoğraf yüklemek ve çekmek için genel bir akış şu şekilde olabilir:

Fotoğraf Yükleme:

Kullanıcı, bir web formu aracılığıyla veya başka bir yöntemle fotoğraf yükler.
Sunucu, bu fotoğrafı bir dosya depolama sistemine kaydeder (örneğin, diskte bir klasöre veya bulut depolama servisine).
Veritabanına Kaydetme:

MongoDB gibi bir veritabanında, bu fotoğrafın bilgilerini (örneğin, dosya yolu, adı, boyutu) içeren bir belge oluşturulur.
Bu belge, genellikle bir koleksiyona eklenir.
Fotoğrafı Çekme:

Kullanıcı, fotoğrafı görmek istediğinde veya bir sayfada görüntülemek istediğinde, sunucu, veritabanından gelen bilgileri kullanarak ilgili dosyayı bulur.
Dosyanın yolunu kullanarak veya bir bulut depolama hizmetinden alarak, kullanıcıya gösterilir. */


/* express-fileupload middleware'inin { useTempFiles: true } seçeneği, dosyaların bellekte değil de diskte geçici bir dosya olarak saklanmasını sağlar.
 Bu, özellikle büyük dosyaların belleği aşırı derecede yormasını önlemek ve uygulama performansını artırmak için kullanılır.
 yükleme işleminin ayrıntılı adımları:

 // Dosya yükleme middleware'ini kullanma ve geçici dosyaların kullanılmasını etkinleştirme
app.use(fileUpload({ useTempFiles: true }));

Dosyanın İstemciden Alınması:
// İstemciden gelen dosyayı yakalama
  const uploadedFile = req.files.file;
req.files nesnesi içindeki dosya bilgilerine, file ismini kullanarak erişebilirsiniz.

Geçici Dosya Yoluna Erişim:
  uploadedFile.tempFilePath);
Bu adım, geçici dosyanın diskte saklandığı yol. Bu yolu, geçici dosyanın nerede saklandığını kontrol
etmek ve gerektiğinde bu dosyayı manipüle etmek için kullanabilirsiniz.


 */