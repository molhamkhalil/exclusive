/// <reference path="../typings/node/node.d.ts" />
/// <reference path="HttpPath" />
/// <reference path="User" />
/// <reference path="Connection" />

module Exclusive{
	export class Service{
		private users: string;
		get Users() {return this.content;}
		
		private content: string;
		get Content() {return this.content;}
		
		private app: string;
		get App() {return this.app;}
		
		constructor(servicePath: string, app: string){
			this.users = path.join(servicePath, 'users');
			this.content = path.join(servicePath, 'content');
			this.app = app;
		}
		
		 public static getDirectories(sourcePath: string){
			 return fs.readdirSync(sourcePath).filter((file: any) => {return fs.statSync(path.join(sourcePath, file)).isDirectory();
				 });
		 }
		 
		 public AddKeyValue(key: string, value: string, result: string): string{
			 	result += "\"" + key + "\": " + "\"" + value + "\",\n";
			 return result;
		 }
		
		public Process(connection: Connection, urlPath: HttpPath){
			if (!urlPath || urlPath.Head.length <= 0) {
				if (this.Authenticate(connection)){
					var stringToPrint = "{\n";
					stringToPrint = this.AddKeyValue("url", connection.Url, stringToPrint);
					stringToPrint = this.AddKeyValue("content", this.GetContent(), stringToPrint);
					stringToPrint = this.AddKeyValue("contentUrl", path.join(connection.Url, 'content'), stringToPrint);
					stringToPrint = this.AddKeyValue("usersUrl", path.join(connection.Url, 'users'), stringToPrint);
					stringToPrint = stringToPrint.slice(0, -2);
					stringToPrint += "\n}";
					connection.Write(stringToPrint, 200, {'Content-Type': 'application/json'});
				}
				else
					connection.Write("Unautherised", 401);
			}
			else
				switch (urlPath.Head){
					case "app":
						//connection.SendFile(path.join(this.app, urlPath.Tail));
						break;
						
					case "users":
						if (this.Authenticate(connection))
							this.ProcessUsers(connection, urlPath.Tail);
						break;
						
					case "content":
						if (this.Authenticate(connection) && connection.Request.method == "GET"){
							if (!urlPath.Tail)
								connection.Write(this.GetContent(), 200, {'Content-Type': 'application/json'});
							else
								connection.SendFile(path.join(this.content, urlPath.Tail.Head));
						}
						break;
						
					default:
						switch (connection.Request.method){
							case "GET":
								this.Get(connection, urlPath);
						}
						break;
				}
		}
		
		private ProcessUsers(connection: Connection, httpPath: HttpPath){
			if (!httpPath || httpPath.Head.length <= 0){
				switch (connection.Request.method){
					case "GET":
					var users = new User ("m", "q", "q");
					users.Logs;
						connection.WriteAllUsers(this.users, connection);
						break;
					case "POST":
						var user: User;
						user = connection.Receive();
						if(!user)
							connection.Write("Bad Request", 400);
						else if(!user.Create(connection.Url, this.users))
							connection.Write("Internal Server Error", 500);
						else
							connection.Write(user.ToString(), 200, {'Content-Type': 'application/json'});
						break;
				}
			}
			else {
				var user = User.OpenUser(httpPath.Head, this.users, connection);
				if (user)
					switch (httpPath.Tail ? httpPath.Tail.Head:"") {
						case "":
							switch (connection.Request.method) {
								case "GET":
									connection.Write(user.ToString(), 200, {'Content-Type': 'application/json'});
									break;
								case "PUT":
									var update: User;
									update = connection.Receive();
									if (!update || !user.Update(update))
										connection.Write("Bad Request", 400);
									else if (!user.Save())
										connection.Write("Internal Server Error", 500);
									else
										connection.Write(user.ToString(), 200, {'Content-Type': 'application/json'});
									break;
							}
							break;
						case "folders":
							if (connection.Request.method == "GET")
								connection.SendFoldersOrLogs(user.Folders);
							break;
						case "log":
							if (connection.Request.method == "GET")
								connection.SendFoldersOrLogs(user.Logs);
							break;
						default:
							connection.Write("Not Found", 404);
							break;
					}
			}
		}
		
		private Get(connection: Connection, httpPath: HttpPath){
			var user = User.OpenUser(httpPath.Head, this.users, connection);
			if (user){
				'use strict';
				var os = require('os');
				var address = os.networkInterfaces();
				
				switch (httpPath.Tail ? httpPath.Tail.Head : ""){
					case "":
						connection.Write("Not Found", 404);
						user.AddLog(address, connection.Request.method, httpPath, http.STATUS_CODES[404]);
						break;
						
					default:
						if (user.CanRead(httpPath.Tail.Head))
							user.AddLog(address, connection.Request.method, httpPath, http.STATUS_CODES[connection.SendFile(path.join(this.content, httpPath.Tail.Head))]);
						else{
							connection.Write("Not Found", 404)
							user.AddLog(address, connection.Request.method, httpPath, http.STATUS_CODES[404]);
						}
				}
			}
		}
		
		private GetContent(){
			var result = "[\n";
			var directories = Service.getDirectories(this.content);
			if (directories)
				for (var i = 0; i < directories.length; i++)
					result += directories[i] + ",";
					
			result = result.slice(0, -1);
			return result += "\n]";
		}
		
		private Authenticate(connection: any):boolean{
			return true;
			//NOT DONE YET, NEEDS TO BE DONE
		}
	}
}