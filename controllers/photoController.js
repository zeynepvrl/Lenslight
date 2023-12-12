import Photo from "../Models/photoModel.js";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"                                 //node.js ın içerisinde bulunan bir modül, cloudinary e fotoğrafları yüklerken tmp dosyasında biriken leri temizlemek için kullanacağız

const createPhoto = async (req, res) => {                      /*  satır 4 de req.body den gelen bilgilerle veri tabanında Photo modelini kullanrak üretim yaptı => bunlardan sonra üretileni geri reponse etmesi lazım 5. satırdı- fotoğrafı yükledikten sonra görmemiz gibi*/
   
    const result= await cloudinary.uploader.upload(     //burdaki image dashboard.ejs deki resmi yüklediğimiz formdan gelecek, type ı file şuan , name ine image yazmamız gerekiyor
        req.files.image.tempFilePath,                    //oluşturduğum göreselin geçiçi path i  Bu ifade, express-fileupload middleware'i ile yüklenen dosyanın geçici olarak diskte saklandığı yolunu temsil eder
        {
            use_filename:true,                          //Cloudinary'ye yüklenen dosyanın adının, yerel dosyanın adına eşit olmasını sağlar
            folder:"lenslight"                          // Cloudinary'de dosyanın saklanacağı klasörü belirtir
        }
    )//cloudinary de yüklenen görseli oluşturuyor, yukardaki bilgileri kullanarak. result ın içinde secure_url var bu url ile görsele clodinaryden erişebileceğiz, photoModel de bu url için yeni bir özellik ekliyoruz ve aşağıda create de bunu burdaki resultın içinden atıyoruz ona

    try {
        await Photo.create({                                 /* req.body şeklinde yazıp kontrol edecek templateimiz henüz hazır olmadı için: thunderClient kullanabiliriz */
        name:req.body.name,
        description:req.body.description,
        user:res.locals.user._id,                             /* Kullanıcı oturum açtığında veya kimlik doğrulama gerçekleştiğinde, kullanıcı bilgileri genellikle bir oturum nesnesine kaydedilir ve bu oturum nesnesi res.locals veya başka bir ortam değişkeni aracılığıyla paylaşılır. */
        url:result.secure_url                                 //url i artık clodinary den alıyor ama sayfada bastırırken de doğru alabilmesi için template lerdeki linkleri de bunlara uygun yapman gerekir, statik olmamalı
        })           
         
        fs.unlinkSync(req.files.image.tempFilePath)
        
        res.status(201).redirect("/users/dashboard")
    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}
//asenkron fonsksiyon yapmamızın sebebi database de oluşturma işlemi bitmeden devam etmesiydi ve response olarak photo nun dolayısı şle boş gelmesiydi


const getAllPhotos= async (req,res)=>{
    try {
        const photos= res.locals.user                              //eğer giriş yapmış bir kullanıcı varsa(yani res.locals.user varsa) :dan öncesi, yoksa :dan sonrası
        ? await Photo.find({user : {$ne: res.locals.user._id}})    //find in parantezleri boş çünkü hepsini getirecek
        : await Photo.find({})

        res.status(200).render("photos" , {                                // response olarak photos.ejs yi render at ama bu template e aynı zamanda veri tabanından oluşturdupun photos u da gönder, bu photos u photos.ejs de karşılamak gerek
            photos,
            link:'photos'                                                     //link ler _menu.ejs deki active classının kimde olacağını belirlemek için
        })  
        

    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
}
    

const getSelectedPhoto= async(req,res)=>{
    try {
        const photo= await Photo.findById({_id:req.params.id}).populate("user")     //_id mongo db deki dokümanlardaki _id, diğeri ise req deki parametrelerdeki id değeri
        res.status(200).render('photo.ejs', {                                       //populate işlemi photo.ejs deki photo.user.name deki user ı görmesi için
            succeded:true,                                                                  // photo ile user araında bir bağlantı var ve ben photo üzerinden user ı kullabilirim demek
            photo,
            link: 'photos'
        })
    } catch (err) {
        res.status(500).json({
            succeded:false,
            err
        })
    }
}

export { createPhoto, getAllPhotos, getSelectedPhoto }


/* fs Modülü: Node.js'in dosya sistemi işlemlerini gerçekleştirmek için kullanılan bir modüldür.
 fs modülü, dosyaları oluşturma, okuma, yazma, güncelleme, silme gibi temel dosya işlemlerini sağlar.

unlinkSync Metodu: Bu metot, belirtilen dosyayı senkron bir şekilde siler. Senkron olması, dosyanın silinene kadar diğer
 işlemlerin beklemesi anlamına gelir. Eğer işlem başarıyla gerçekleşirse herhangi bir değer döndürmez, hata oluşursa bir hata fırlatır.

req.files.image.tempFilePath: Bu ifade, express-fileupload veya benzeri bir dosya yükleme kütüphanesi 
ile işlenmiş bir HTTP isteğinin içindeki dosyanın geçici olarak saklandığı diskteki yol (path)'i temsil eder.
 Bu yol, dosyanın geçici olarak saklandığı yerdir ve genellikle dosyanın işlendikten sonra temizlenmesi gereken bir konumdur. */