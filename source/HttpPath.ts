/// <reference path="../typings/node/node.d.ts" />

module Exclusive{
	export class HttpPath{
		private head: string;
		private tail: HttpPath;
		
		get Head(){return this.head;}
		set Head(value: string){this.head = value;}
		
		get Tail(){return this.tail;}
		set Tail(value: HttpPath){this.tail = value;}
		
		constructor (head: string, tail: HttpPath){
			this.head = head;
			this.tail = tail;
		}
	}
}