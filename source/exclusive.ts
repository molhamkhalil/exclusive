/// <reference path="Server" />
/// <reference path="User" />

var http = require('http');

module Exclusive {
	export class Program {
		
		private newUser: User
		constructor() {
			this.newUser = new User("Molham Khail", "/home/mkhalil/Skrivbord/");
			console.log(this.newUser.Logs);
		}
/*		private server: Server
		constructor() {
			this.registerKeyEvents()
			this.server = new Server(8080)
			this.server.start()
		}
		registerKeyEvents() {
			// CTRL+C
			process.on("SIGINT", () => {
				this.server.stop()
				process.exit()
			})
		}
*/
	}
}
var program = new Exclusive.Program();