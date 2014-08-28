var http = require("http");
var queryString = require("querystring");

var heaps = require("./heaps.js");

var priorityQueue = new heaps.MaxHeap();
http.createServer(function (req, resp) {
    if(req.method === "GET") {
        if(req.url === "/" || req.url === "/?") {
            var message = priorityQueue.get();
            if(message) {
                resp.writeHead(200, "OK");
                resp.end(message);
            } else {
                resp.writeHead(204, "No Content")
                resp.end();
            }
        } else {
            resp.writeHead(404, "Not Found")
            resp.end();
        }
    } else if(req.method === "POST") {
        if(req.url === "/") {
            var body = "";

            // Warning: Someone can upload infinite data.
            req.on("data", function (data) {
                body += data;
            });

            req.on("end", function () {
                var post = queryString.parse(body);
                var priority;

                if(!post.priority || !post.message) {
                    resp.writeHead(400, "Bad Request");
                    resp.end("You must provide both a priority and a message.");
                } else if(isNaN((priority = parseFloat(post.priority)))) {
                    resp.writeHead(400, "Bad Request");
                    resp.end("Priority was not a number.");
                } else {
                    priorityQueue.put(priority, post.message);
                    resp.writeHead(200, "OK");
                    resp.end("Accepted message.");
                }
            });
        } else {
            resp.writeHead(404, "Not Found")
            resp.end();
        }
    } else {
        resp.writeHead(405, "Method Not Allowed");
        resp.end();
    }
}).listen(8080);