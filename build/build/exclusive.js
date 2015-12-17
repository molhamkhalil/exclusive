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
var http = require("http");
var url = require("url");
var fs = require("fs");
var Exclusive;
(function (Exclusive) {
    var Backend_User = (function () {
        function Backend_User(company, contact, crm) {
            this.company = company;
            this.contact = contact;
            this.crm = crm;
        }
        Object.defineProperty(Backend_User.prototype, "Company", {
            get: function () { return this.company; },
            set: function (value) { this.company = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Backend_User.prototype, "Contact", {
            get: function () { return this.contact; },
            set: function (value) { this.contact = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Backend_User.prototype, "Crm", {
            get: function () { return this.crm; },
            set: function (value) { this.crm = value; },
            enumerable: true,
            configurable: true
        });
        return Backend_User;
    })();
    Exclusive.Backend_User = Backend_User;
    var UriLocator = (function () {
        function UriLocator(path) {
            this.path = path;
        }
        Object.defineProperty(UriLocator.prototype, "Path", {
            get: function () { return this.path; },
            set: function (value) { this.path = value; },
            enumerable: true,
            configurable: true
        });
        return UriLocator;
    })();
    Exclusive.UriLocator = UriLocator;
    var HttpPath = (function () {
        function HttpPath(head, tail) {
            this.head = head;
            this.tail = tail;
        }
        Object.defineProperty(HttpPath.prototype, "Head", {
            get: function () { return this.head; },
            set: function (value) { this.head = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpPath.prototype, "Tail", {
            get: function () { return this.tail; },
            set: function (value) { this.tail = value; },
            enumerable: true,
            configurable: true
        });
        return HttpPath;
    })();
    var Service = (function () {
        function Service() {
        }
        return Service;
    })();
})(Exclusive || (Exclusive = {}));
var http = require("http");
var fs = require("fs");
var Exclusive;
(function (Exclusive) {
    var User = (function () {
        function User(name, path) {
            this.backend = new Exclusive.Backend_User("imint", "0760825650", "1234");
            this.name = name;
            this.path = new Exclusive.UriLocator(path);
            this.url = new Exclusive.UriLocator("The URL Path");
        }
        Object.defineProperty(User.prototype, "User", {
            get: function () { return this.backend; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Path", {
            get: function () { return this.path.Path; },
            set: function (value) { this.path.Path = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Name", {
            get: function () { return this.name; },
            set: function (value) { this.name = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Url", {
            get: function () { return this.url.Path; },
            set: function (value) { this.url.Path = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "LogUrl", {
            get: function () { return this.url.Path + "log"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Logs", {
            get: function () {
                if (!this.logs && (this.path && this.path.Path.length > 0)) {
                    console.log("FILE: " + this.path.Path + "log.csv");
                    fs.readFile(this.path.Path + "log.csv", function (error, data) {
                        console.log(data);
                    });
                }
                return this.logs;
            },
            set: function (value) { this.logs = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "FoldersUrl", {
            get: function () { return this.url.Path + "links"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Folders", {
            get: function () {
                if (!(this.folders || this.path || this.path.Path.length > 0)) {
                    var fileStream = fs.createReadStream(this.path.Path + "content.csv");
                    var data = "";
                    fileStream.on('readable', function () {
                        data += fileStream.read();
                        while (data.indexOf('\n') >= 0) {
                            fileStream.emit('newLine', data.substring(0, data.indexOf('\n')));
                            data = data.substring(data.indexOf('\n') + 1);
                        }
                    });
                    fileStream.on('end', function () {
                        fileStream.emit('newLine', data, true);
                    });
                    fileStream.on('newLine', function (lineOfText) {
                        this.folders.push(lineOfText);
                    });
                }
                return this.folders;
            },
            set: function (value) { this.folders = value; },
            enumerable: true,
            configurable: true
        });
        return User;
    })();
    Exclusive.User = User;
})(Exclusive || (Exclusive = {}));
var http = require('http');
var Exclusive;
(function (Exclusive) {
    var Program = (function () {
        function Program() {
            var newUser = new Exclusive.User("Molham Khail", "~/temp/log.csv");
            console.log(newUser.Logs);
        }
        return Program;
    })();
    Exclusive.Program = Program;
})(Exclusive || (Exclusive = {}));
var program = new Exclusive.Program();
//# sourceMappingURL=exclusive.js.map