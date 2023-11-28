

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

export {getIndexPage , getAboutPage}