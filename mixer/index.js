var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cors = require('cors')
const request = require("request-promise")
const initTracer = require('./lib/tracer').initTracer;
const tracer = initTracer('mixer');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')

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
router.get("/mix", async function (req, res) {
    var spanMix = tracer.startSpan('mix')
    headers = {}
    tracer.inject(spanMix, FORMAT_HTTP_HEADERS, headers)

    let q = req.query
    let juice, slices
    let responseAll = []
    let proms = []
    let methods = []
    if (q.juice) { methods.push([q.juice, "juice"]) }
    if (q.slices) { methods.push([q.slices, "slices"]) }

    methods.forEach(meth => {
        if (!(Array.isArray(meth[0]))) {
            meth[0] = [meth[0]]
        }
        let reqs = []
        meth[0].forEach(function (element) {
            reqs.push(requestWrapper(element, meth[1]))
        })
        reqs.forEach((element, index) => {
            proms.push(element)
            
            element.then(value => {
                response={}
                spanMix.log({ 'event': 'received responses: '+ meth[0][index] + "/" + meth[1]})
                response["fruit: " + meth[0][index] + " method: " + meth[1]] = value
                responseAll.push(response)
            }).catch(reason => {
                response={}
                spanMix.log({ 'event': 'received error: '+ meth[0][index] + "/" + meth[1]})
                response["fruit: " + meth[0][index] + " method: " + meth[1]] = reason.message
                responseAll.push(response)
            })
        })
    })

    Promise.all(proms.map(p => p.catch(() => undefined))).then(values => {
        spanMix.log({ 'event': 'received fruit responses' })
        spanMix.finish()
        res.send(responseAll)
    }).catch(values => {
        spanMix.log({ 'event': 'received fruit error' })
        spanMix.finish()
        res.send(responseAll)
    })



});

function requestWrapper(fruit, endpoint) {
    return request('http://' + fruit + ':3000/' + endpoint, { json: true, headers: headers });
}