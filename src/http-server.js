const express = require('express');
const app = express();
const idGenerator = require("human-readable-ids").hri;
const gameSession = require("./build/server/gameSession").GameSession;
const redisSession = require("./build/server/redisSession");
const redis = require('ioredis');
const bluebird = require('bluebird');
const winston = require('winston');

//Set winston
winston.level = 'debug';
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/static', express.static('public'))
app.use('/node_modules', express.static('node_modules'))
// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('create-game');
});

//Create game
app.post('/create-game', function(req, res) {
    winston.debug("Creating game");
    gameSession.createSession().then((id)=> {
        winston.debug("Game created");
        res.redirect("/game/"+id);
    });
});
//Redirect any games without id
app.get('/game/', function(req,res){
    res.redirect("/");
});

app.get('/game/:id',function(req,res){
    if(!!req.params.id) {
        let sessionId = req.params.id;

        gameSession.sessionExists(sessionId).then((result) => {
            if(result) { res.render("game"); }
            else { res.render("game-not-found"); }
        });
    }
    else { res.render("game-not-found"); }
});

//Before we listen for the port makes sure our dependcies are met

redisSession.initRedis().then((redisClient)=> {
    //Add client reference to gamesession
    gameSession.redisClient = redisClient;
    app.listen(8080);
    winston.debug('8080 is the magic port');
}).catch((error)=> {
    winston.error("Redis Init error: error");
});
