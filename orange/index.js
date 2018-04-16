var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cors = require('cors')
const request = require("request")
const initTracer = require('./lib/tracer').initTracer;
const tracer = initTracer('orange');
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

console.log("Orange is listening on  Port  " + port)

let body = {
    "fruit":{"name":"Orange"}
}
router.get("/slices",function(req,res){

})
// Logic
router.get("/juice",function(req,res){
    // extracts callers context to get connection
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS,req.headers)
    var juice = tracer.startSpan('orange juice',{childOf: parentSpanContext})

    // injects the context to child context to get connections
    headers={}
    tracer.inject(juice,FORMAT_HTTP_HEADERS, headers)
    
    request('http://juicer:3000/juice', { json: true, body:body, method: "POST",headers:headers}, (err, r, body) => {
        if(err){
            juice.log({'event':'error in juicer response '+err})
            juice.finish()
            res.status(500).send(err)
        }else{
            res.status(200)
            juice.log({'event':'received juicer response'})
            juice.finish()
            res.send(r.body)
        }

    });

});