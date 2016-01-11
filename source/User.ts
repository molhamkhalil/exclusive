/// <reference path="../typings/node/node.d.ts" />
///<reference path="Backend_User" />

module Exclusive {
	export class User {
		private backend: Backend_User;

		private path: string;
		get Path() { return this.path; }
		set Path(value: string) { this.path = value; }

		private name: string;
		get Name() { return this.name; }
		set Name(value: string) { this.name = value; }

		private url: string;
		get Url() { return this.url; }
		set Url(value: string) { this.url = value; }

		private logUrl: string;
		get LogUrl() { return path.join(this.url, 'log'); }

		private logs: string[];
		get Logs() {
			var logs: string[] = [];
			this.path = path.join(__dirname, 'data', 'users', 'demo');
			if (!this.logs && (this.path && this.path.length > 0)) {
				//fs.open(path.join(this.path, 'log.csv'), 'rw', (error: any, fd: any) => {
				//if (!error){
				console.log(this.path + "/log.csv");
				fs.readFile(this.path + "/log.csv", 'utf-8', (err: any, data: string) => {
					if (err) console.log(err);
					console.log(data);
					//logs = data.split('\n');
					this.logs = data.split('\n');
				});
				//}
				//this.logs = logs;
				//});
			}
			return this.logs;
		}
		set Logs(value: string[]) { this.logs = value; }

		private foldersUrl: string;
		get FoldersUrl() { return path.join(this.url, 'folders'); }

		private folders: string[];
		get Folders() {
			var folders: string[] = [];
			if (!this.folders && (this.path && this.path.length > 0)) {
				fs.open(path.join(this.path, 'content.csv'), 'r', (error: any, fs: any) => {
					if (!error) {
						fs.readFile(path.join(this.path, 'content.csv'), 'utf-8', (err: any, data: string) => {
							if (err) return console.log(err);

							console.log(data);
							folders = data.split('\n');
						})
					}
					this.folders = folders;
				});
			}
			return this.folders;
		}
		set Folders(value: string[]) { this.folders = value; }

		constructor(company: string, contact: string, crm: string);
		constructor(name: string, userPath: string, connection: Connection);
		constructor(companyOrName: string, contactOrUserPath: string, crmOrConnection: any) {
			if (crmOrConnection instanceof Connection) {
				this.name = companyOrName;
				this.path = path.join(contactOrUserPath, this.name);
				this.url = crmOrConnection.Url;
			}
			else
				this.backend = new Backend_User(companyOrName, contactOrUserPath, crmOrConnection);
		}

		public static OpenUser(name: string, usersPath: string, connection: Connection): User {
			var backend: Backend_User = null;
			if (backend = Backend_User.ReadBackend(path.join(usersPath, name))) {
				var user = new User(name, usersPath, connection);
				user.backend = backend;
				return user;
			}
			else
				return null;
		}

		public AddLog(address: any, method: string, httpPath: any, status: string): boolean {
			var result: boolean;
			var time = new Date
			try {
				var message = time.toISOString().replace(/T/, ' ').replace(/\..+/, '') + ',' + address.eth0[0].family + ':' + address.eth0[0].address + "," + address.eth0[1].family + ':' + address.eth0[1].address + "," + method + "," + httpPath.ToString() + "," + status + '\n';
				fs.appendFile(path.join(this.path, 'log.csv'), message, 'utf-8', (err: any) => {
					if (err) throw err;
				});
				console.log(message);
				result = true;
			} catch (exception) {
				console.log(exception);
				result = false;
			}
			return result;
		}

		public CanRead(folder: string): boolean {
			return (this.folders.indexOf(folder) == -1) ? false : true;
		}

		public Create(url: any, usersPath: string): boolean {
			this.name = User.GenerateName(usersPath);
			this.Url = path.join(url, this.name);
			this.path = path.join(usersPath, this.name);
			return this.Save();
		}

		public Save(): boolean {
			var folders: string[];
			(this.folders) ? folders = this.folders : folders = [];
			folders.push("\n");
			fs.appendFile(path.join(this.path, 'content.csv'), folders, 'utf-8', (error: any) => {
				if (error) {
					console.log(error);
					return false;
				}
			});
			fs.writeFile(path.join(this.path, 'meta.json'), this.backend.ToString(), 'utf-8', (error: any) => {
				if (error) {
					console.log(error);
					return false;
				}
			});

			return true;
		}

		public Update(user: User): boolean {
			if (user) {
				this.backend.Company = user.backend.Company;
				this.backend.Contact = user.backend.Contact;
				this.backend.Crm = user.backend.Crm;
				this.folders = user.Folders;
				return true;
			}
			else return false;
		}

		private static GenerateName(path: string): string {
			var allUsers = Service.getDirectories(path);
			var fortsatt = true;
			while (fortsatt) {
				var randomName = Math.random().toString(36).slice(-8);
				if (!(allUsers.indexOf(randomName) > -1))
					fortsatt = false;
			}
			return randomName;
		}

		public ToString(): string {
			return "{\n\"Name\": \"" + this.name + ",\n\"Company\": \"" + this.backend.Company + ",\n\"Contact\": \"" + this.backend.Contact + ",\n\"Crm\": \"" + this.backend.Crm + ",\nUrl\": \"" + this.url + ",\n\"LogUrl\": \"" + this.LogUrl + ",\n\"Folders\": \"" + this.folders + ",\n\"FoldersUrl\": \"" + this.FoldersUrl + "\n}";;
		}
	}
}