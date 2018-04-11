var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cors = require('cors')
const request = require("request")
const initTracer = require('./lib/tracer').initTracer;
const tracer = initTracer('mixer');
const {Tags, FORMAT_HTTP_HEADERS} = require('opentracing')

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
    var mix = tracer.startSpan('mix')
    console.log("start mixing")
    headers={}
    tracer.inject(mix,FORMAT_HTTP_HEADERS, headers)
    request('http://orange:3000/juice', { json: true, headers: headers}, (err, r, body) => {
        mix.log({'event':'received'})
        mix.finish()
        res.status(r.statusCode)
        console.log("finished mixing")
        res.send(r.body)
    });
    
    
});


