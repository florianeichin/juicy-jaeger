var jaeger = require('jaeger-client');

exports.initTracer = initTracer;

function initTracer(serviceName) {

   var UDPSENDER = require('jaeger-client/dist/src/reporters/udp_sender')
   var tracer = new jaeger.Tracer(
       serviceName,
       new jaeger.RemoteReporter(new UDPSENDER.default({host: 'jaeger'})),
       new jaeger.RateLimitingSampler(1),
       {}
   )

    //hook up nodejs process exit event
    process.on('exit', () => { 
        console.log('flush out remaining span'); 
        tracer.close(); 
    });
    //handle ctrl+c
    process.on('SIGINT', () => { 
        process.exit(); 
    });

    return tracer;
}