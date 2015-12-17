/// <reference path="../typings/node/node.d.ts" />
/// <reference path="HttpPath" />
/// <reference path="User" />

var http = require("http")

module Exclusive{
	export class Service{
		users: string;
		content: string;
		app: string;
		
		constructor(users: string, content: string, app: string){
			this.users = users;
			this.content = content;
			this.app = app;
		}
		
		public Process(connection: any /*HTTP.Server*/, path: HttpPath, request){
			if (path || path.Head.length <= 0) {
				if (this.Authenticate(connection)){
					//HERE WE AUTHENTICATE THEN WE PULL THE URL, CONTENT, CONTENTURL AND USERSURL ALL OF THEM IN ONE JSON OBJECT
				}
				else
					connection.SendMessage(http.Status.Unautherized);
			}
			else
				switch (path.Head){
					case "app":
						connection.Sendfile(this.app + path.Tail);
						break;
						
					case "users":
						if (this.Authenticate(connection))
							this.ProcessUsers(connection, path.Tail);
						break;
						
					case "content":
						if (this.Authenticate(connection) && request.Method == "GET"){
							if (!path.Tail)
								connection.Send(this.GetContent());
							else
								connection.SendFile(this.content + path.Tail);
						}
						break;
						
					default:
						switch (<string>request.Method){
							case "GET":
								this.Get(connection, path)
						}
						break;
				}
		}
		
		private ProcessUsers(connection: any, path: HttpPath){
			
		}
		
		private Get(connection: any, path: HttpPath){
			var user = User.Open(this.users, path.Head)
			if (user){
				var time = new Date;
				var timeAsString = time.toISOString().replace(/T/, ' ').replace(/\..+/, '');
				
				switch (path.Tail ? path.Tail.Head : ""){
					case "":
						connection.SendMessage(http.response.statusCode.NotFound);
						user.Log(timeAsString, connection.remoteAddress, http.METHODS.GET, path, http.STATUS_CODES[404]);
						break;
						
					default:
						if (user.CanRead(path.Tail.Head))
							user.Log(timeAsString, connection.remoteAddress, http.METHODS.GET, path, connection.SendFile(this.content + path.Tail));
						else{
							connection.SendMessage(http.response.statusCode.NotFound);
							user.Log(timeAsString, connection.remoteAddress, http.METHODS.GET, path, http.STATUS_CODES[404]);
						}
				}
			}
		}
		
		private GetContent(){
			//returns an object of json array
		}
		
		private Authenticate(connection: any /*HTTP.Server*/):boolean{
			return true;
		}
	}
}