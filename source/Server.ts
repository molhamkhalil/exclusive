/// <reference path="../typings/node/node.d.ts" />
/// <reference path="Service" />

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
			var urlPath = HttpPath.Build(url.parse(request.url).pathname)
			var connection = new Connection(path.join(request.headers.host, url.parse(request.url, true, true).pathname), request, response);
			var service = new Service(path.join(__dirname, 'data'), "App");
			if(urlPath && urlPath.Head == "data")
				service.Process(connection, urlPath.Tail);
		}
	}
}