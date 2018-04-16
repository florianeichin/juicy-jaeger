var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cors = require('cors')
const request = require("request")
const initTracer = require('./lib/tracer').initTracer;
const tracer = initTracer('juicer');
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

console.log("Juicer is listening on  Port  " + port)


// Logic
router.post("/juice",function(req,res){
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS,req.headers)
    var process = tracer.startSpan('process',{childOf: parentSpanContext})

    if(req.body.fruit===undefined){
        process.log({'event':'no fruit'})
        process.finish()
        res.sendStatus(404)    
    }else{
        let rnd = Math.random()
        var fruit = req.body.fruit
        fruit["juice"]=rnd*100
        setTimeout(()=>{
            process.log({'event':'processed'})
            process.finish()
            res.send(fruit)
        },rnd*100)

    }

    
});