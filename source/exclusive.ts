/// <reference path="Server" />
var fs = require('fs')
var http = require('http')
var path = require('path')
var url = require("url")

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
var program = new Exclusive.Program();