const express = require('express');
const app = express();
const idGenerator = require("human-readable-ids").hri;
const gameSession = require("./build/lib/game-session").GameSession;
const redis = require('ioredis');
const bluebird = require('bluebird');

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
    console.log("Creating game");
    gameSession.createSession().then((session)=> {
        console.log("Game created");
        res.redirect("/game/"+session.Id);
    });
});
//Redirect any games without id
app.get('/game/', function(req,res){
    res.redirect("/");
});

app.get('/game/:id',function(req,res){
    if(!!req.params.id)
    {
        let sessionId = req.params.id;

        gameSession.sessionExists(sessionId).then((result) => {
            if(result)
            {
                res.render("game");
            }
            else
            {
                res.render("game-not-found");
            }
        });
    }
    else
    {
        res.render("game-not-found");
    }
});

//Before we listen for the port makes sure our dependcies are met

const ready = function() {
    console.log('Redis Connected');
    //Add client reference to gamesession
    gameSession.redisClient = redisClient;
    app.listen(8080);
    console.log('8080 is the magic port');
};
const initError = function(err) {
    console.log("Redis Error: ",err);
};
const redisClient = new redis();
redisClient.on("ready",ready);
redisClient.on("error",initError);