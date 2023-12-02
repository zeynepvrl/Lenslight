

const getIndexPage=(req,res)=>{
    res.render('index' , {
        link:'index'
    })
}

const getAboutPage=(req,res)=>{
    res.render('about' , {
        link:'about'                           //link ler _menu.ejs deki active classının kimde olacağını belirlemek için
    })
}

const getRegisterPage=(req,res)=>{
    res.render('register' , {
        link:'register'
    })
}

const getLoginPage=(req,res)=>{
    res.render('login', {
        link:"login"
    })
}

const getLogout=(req,res)=>{     //cookies deki token ı boş bir stringle yenileyeceğiz ama 1 milisaniyelik bir süre vereceğimiz için onun uçmasını sağlayacak
    res.cookie('jwt', '', {
        maxAge:1
    })
    res.redirect('/')      //index sayfasına redirect et 
}

export {getIndexPage , getAboutPage, getRegisterPage, getLoginPage, getLogout}