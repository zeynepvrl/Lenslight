import userModel from "../Models/userModel.js"
import bcrypt from "bcrypt"                          //npm install bcrypt        şifrelerin veri tabanında doğrudan görünmemesi için 
import jwt from "jsonwebtoken";                    //npm install jsonwebtoken   kullanıcı authorization için
import Photo from "../Models/photoModel.js";
import User from "../Models/userModel.js";

const userCreate = async (req, res) => {
    try {
        const User = await userModel.create(req.body)
        res.redirect('/login')
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


const userLogin = async (req, res) => {
    try {
        const { name, password } = req.body                    //burdaki requestten gelen name ile formlardaki(register login dashboard .ejs) name  ve userModel deki Schema daki name ismi aynı olmalıdır
        const user = await userModel.findOne({ name })       //modeldeki name burdaki req.body den aldığımız username e eşit olan= user a atanacak, burdaki username ismi formlardaki ve modeldekilerile aynı olmalı veya uygun şekilde username:name şeklinde eşleştirilmeli
        let same = false                                             // veri tabanında yapılan işlemlerin (örn findOne) önüne await eklemezsen, user boş yani false olarak döner

        if (user) {
            same = await bcrypt.compare(password, user.password)     //parametrenin ilki req.body den aldığımız password , ikincisi veritabanından çektiğimiz user ın passwordu
        } else {
            return res.status(401).json({                          // return olmasının sebebi: böyle bir kullanıcı yoksa ikinci if i çalıştırmasına gerek yoktur
                succeded: false,
                error: 'There is no such user'
            })
        }

        if (same) {

            //token ı cookie ile taşıma=>
            const token = createToken(user._id)
            res.cookie('jwt', token, {//bu parantezler configuration objects için parantezler     //jwt cokkie deki taşınanın ismi
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.redirect('/users/dashboard')   //userRoute da dashboard a render a yönlendirlen satıra authMiddleware ını koyup token ı verify edip renderleticez, yanı dashboardu render etmeden önce token var mı yok mu uygun mu ona göre render eder
            /*.status(200).json({
               user,
               //token:createToken(user._id)                 //login yapmak için bilgilerini giren userın vertabanındaki _id değeri ile bir token oluştur ki, sonra ben bu kullanıcının yetkisi olup olmadığını kontrol edebileyim     
           }) */

        } else {
            res.status(401).json({
                succeded: false,
                error: 'Password are not matched'
            })
        }

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const createToken = (userId) => {                             //tokenın payload kısmında saklanamsını istediğimiz data vardı, burda saklanmasını istediğimiz data:userId
    return jwt.sign({ userId }, process.env.JWT_SECRETKEY, {   //ilk parametre payload ikincisi .env dosyasında tanımladığımız secretkey, üçüncü ise oluşturduğumuz tokenın geçerlilik süresi
        expiresIn: "1d"                                       //bir token oluşturup bunu return edecek bu fonksiyon
    })                                                       //bu fonksiyon yukarıda login fonksiyonunun başarılı olduğu if bölümünde response olarak döndürülenler arasında kullanılacak
}

const getDashboardPage = async (req, res) => {                      // dashboard da da o kullanıcının fotoğrafları listeleneceği için response da o photo ları göndermemiz gerekiyor
    const photos = await Photo.find({ user: res.locals.user._id })   // : un sol tarafı mongodb de photos collection undaki herbirinin user bilgilerinden : sağ taraftaki _id sine ye eşit olanları bulacak
    const user = await User.findById({ _id: res.locals.user._id }).populate(['followers', 'followings'])  //giriş yapmış olan kullanıcıyı çekip,onun followers ve following değerlerini populate ettik, ikisini aynı anda populate edebilmek için array ile
    res.render('dashboard', {
        link: 'dashboard',
        photos,               //artık dashboard.ejs de kullanılabilir
        user                  //user üzerinden followings ve followers a dashboard.ejs de ulaşabileceğiz
    })
}

const getAllUsers = async (req, res) => {
    try {                                    //not equal
        const users = await userModel.find({ _id: { $ne: res.locals.user._id } })   //find ın içini {} şeklinde bıraksaydık bütün userları getircekti ama users sayfasında o an giriş yapmış olan userın olmaması için böyle bir parametre gönderdik
        res.status(200).render('users', {
            users,
            link: "users"
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const getSelectedUser = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.params.id })    //userModelde ararken _id si requestin parametresindeki(yani çubukta yazan) id olanı bulacak

        const isinFollowers= user.followers.some((perFollower)=>{
            return perFollower.equals(res.locals.user._id)          //takip etmek için bastığım userın followers arrayınde benim id var ise true gönderecek yoksa false, user.ejs de buttonde follow mu yoksa unfollow mu yazacağını belirleyecek
        })

        const photos = await Photo.find({ user: user._id })     //Mongodb de photos collection unda user adlı fotoğrafı yükleyen user ın id sini tutan değer, tıkladığın kullanıcının id sine eşit olanın, yüklediği fotoğrafları
        res.status(200).render('user', {
            user,
            photos,
            link: 'users',
            isinFollowers
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }

}

const follow = async(req, res) => {
    try {
        let user = await User.findByIdAndUpdate(           /* Eğer let anahtar kelimesi kullanılmazsa, ikinci çağrının sonucu ilk user değişkenini üzerine yazar ve sadece ikinci çağrının sonucunu içerir.iki çağrı sonucunu aynı anda kullanmak, render etmek veya saklamak için  */
            { _id: req.params.id },                        //bunun
            {
                $push: { followers: res.locals.user._id }  // followers array ine, o an aktif olan, giriş yapmış olan kullanıcıyı(res.locals.user._id) ekle.
            },
            { new: true }                                 //update işleminden sonra dokümanın orjinal hali mi yoksa update edilmiş hali mi return edilsin, burda update edilmişi return ediliyor
        )

        user= await User.findByIdAndUpdate(
            {_id: res.locals.user._id},                 //takip eden kullanıcının takip ettikleri listesini güncelleme işlevi için =>
            {
                $push: {followings: req.params.id}
            },
            {new:true}
        )

        res.status(200).redirect(`/users/${req.params.id}`)

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}

const unfollow= async(req, res)=>{
    try {
        let user= await User.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $pull: {followers:res.locals.user._id}
            },
            {new:true}
        )
    
        user= await User.findByIdAndUpdate(
            {_id: res.locals.user._id},
            {
                $pull: {followings: req.params.id}
            },
            {new:true}
        )
    
        res.status(200).redirect(`/users/${req.params.id}`)
    
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


export { userCreate, userLogin, getDashboardPage, getAllUsers, getSelectedUser, follow, unfollow }     // default ile export etmediğin için *as olarak import etmelisin, default ile export edip *as olarak import edersen görmez!