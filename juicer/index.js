var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cors = require('cors')
const request = require("request")

// Setup Server
var port = (process.env.API_PORT || 3000); 
var app = express();
var router = express.Router();
//app.use(cors())
app.use(bodyParser.json())
app.use('/', router);
app.listen(port)
module.exports = app;

console.log("Juicer is listening on  Port  " + port)


// Logic
router.post("/juice",function(req,res){
    console.log("start juicing")
    console.log("finished juicing")
    
    if(req.body.fruit===undefined){
        res.sendStatus(404)    
    }else{
        var fruit = req.body.fruit
        fruit["juice"]=45
        res.send(fruit)
    }

    
});