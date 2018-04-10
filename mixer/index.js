var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
const request = require("request")

// Setup Server
var port = (process.env.API_PORT || 3000); 
var app = express();
var router = express.Router();

app.use(bodyParser.json())
app.use('/', router);
app.listen(port)
module.exports = app;

console.log("Mixer is listening on  Port  " + port)

// Logic
router.get("/mix",function(req,res){
    console.log("start mixing")
    console.log("finished mixing")
    res.send("done")
});


