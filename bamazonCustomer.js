//NPM packages
var mysql = require('mysql');
var inquirer = require('inquirer');



 var columns = ['item_id', 'product_name','department_name','price','stock_quantity'];

	//establish connection
	var connection = mysql.createConnection({
		host		:'localHost',
		user		:'root',
		password	:'root',
		port		:3306,
		database  	:'bamazon'
	});

// Check to see if connection is successful
connection.connect(function(err){
	if(err) throw err;
	console.log('connection successful');
	displayTable();
});

//collect the data and print it to the screen
function displayTable(){
	connection.query("SELECT * FROM products", function(err, res){
		for (var i=0;i<res.length;i++){
			console.log(res[i].id+" | "+res[i].product_name+" | "+ res[i].department_name+" | "+res[i].price+" | "+res[i].stock_quantity+"\n");
		}
		customerRequest(res);
	})
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
		id: id
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
				id: id

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
