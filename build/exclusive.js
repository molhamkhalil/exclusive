var http = require("http");
var Exclusive;
(function (Exclusive) {
    var Server = (function () {
        function Server(port) {
            this.port = port;
            this.server = http.createServer(this.requestCallback);
        }
        Server.prototype.start = function () {
            var _this = this;
            this.server.listen(this.port, function () {
                console.log("listening on port " + _this.port);
            });
        };
        Server.prototype.stop = function () {
            this.server.close(function () {
                console.log("Exclusive server closed");
            });
        };
        Server.prototype.createRequest = function (url, request) {
        };
        Server.prototype.requestCallback = function (request, response) {
            switch (request.url) {
                case "/":
                    if (request.method == "POST") {
                        request.on("data", function (chunk) {
                            console.log(chunk.toString());
                        });
                        request.on("end", function () {
                            response.writeHead(200, "OK", { "Content-Type": "text/plain" });
                            response.end();
                        });
                    }
                    else {
                        console.log("[405] " + request.method + " to " + request.url);
                        response.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
                        response.end("<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>");
                    }
                    break;
                default:
                    response.writeHead(404, "Not found", { "Content-Type": "text/html" });
                    response.end("<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>");
                    console.log("[404] " + request.method + " to " + request.url);
            }
            ;
        };
        return Server;
    })();
    Exclusive.Server = Server;
})(Exclusive || (Exclusive = {}));
var Exclusive;
(function (Exclusive) {
    var Program = (function () {
        function Program() {
            this.registerKeyEvents();
            this.server = new Exclusive.Server(8080);
            this.server.start();
        }
        Program.prototype.registerKeyEvents = function () {
            var _this = this;
            process.on("SIGINT", function () {
                _this.server.stop();
                process.exit();
            });
        };
        return Program;
    })();
    Exclusive.Program = Program;
})(Exclusive || (Exclusive = {}));
var program = new Exclusive.Program();
//# sourceMappingURL=exclusive.js.map