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

console.log("Mixer is listening on  Port  " + port)

// Logic
router.get("/mix",function(req,res){
    console.log("start mixing")
    request('http://orange:3000/juice', { json: true}, (err, r, body) => {
        res.status(r.statusCode)
        res.send(r.body)
        console.log("finished mixing")
    });
    
    
});


