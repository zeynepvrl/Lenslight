import mongoose from 'mongoose';

const conn = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: 'lenslight_tr',
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("connect to DB successfully")
        })
        .catch((err) => {
            console.log(`DB connection err:${err}`)
        })
}

export default conn;