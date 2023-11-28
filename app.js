import express from 'express';
import conn from "./db.js";
import dotenv from "dotenv";
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"

dotenv.config();

const app = express();
const port = process.env.PORT;

conn();

//static files middleware
app.use(express.static('public'));
app.use(express.json())

app.set('view engine', 'ejs')


//route
app.use('/' , pageRoute);
app.use('/about', pageRoute)
app.use('/photos' , photoRoute)

/* app.get('/', (req, res) => {
    res.render("index")
})
app.get('/about', (req, res) => {
    res.render("about")
}) */

app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
})