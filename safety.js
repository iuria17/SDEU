"use strict";
const lineReader = require('readline').createInterface(
	{
		input: require('fs').createReadStream('eventos/eventos3.txt'),
		output: process.stdout,
		terminal:false
	}
);

let ignored = new Set();
let reads = new Set();
let nw = 0;
let writes = {};
lineReader.on('line',function(line){
	let event = JSON.parse(line)
	let result = "good"
	let id = event.id +"_"+ event.	n
	
	if (event.op == "put" && event.tipo_e == "inv") {
		nw++
		ignored = new Set([...ignored, ...reads])
		writes[event.valor] = { "s" : "0", "f" : "0"};
		writes[event.valor].s = event.t
	}
	else if (event.op == "put" && event.tipo_e == "res") {
		nw--;
		writes[event.valor].f = event.t
		for (var write in writes) {
			if (write.s < event.t) {
				delete writes[write]
			}
		}
	}
	else if (event.op == "get" && event.tipo_e == "inv") {
		reads.add(id)
		if (nw > 0) {
			ignored.add(id)
		}
		console.log("Result for event:", id, "is", result)
	}
	else if (event.op == "get" && event.tipo_e == "res") {
		reads.delete(id)
		if (ignored.has(id)) {
			ignored.delete(id)
		} else {
			if (writes[event.valor]) {
				for (var write in writes) {
					if (write != event.valor) {
						delete writes[write]
					}
				}
			} else {
				result = "bad"
			}
		}
		console.log("Result for event:", id, "is", result)
	}
});
