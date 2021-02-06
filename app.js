const express = require('express')
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"))

const port = 3000
let server = app.listen(port, () => {
    console.log("listening");
})

app.get('/', (req, res) => {
    res.render("main.ejs")
})

app.get('/visualize', (req, res) => {
    res.render("visualize.ejs")
})

app.get('/visualize2', (req, res) => {
    res.render("visualize2.ejs")
})