/// <reference path="Server" />

module Exclusive {
	export class Program {
		private server: Server
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
	}
}

var program = new Exclusive.Program()