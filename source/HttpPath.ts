/// <reference path="../typings/node/node.d.ts" />

module Exclusive{
	export class HttpPath{
		private head: string;
		private tail: HttpPath;
		
		get Head(){return this.head;}
		set Head(value: string){this.head = value;}
		
		get Tail(){return this.tail;}
		set Tail(value: HttpPath){this.tail = value;}
		
		constructor();
		constructor(head: string, tail: HttpPath);
		constructor (head?: string, tail?: HttpPath){
			(head) ? this.head = head : this.head = "";
			(tail) ? this.tail = tail : this.tail = null;
		}
		
		public ToString(): string
		{
			return (this.Tail) ? this.Head + "/" + this.Tail.ToString() : this.Head;
		}
		
		public static Build(url: string): HttpPath {
			var result = new HttpPath();
			var i: number;
			
			(url[0] == "/") ? i=1: i=0;
			while(url[i] != "/" && i < url.length){
				result.Head += url[i];
				i++; 
			}
			
			if (i < url.length){
				var newUrl = "";
				while (i < url.length){
					newUrl += url[i];
					i++;
					}
				result.Tail = HttpPath.Build(newUrl);
			}
			return result;
		}
	}
}