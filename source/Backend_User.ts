/// <reference path="../typings/node/node.d.ts" />

module Exclusive {
	export class Backend_User {
		private company: string;
		get Company() { return this.company; }
		set Company(value: string) { this.company = value; }

		private contact: string;
		get Contact() { return this.contact; }
		set Contact(value: string) { this.contact = value; }

		private crm: string;
		get Crm() { return this.crm; }
		set Crm(value: string) { this.crm = value; }

		constructor();
		constructor(company: string, contact: string, crm: string);
		constructor(company?: string, contact?: string, crm?: string) {
			(company) ? this.company = company : this.company = "";
			(contact) ? this.contact = contact : this.contact = "";
			(crm) ? this.crm = crm : this.crm = "";
		}

		public static ReadBackend(userPath: string, onCompleted: (result: Backend_User) => void) {
			fs.readFile(path.join(userPath, 'meta.json'), 'utf-8', (error: any, data: string) => {
				if (!error) {
					console.log(data);
					var jsonObject = JSON.parse(data);
					onCompleted(new Backend_User(jsonObject.company, jsonObject.contact, jsonObject.crm));
				} else {
					console.log(error);
					onCompleted(null);
				}
			});
		}

		public ToString(): string {
			return "{\n\t\"company\": \"" + this.company + ",\n\t\"contact\": \"" + this.contact + ",\n\t\"crm\": \"" + this.crm + "\n}";
		}
		
	}
}