/// <reference path="../typings/node/node.d.ts" />

module Exclusive{
	export class Backend_User{
		private company: string;
		get Company(){return this.company;}
		set Company(value: string){this.company = value;}
		
		private contact: string;
		get Contact(){return this.contact;}
		set Contact(value: string){this.contact = value;}
		
		private crm: string;
		get Crm(){return this.crm;}
		set Crm(value: string){this.crm = value;}
		
		constructor();
		constructor(company: string, contact: string, crm: string);
		constructor(company?: string, contact?: string, crm?: string){
			(company) ? this.company = company : this.company = "";
			(contact) ? this.contact = contact : this.contact = "";
			(crm) ? this.crm = crm : this.crm = "";
		}
		
		public static ReadBackend(userPath: string): Backend_User{
			var result: Backend_User;
			fs.open(userPath, 'r', (error: any, fd: any) => {
				if (!error){
					fs.readFile(path.join(userPath, 'meta.json'), 'utf-8', (err: any, data: any) => {
						if (!err){
							var jsonObject = JSON.parse(data);
							result = new Backend_User(jsonObject.company, jsonObject.contact, jsonObject.crm);
						}
						else
							console.log(err);
					});
				}
			});
			//result = new Backend_User("IMINT AB", "molham.khalil@vidhance.com", "https://www.imint.highrisehq.com/people/");
			return result;
		}
		
		public ToString(): string {
			return "{\n\"company\": \"" + this.company + ",\n\"contact\": \"" + this.contact + ",\n\"crm\": \"" + this.crm + "\n}";
		}
	}
}