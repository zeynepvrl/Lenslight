import express from 'express';
import conn from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

conn();

//static files middleware
app.use(express.static('public'));

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/about', (req, res) => {
    res.render("about")
})

app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
})