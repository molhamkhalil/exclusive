/// <reference path="../typings/node/node.d.ts" />

module Exclusive{
	export class Connection{
		private url: string;
		get Url() {return this.url;}
		set Url(value: string) {this.url = value;}
		
		private request: any;
		get Request(){return this. request;}
		set Request(value: any) {this.request = value;}
		
		private response: any;
		get Response() {return this.response;}
		set Response(value: any) {this.response = value;}
		
		constructor(){
		}
		
		private SetHeader(statusCode: number, headers?: any){
			var statusMessage: string;
			
			switch (statusCode){
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
		
		public Write(chunk: string, statusCode: number, headers?: any){
			this.SetHeader(statusCode, headers);
			this.response.write(chunk);
			this.response.end();
		}
		
		public SendFile(file: string): number{
			file += "/index.html";
			var result: number;
			fs.open(file, 'r', (error: any, fd: any) => {
				if (!error){
					fs.readFile(file, 'utf-8', (err: any, data: string) => {
						if (err){
							result = 301
							this.Write("Moved Permanently", result);
							throw error;
						}
						else {
							result = 200;
							this.Write(data, result, {'Content-Type': 'text/html', 'Content-Length': data.length})
						}
					});
				}
			});
			return result;
		}
		
		public SendFoldersOrLogs(folder: string[]){
			var folderContents = "[\n";
			for (var i = 0; i < folder.length; i++)
				folderContents += folder[i] + ",\n";
			folderContents = folderContents.slice(0, -2);
			this.Write(folderContents + "\n]", 200, {'Content-Type': 'application/json'});
			}
		
		public WriteAllUsers(usersPath: any, connection: Connection){
				var users = Service.getDirectories(usersPath);
				var user: User;
				var result = "[\n";
				var temp = users[0];
				for (var i = 0; i < users.length; i++)
					result += User.OpenUser(users[i], usersPath, connection).ToString() + "\n";
				this.Write(result, 200, {'Content-Type': 'application/json', 'Content-Length': result.length});
		}
		
		public Receive(): User{
			//SOME CODE OF RECEIVING DATA FROM THE CLIENT
			var result = new User("Company", "Contact", "Crm");
			result.Folders = [];
			return result;
		}
	}			
}