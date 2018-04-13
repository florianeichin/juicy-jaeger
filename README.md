# Juicy Jaeger
Juicy Jaeger is an examlple of CNCF Jaeger Distributed Tracing. The Examples shows the usage of different programming laguages and different complexities. There is a simple example for all programming languages and different complexity examples for Node.js .

 | Service | Programming Language |
---|---
Mixer | Node.js
Slicer | Node.js
Orange | Node.js
Blueberry | Go

## Installation & Usage
Get up and running
```bash
git clone https://github.com/florianeichin/juicy-jaeger
cd juicy-jaeger
docker-compose up -f production.yml
```

Call the following endpoint 
```
GET http://localhost:30001/mix
```

open Jaeger UI
```
http://localhost:16686
```