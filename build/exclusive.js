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
})(Exclusive || (Exclusive = {}));
var Exclusive;
(function (Exclusive) {
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
    Exclusive.HttpPath = HttpPath;
})(Exclusive || (Exclusive = {}));
var fs = require("fs");
var http = require("http");
var url = require("url");
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
                    else if (request.method == 'GET') {
                        var localPath = url.parse(request.url, true, true);
                        Server.sendFileResponse(localPath, response, "text/plain");
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
        Server.sendFileResponse = function (localPath, responseObject, contentType) {
            fs.readFile(localPath, function (err, contents) {
                if (!err) {
                    responseObject.writeHead(200, "Ok", { "Content-Length": contents.length, "Content-Type": contentType });
                    responseObject.end(contents);
                }
                else {
                    responseObject.writeHead(404, "Not found", { "Content-Type": "text/html" });
                    responseObject.end("<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>");
                }
            });
        };
        return Server;
    })();
    Exclusive.Server = Server;
})(Exclusive || (Exclusive = {}));
var http = require("http");
var fs = require("fs");
var domain = require("domain");
var Exclusive;
(function (Exclusive) {
    var User = (function () {
        function User(name, path) {
            this.backend = new Exclusive.Backend_User("imint", "0760825650", "1234");
            this.name = name;
            this.path = path;
            this.url = "The URL Path";
        }
        Object.defineProperty(User.prototype, "User", {
            get: function () { return this.backend; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Path", {
            get: function () { return this.path; },
            set: function (value) { this.path = value; },
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
            get: function () { return this.url; },
            set: function (value) { this.url = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "LogUrl", {
            get: function () { return this.url + "log"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Logs", {
            get: function () {
                var logs = [];
                if (!this.logs && (this.path && this.path.length > 0)) {
                    fs.readFile(this.path + "log.csv", "utf-8", function (error, data) {
                        if (error)
                            return console.log(error);
                        console.log(data);
                        logs = data.split('\n');
                    });
                    this.logs = logs;
                }
                return this.logs;
            },
            set: function (value) { this.logs = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "FoldersUrl", {
            get: function () { return this.url + "links"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Folders", {
            get: function () {
                var _this = this;
                if (!this.folders && (this.path && this.path.length > 0)) {
                    fs.readFile(this.path + "contetnt.csv", "utf-8", function (error, data) {
                        if (error)
                            return console.log(error);
                        console.log(data);
                        _this.folders = data.split('\n');
                    });
                }
                return this.folders;
            },
            set: function (value) { this.folders = value; },
            enumerable: true,
            configurable: true
        });
        User.Open = function (name, path) {
            return new User(name, path);
        };
        User.prototype.Log = function (time, address, method, path, status) {
            var result;
            try {
                var message = time + "," + address + "," + method.Tostring() + "," + path.ToString() + "," + status.ToString() + '\n';
                fs.appendFile(this.path + "log.csv", message, function (err) {
                    if (err)
                        throw err;
                });
                console.log(message);
                result = true;
            }
            catch (Exception) {
                result = false;
            }
            return result;
        };
        User.prototype.CanRead = function (folder) {
            return (this.folders.indexOf(folder) == -1) ? false : true;
        };
        User.prototype.Create = function (url, users) {
            var randomName = Math.random().toString(36).slice(8);
            return true;
        };
        User.prototype.Save = function () {
            fs.appenFile(this.path + "content.csv", "\n", function (err) {
                if (err)
                    throw err;
            });
            return true;
        };
        User.prototype.Update = function (user) {
            if (user) {
                this.backend.Company = user.backend.Company;
                this.backend.Contact = user.backend.Contact;
                this.backend.Crm = user.backend.Crm;
                this.Folders = user.Folders;
                return true;
            }
            else
                return false;
        };
        return User;
    })();
    Exclusive.User = User;
})(Exclusive || (Exclusive = {}));
var http = require("http");
var Exclusive;
(function (Exclusive) {
    var Service = (function () {
        function Service(users, content, app) {
            this.users = users;
            this.content = content;
            this.app = app;
        }
        Service.prototype.Process = function (connection, path, request) {
            if (path || path.Head.length <= 0) {
                if (this.Authenticate(connection)) {
                }
                else
                    connection.SendMessage(http.Status.Unautherized);
            }
            else
                switch (path.Head) {
                    case "app":
                        connection.Sendfile(this.app + path.Tail);
                        break;
                    case "users":
                        if (this.Authenticate(connection))
                            this.ProcessUsers(connection, path.Tail);
                        break;
                    case "content":
                        if (this.Authenticate(connection) && request.Method == "GET") {
                            if (!path.Tail)
                                connection.Send(this.GetContent());
                            else
                                connection.SendFile(this.content + path.Tail);
                        }
                        break;
                    default:
                        switch (request.Method) {
                            case "GET":
                                this.Get(connection, path);
                        }
                        break;
                }
        };
        Service.prototype.ProcessUsers = function (connection, path) {
        };
        Service.prototype.Get = function (connection, path) {
            var user = Exclusive.User.Open(this.users, path.Head);
            if (user) {
                var time = new Date;
                var timeAsString = time.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                switch (path.Tail ? path.Tail.Head : "") {
                    case "":
                        connection.SendMessage(http.response.statusCode.NotFound);
                        user.Log(timeAsString, connection.remoteAddress, http.METHODS.GET, path, http.STATUS_CODES[404]);
                        break;
                    default:
                        if (user.CanRead(path.Tail.Head))
                            user.Log(timeAsString, connection.remoteAddress, http.METHODS.GET, path, connection.SendFile(this.content + path.Tail));
                        else {
                            connection.SendMessage(http.response.statusCode.NotFound);
                            user.Log(timeAsString, connection.remoteAddress, http.METHODS.GET, path, http.STATUS_CODES[404]);
                        }
                }
            }
        };
        Service.prototype.GetContent = function () {
        };
        Service.prototype.Authenticate = function (connection) {
            return true;
        };
        return Service;
    })();
    Exclusive.Service = Service;
})(Exclusive || (Exclusive = {}));
var http = require('http');
var Exclusive;
(function (Exclusive) {
    var Program = (function () {
        function Program() {
            this.newUser = new Exclusive.User("Molham Khail", "/home/mkhalil/Skrivbord/");
            console.log(this.newUser.Logs);
        }
        return Program;
    })();
    Exclusive.Program = Program;
})(Exclusive || (Exclusive = {}));
var program = new Exclusive.Program();
//# sourceMappingURL=exclusive.js.map