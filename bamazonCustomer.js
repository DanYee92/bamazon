//NPM packages
var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');

var resString = '';
var resJSON = '';

var columns = ['item_id', 'product_name','department_name','price','stock_quantity'];

	//establish connection
	var connection = mysql.createConnection({
		host		:'localHost',
		user		:'root',
		password	:'root',
		port		:'3306',
		database  	:'bamazonDB'
	});

// Check to see if connection is successful
connection.connect(function(err){
	if(err) throw err;
	console.log('connect in id' , connection.threadId);
	displayTable();
});
// Query Data
function displayTable() {

	var query = 'SELECT * FROM products';
		connection.query(query,function(err,res,fields) {
			if(err) throw err;
			//Converts to string
			resString = JSON.stringify(res,null,2);
			//Convert to JSON
			resJSON  = JSON.parse(resString);
			//Testing
			var table = new Table({
			    head: ['item_id', 'product_name','department_name','price','stock_quantity'],
			    colWidths: [25, 25, 25 ,25 ,25]
			});
			for(var i = 0; i < resJSON.length; i++) {
				//Creates a new array
				var newArray = new Array();
				//adds content to table
				table.push(newArray);
				//Adds content to new array of Nth row
				for(var j = 0; j < columns.length; j++){
					newArray.push(resJSON[i][columns[j]]);
				}
			}
			//Displays Table in terminal
			console.log(table.toString());
			customerRequest();
		});

}

function customerRequest() {
	//Ask customer for id input
	inquirer.prompt([
				{
					type:'input',
					name: 'id',
					message: 'What is the ID of the product you would like to buy?',
					validate: function(value) {
						var valid = !isNaN(parseFloat(value));
						return valid || 'Please enter a number';
					}
				},
				{
					type:'input',
					name:'quantity',
					message:'How many would you like to buy?',
					validate: function(value) {
						var valid = !isNaN(parseFloat(value));
						return valid || 'Please enter a number';
					}
				}
	])
	.then(function(answer) {
		checkQuantity(answer.id, answer.quantity);
	});
}

function checkQuantity(id, quantity) {
	var query = "SELECT stock_quantity FROM products WHERE ?"

	connection.query(query,{
		item_id: id
	},
	function(err,res,fields) {
		if(err) throw err;
		var stockJSON = JSON.stringify(res,null,2);
		var stockParsed = JSON.parse(stockJSON);
		var stockQuantity = stockParsed[0].stock_quantity;

		//If quantity in Database is greater then users quantity request ....
		if(stockQuantity >= quantity) {
			var query = 'UPDATE products SET ? WHERE ?'
			//Update database
			connection.query(query,[
			{
				//Subtract quantity in database from users request quantity
				stock_quantity: stockQuantity - quantity
			},
			{
				//product id
				item_id: id

			}], function(err,res,fields){
				promptBool = false;
				displayTable();
			});
		}
		else {
			console.log('Insufficient quantity!');
		}
	});
}
