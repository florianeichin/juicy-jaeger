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

console.log("Orange is listening on  Port  " + port)

let fruit = {
    "fruit":{"name":"Orange"}
}

// Logic
router.get("/juice",function(req,res){
    // if slice auch slicen
    console.log("start orange processing")
    request('http://juicer:3000/juice', { json: true, body:fruit, method: "POST"}, (err, r, body) => {
        res.status(r.statusCode)
        console.log(r.body)
        console.log("finished orange processing")
        res.send(r.body)
    });

});