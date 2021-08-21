const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');

// --- EXPRESS SETUP ---
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/three'));

// --- ROUTES ---
app.get('/protein', (req,res) => {
    res.render('protein.ejs');
});

app.get('/present', (req,res) => {
    res.render('present.ejs');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
})