const express = require('express');
const app = express();
const idGenerator = require("human-readable-ids").hri;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/static', express.static('public'))
app.use('/node_modules', express.static('node_modules'))
// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('create_game');
});

// about page 
app.post('/create-game', function(req, res) {
    console.log("Creating game");
    let id = idGenerator.random();
    console.log("Created game with ID:"+id);
    res.redirect("/game/"+id);
});
app.get('/game/:id',function(req,res){
    console.log("Requesting game with ID: "+req.params.id);
    res.sendStatus(200);
});

app.listen(8080);
console.log('8080 is the magic port');