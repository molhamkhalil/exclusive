/// <reference path="../typings/node/node.d.ts" />

module Exclusive {
	export class Connection {
		private url: string;
		get Url() { return this.url; }

		private request: any;
		get Request() { return this.request; }

		private response: any;
		get Response() { return this.response; }

		constructor(url: string, request: any, response: any) {
			this.url = url;
			this.request = request;
			this.response = response;
		}

		private SetHeader(statusCode: number, headers?: any) {
			var statusMessage: string;

			switch (statusCode) {
				case 200:
					statusMessage = "Ok";
					break;
				case 301:
					statusMessage = "Moved Permanently"
					break;
				case 400:
					statusMessage = "BadRequest";
					break;
				case 401:
					statusMessage = "Unautherised";
					break;
				case 403:
					statusMessage = "Forbidden";
					break;
				case 404:
					statusMessage = "Not Found";
					break;
				case 405:
					statusMessage = "Method Not Allowed";
					break;
				case 500:
					statusMessage = "Internal Server Error";
					break;
			}
			this.response.writeHead(statusCode, statusMessage, headers);
		}

		public Write(toPrint: string, statusCode: number, headers?: any) {
			this.SetHeader(statusCode, headers);
			this.response.write(toPrint);
			this.response.end();
		}

		public WriteFile(file: string): number {
			file += "/index.html";
			var result: number;
			fs.readFile(file, 'utf-8', (error: any, data: string) => {
				if (error) {
					result = 301
					this.Write("Moved Permanently", result);
					console.log(error);
				}
				else {
					result = 200;
					this.Write(data, result, { 'Content-Type': 'text/html', 'Content-Length': data.length })
				}
			});
			return result;
		}

		public WriteAllUsers(usersPath: any, connection: Connection) {
			var users = Service.getDirectories(usersPath);
			var user: User;
			var result = "[\n";
			var temp = users[0];
			for (var i = 0; i < users.length; i++)
				result += User.OpenUser(users[i], usersPath, connection).ToString() + "\n";
			this.Write(result, 200, { 'Content-Type': 'application/json', 'Content-Length': result.length });
		}

		public Receive(): User {
			var fullBody: string = "";
			var jsonUser: any;
			this.request.on('data', (chunk: string) => {
				fullBody += chunk;
			});
			this.request.on('end', () => {
				console.log(fullBody);
				var jsonUser = JSON.parse(fullBody);
			});
			//console.log(this)
			var result = new User(jsonUser.company, jsonUser.contact, jsonUser.crm);
			result.Folders = ["test"];
			return result;
		}
	}
}