var https = require('https');
var fs = require('fs');
var dominos = require('dominos');
dominos.store.menu(
	7144, //storeID
	function(storeID){
		var input = "canadian";
		input = input.toLowerCase();
		//console.log(storeID.result.PreconfiguredProducts);
		var output = [];
		//Convert complex object into a more usable array.
		
		var arr = Object.keys(storeID.result.PreconfiguredProducts).map(function (key) {return storeID.result.PreconfiguredProducts[key]});
		for(var i = 0; i < arr.length; i++){
			if (arr[i].Name.toLowerCase().indexOf(input) != -1) {
				output.push(arr[i].Name);
			}
		}

		console.log(output);
	}
);