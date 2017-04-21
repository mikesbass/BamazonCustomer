// mySQL database script

// Create database Bamazon;

// USE Bamazon;

// CREATE TABLE products (
  
//   item_Id INTEGER(11) auto_increment,
//   product_name VARCHAR(100) NULL,
//   department_name VARCHAR(100) NULL,
//   price DECIMAL(10,2) NOT NULL,
//   stock_quantity INTEGER(4) NOT NULL,
//   PRIMARY KEY (item_Id)
// );

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Milk", "Dairy", 04.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Bell Pepper", "Produce", 2.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Lay's Chips Family", "Snack", 06.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Apples", "Fruit", 03.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Beef", "Meat", 04.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Celery", "Produce", 01.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Onions", "Produce", 08.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Watermelon", "Fruit", 05.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("Spaghetti", "Pasta", 02.00, 20);

// INSERT INTO products (product_name, department_name, price, stock_quantity)
// VALUES ("T-bone Steak", "Meat", 16.00, 20);

//Requiring the necessary node packages

var mysql = require("mysql");
var prompt = require("prompt");

// Connection to the Bamazon database.
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'John3:16',
  database: 'Bamazon'
});

var execute = function(){

	connection.query("SELECT * FROM Products", function(err, result) {
		return (prettyTable(result));
	  
	  });

	setTimeout(function() {
	    prompt.get(['ItemID', 'Quantity'], function (err, result) {
		    var shopperItem = result.ItemID;
		    var shopperQuantity =result.Quantity;

		    inventoryCheck(shopperItem, shopperQuantity);
		    setTimeout(function() {execute();}, 3500);

		});
	}, 750);
}

//Out of stock function.

var inventoryCheck = function (id, quantity){
	connection.query('SELECT * FROM Products WHERE item_Id = ' + id, function (err, result){
		if (err) throw err;

		var total = result[0].price * quantity;

		var inventory = result[0].stock_quantity - quantity;

		if (inventory < 0){
			console.log('Insufficient stock. There are only '+ result[0].stock_quantity + 'item(s) left.');
		} else {
			console.log('User has bought ' + quantity + ' ' + result[0].product_name + ' for $' + total);
			console.log('There are ' + inventory + ' ' + result[0].product_name + ' remaining.')
			databaseUpdate(id, inventory)
		}
	});
}

// Updating the database after a sale. 

var databaseUpdate = function(id, quantity){
	connection.query('update products set stock_quantity = ' + quantity + ' where item_Id = ' + id, function(err, result) {
        if (err) throw err;
    });
}

function prettyTable(items){
	for (var i = 0; i < items.length; i++) {
		console.log('------------------------');
		console.log('ItemID: ' + items[i].item_Id);
		console.log('Item: ' + items[i].product_name);
		console.log('Department: ' + items[i].department_name);
		console.log('Price: $' + items[i].price);
	}
	console.log('------------------------');
}


// Connecting to the Bamazon Database.
connection.connect(function(err) {
    if (err) {
		console.error('error connecting: ' + err);
	    return;
	}
});

//Do it...
execute();