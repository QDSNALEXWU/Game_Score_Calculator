'use strict';

var express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
var flash = require('connect-flash');
let jsonData = require('./data.json');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var session = require('express-session');
const { range } = require('express/lib/request');

const app = express();

app.engine('handlebars', engine({ 
    extname: '.hbs',
    defaultLayout: "main",
    helpers: {
        inc: function (value, options) {
            return parseInt(value) + 1;
        },
        json: function(context) {
            return JSON.stringify(context);
        }
    },
}));
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.use(session({ secret: '4564f6s4fdsfdfd', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(jsonParser)
app.use(bodyParser.urlencoded({
  extended: true
}))


/* Get Current User */
app.get('/', function (req, res) {
    jsonData.sort((a,b) => b.score - a.score);
    res.render('home', {data:jsonData});
});

/* Add new user */
app.post('/addUser', function(req, res){
    var name = req.body.username
    var score = req.body.score
    jsonData.push({name,score})
    let data = JSON.stringify(jsonData);
    fs.writeFileSync('data.json', data);
    res.redirect('/')
})

/* Delete User */
app.post('/delUser/:name', function(req, res){
    let user = req.params.name
    let index = 0 
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i]['name'] == user) {
            index = i
            break
        }
    }
    jsonData.splice(index, 1);
    let data = JSON.stringify(jsonData);
    fs.writeFileSync('data.json', data);
    res.redirect('/')
})

/* Update result */
app.post('/addResult', function(req, res) {
    // { win: '[张三,15]', lose: '[张三,15]' }

    if (winner == loser) res.redirect('/')

    var [winner, winnerScore] = req.body.win.split(",")
    var [loser, loserScore] = req.body.lose.split(",")

    winnerScore=parseInt(winnerScore)
    loserScore=parseInt(loserScore)

    let x = Math.abs(winnerScore-loserScore)

    switch(true) {
        case (x <= 12):
            winnerScore += 8 
            loserScore -=8 
            break;
        case (x <= 37):
            if (winnerScore > loserScore) {
                winnerScore += 7 
                loserScore -=7
            } else {
                loserScore -= 10 
                winnerScore += 10
            }
          break;
        case (x <= 62):
            if (winnerScore > loserScore) {
                winnerScore +=6 
                loserScore -=6
            } else {
                loserScore -=13 
                winnerScore += 13
            }
          break;
        case (x <= 87):
            if (winnerScore > loserScore) {
                winnerScore +=5 
                loserScore -=5
            } else {
                loserScore -=16
                winnerScore +=16
            }
          break;
        case (x <= 112):
            if (winnerScore > loserScore) {
                winnerScore +=4
                loserScore -=4
             } else {
                loserScore -=20
                winnerScore +=20
             }
          break;
        case (x <= 137):
            if (winnerScore > loserScore) {
                winnerScore +=3 
                loserScore -=3
             } else {
                loserScore -=25
                winnerScore +=25
             }
          break;
        case (x <= 162):
            if (winnerScore > loserScore) {
                winnerScore +=2
                loserScore -=2
             } else {
                loserScore -=30
                winnerScore +=30
             }
          break;
        case (x <= 187):
            if (winnerScore > loserScore) {
                winnerScore +=2 
                loserScore -=2
             } else {
                loserScore -=35
                winnerScore +=35
             }
          break;
        case (x <= 212):
            if (winnerScore > loserScore) {
                winnerScore +=1 
                loserScore -=1
             } else {
                loserScore -=40
                winnerScore +=40
             }
          break;
        case (x <= 237):
            if (winnerScore > loserScore) {
                winnerScore +=1 
                loserScore -=1
             } else {
                loserScore -=45
                winnerScore +=45
             }
          break;
        default:
            if (winnerScore > loserScore) {
                winnerScore +=0 
                loserScore -=0
             } else {
                loserScore -=50
                winnerScore +=50
             }
      }

      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i]['name'] == winner) {
            jsonData[i]['score'] = winnerScore
        }

        if (jsonData[i]['name'] == loser ) {
            jsonData[i]['score'] = loserScore
        }
      }

      let data = JSON.stringify(jsonData);
      fs.writeFileSync('data.json', data);
      res.redirect('/')

})



app.listen(3000, function () {
    console.log('express-handlebars example server listening on: 3000');
});
