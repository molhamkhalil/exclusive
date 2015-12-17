/// <reference path="../typings/node/node.d.ts" />
var fs = require("fs")
var http = require("http")
var url = require("url")

module Exclusive {
	export class Server {
		private server: any;
		constructor(private port: number) {
			this.server = http.createServer(this.requestCallback);
		}
		start() {
			this.server.listen(this.port, () => {
				console.log("listening on port " + this.port)
			});
		}
		stop() {
			this.server.close(() => {
				console.log("Exclusive server closed")
			})
		}
		createRequest(url: string, request: string) {
			// TODO: create POST
		}
		private requestCallback(request: any, response: any) {
			switch (request.url) {
				case "/":
					if (request.method == "POST") {
						request.on("data", function(chunk: any) {
							console.log(chunk.toString());
						});
						request.on("end", function() {
							response.writeHead(200, "OK", { "Content-Type": "text/plain" });
							response.end();
						});
					}
					else if(request.method == 'GET') {
						var localPath = url.parse(request.url, true, true);
						//response.writeHead(200, "found", { "Content-Type": "text/html" });
						//response.end("<html><head><title>404 - found</title></head><body><h1>found.</h1></body></html>");
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
			};
		}
		
		static sendFileResponse(localPath: string, responseObject: any, contentType: string){
			fs.readFile(localPath, (err: any, contents: string) => {
				if (!err){
					responseObject.writeHead(200, "Ok", {"Content-Length": contents.length, "Content-Type": contentType})
					responseObject.end(contents);
				}
				else{
					responseObject.writeHead(404, "Not found", { "Content-Type": "text/html" });
					responseObject.end("<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>");
				}
			});
		}
	}
}