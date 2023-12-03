import Photo from "../Models/photoModel.js";

const createPhoto = async (req, res) => {                      /*  satır 4 de req.body den gelen bilgilerle veri tabanında Photo modelini kullanrak üretim yaptı => bunlardan sonra üretileni geri reponse etmesi lazım 5. satırdı- fotoğrafı yükledikten sonra görmemiz gibi*/

    try {
        await Photo.create({                                 /* req.body şeklinde yazıp kontrol edecek templateimiz henüz hazır olmadı için: thunderClient kullanabiliriz */
        name:req.body.name,
        description:req.body.description,
        user:res.locals.user._id                             /* Kullanıcı oturum açtığında veya kimlik doğrulama gerçekleştiğinde, kullanıcı bilgileri genellikle bir oturum nesnesine kaydedilir ve bu oturum nesnesi res.locals veya başka bir ortam değişkeni aracılığıyla paylaşılır. */
        })                      
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
        const photos= await Photo.find({})    //find in parantezleri boş çünkü hepsini getirecek
        res.status(200).render("photos.ejs" , {  // response olarak photos.ejs yi render at ama bu template e aynı zamanda veri tabanından oluşturdupun photos u da gönder, bu photos u photos.ejs de karşılamak gerek
            succeded:true,
            photos,
            link:'photos'                   //link ler _menu.ejs deki active classının kimde olacağını belirlemek için
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
        const photo= await Photo.findById({_id:req.params.id})     //_id mongo db deki dokümanlardaki _id, diğeri ise req deki parametrelerdeki id değeri
        res.status(200).render('photo.ejs', {
            succeded:true,
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