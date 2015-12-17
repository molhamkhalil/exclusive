/// <reference path="../typings/node/node.d.ts" />
///<reference path="Backend_User" />

var http = require("http")
var fs = require("fs")
var domain = require("domain")

module Exclusive{
	export class User{
		 private backend: Backend_User;
		 get User(){return this.backend;}
		 
		 private path: string;
		 get Path(){return this.path;}
		 set Path(value: string){this.path = value;}
		 
		 private name: string;
		 get Name(){return this.name;}
		 set Name(value: string){this.name = value;}
		 
		 private url: string;
		 get Url(){return this.url;}
		 set Url(value: string){this.url = value;}
		 
		 private logUrl: string;
		 get LogUrl(){return this.url + "log";}
		 
		 private logs: string[];
		 get Logs(){
			 var logs: string[] = []
			 if (!this.logs && (this.path && this.path.length > 0)) {
				 fs.readFile(this.path + "log.csv", "utf-8", (error: any, data: string) => {
					 if (error) return console.log(error);
					 
					 console.log(data);
					 logs = data.split('\n');
				 });
				 this.logs = logs;
/*				 var data = "";
				 
				 fileStream.on('readable', () => {
					 data += fileStream.read();
					 while(data.indexOf('\n') >= 0 ){
						 fileStream.emit('newLine', data.substring(0,data.indexOf('\n')));
						 data = data.substring(data.indexOf('\n')+1);
					 }
				 });
				 
				 fileStream.on('end', function(){
					 fileStream.emit('newLine', data, true);
				 });
				 
				 fileStream.on('newLine', function(lineOfText){
					 this.logs.push(lineOfText);
					 console.log(lineOfText);
				 });*/
			}
			return this.logs;
		 }
		 set Logs(value: string[]){this.logs = value;}
		 
		 private foldersUrl: string;
		 get FoldersUrl(){return this.url + "links";}
		 
		 private folders: string [];
		 get Folders(){
			 if (!this.folders && (this.path && this.path.length > 0)) {
				 fs.readFile(this.path + "contetnt.csv", "utf-8", (error: any, data: string) => {
					 if (error) return console.log(error);
					 
					 console.log(data);
					 this.folders = data.split('\n');
				 });
/*				 var fileStream = fs.createReadStream(this.path + "content.csv");
				 var data = "";
				 
				 fileStream.on('readable', function(){
					 data += fileStream.read();
					 while(data.indexOf('\n') >= 0 ){
						 fileStream.emit('newLine', data.substring(0,data.indexOf('\n')));
						 data = data.substring(data.indexOf('\n')+1);
					 }
				 });
				 
				 fileStream.on('end', function(){
					 fileStream.emit('newLine', data, true);
				 });
				 
				 fileStream.on('newLine', function(lineOfText: any){
					 this.folders.push(lineOfText);
				 });*/
			}
			 return this.folders;
		 }
		 set Folders(value: string[]){ this.folders = value;}
		 
		 constructor(name: string, path: string){
			 this.backend = new Backend_User("imint", "0760825650", "1234");
			 this.name = name;
			 this.path= path;
			 this.url = "The URL Path";
		 }
		 
		 public static Open(name: string, path: string): User{
			 return new User(name, path);
			 //NEEDS A TRUE IMPLEMENTATION
		 }
		 
		 public Log (time: string, address: any, method: any, path: any, status: any):boolean{
			 var result: boolean;
			 try {
				 var message = time + "," + address + ","  + method.Tostring() + ","  + path.ToString() + "," + status.ToString() + '\n';
				 fs.appendFile(this.path + "log.csv", message, (err: any) => {
					 if (err) throw err;
				 });
				 console.log(message);
				 result = true;
			 } catch (Exception) {
				 result = false;
			 }
			 return result;
		 }
		 
		 public CanRead(folder: string): boolean{
			 return (this.folders.indexOf(folder) == -1) ? false: true;
		 }
		 
		 public Create(url: any, users: any): boolean{
			 var randomName = Math.random().toString(36).slice(8);
			 
			 //NOT DONE YET, NEEDS TO BE DONE
			 
			 return true;
		 }
		 
		 public Save(): boolean{
			 fs.appenFile(this.path + "content.csv", "\n", (err: any) => {
				 if (err) throw err;
			 });
			 
			 //NOT DONE YET, NEEDS TO BE DONE
			 
			 return true;
		 }
		 
		 public Update(user: User): boolean{
			 if(user){
				 this.backend.Company = user.backend.Company;
				 this.backend.Contact = user.backend.Contact;
				 this.backend.Crm = user.backend.Crm;
				 this.Folders = user.Folders
				 
				 return true;
			 }
			 else return false;
		 }
	}
}