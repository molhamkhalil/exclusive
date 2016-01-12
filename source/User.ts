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
			if (!this.logs && (this.path && this.path.length > 0)) {
				User.ReadFile(path.join(this.path, 'log.csv'), (data: string) => {
					if (data)
						this.logs = data.split('\n');
				});

			}
			return this.logs;
		}
		set Logs(value: string[]) { this.logs = value; }

		private foldersUrl: string;
		get FoldersUrl() { return path.join(this.url, 'folders'); }

		private folders: string[];
		get Folders() {
			if (!this.folders && (this.path && this.path.length > 0)) {
				User.ReadFile(path.join(this.path, 'content.csv'), (data: string) => {
					if (data)
						this.folders = data.split('\n');
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
			var userResult: User;
			Backend_User.ReadBackend(path.join(usersPath, name), (backendResult: Backend_User) => {
				if (backendResult) {
					userResult = new User(name, usersPath, connection);
					userResult.backend = backendResult;
				}
			});
			return userResult;
		}

		public AddLog(address: any, method: string, httpPath: any, status: string): boolean {
			var time = new Date
			var message = time.toISOString().replace(/T/, ' ').replace(/\..+/, '') + ',' + address.eth0[0].family + ':' + address.eth0[0].address + "," + address.eth0[1].family + ':' + address.eth0[1].address + "," + method + "," + httpPath.ToString() + "," + status + '\n';
			User.AppendFile(path.join(this.path, 'log.csv'), message, (result: boolean) => {
				if (!result)
					return false;
			});
			return true;
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
			User.AppendFile(path.join(this.path, 'content.csv'), folders.toString(), (result: boolean) => {
				if (!result)
					return false;
			});
			User.WriteFile(path.join(this.path, 'meta.json'), this.backend.ToString(), (result: boolean) => {
				if (!result)
					return false;
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
			return "{\n\t\"Name\": \"" + this.name + "\",\n\t\"Company\": \"" + this.backend.Company + "\",\n\t\"Contact\": \"" + this.backend.Contact + "\",\n\t\"Crm\": \"" + this.backend.Crm +
				"\",\n\t\"Url\": \"" + this.url + "\",\n\t\"LogUrl\": \"" + this.LogUrl + "\",\n\t\"Folders\": " + User.Print(this.folders) + ",\n\t\"FoldersUrl\": \"" + this.FoldersUrl + "\"\n}";
		}

		public static Print(folder: string[]): string {
			var result = "[\n\t";
			for (var i = 0; i < folder.length; i++)
				result += "\"" + folder[i] + "\",\n\t";
			result = result.slice(0, -3);
			return result += "\n]";
		}
		
		private static AppendFile(filePath: string, dataToAppend: string, onCompleted: (result: boolean) => void) {
			fs.appendFile(filePath, dataToAppend, 'utf-8', (error: any) => {
				if (error) {
					console.log(error);
					onCompleted(false);
				}
				else {
					console.log("Appending Done");
					onCompleted(true);
				}
			});
		}

		private static WriteFile(filePath: string, dataToWrite: string, onCompleted: (result: boolean) => void) {
			fs.writeFile(filePath, dataToWrite, 'utf-8', (error: any) => {
				if (error) {
					console.log(error);
					onCompleted(false);
				}
				else {
					console.log("Writing Done");
					onCompleted(true);
				}
			});
		}

		private static ReadFile(filePath: string, onCompleted: (result: string) => void) {
			fs.readFile(filePath, 'utf-8', (error: any, data: string) => {
				if (error) {
					console.log(error);
					onCompleted(null);
				}
				else {
					console.log(data);
					onCompleted(data);
				}
			});
		}
	}
}