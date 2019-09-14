var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",

  password: "football92",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);

    inquirer
      .prompt([
        {
          type: "input",
          name: "product",
          message: "What is the ID for the product you want to purchase?"
        },

        {
          type: "input",
          name: "quantity",
          message: "How many would you like to purchase?"
        }
      ])
      .then(function(answer) {
        var result = res.filter(function(row) {
          return row.id == answer.product;
        })[0];

        console.log(result);
        console.log(answer);
        var stk_value = result.stock_quantity - parseInt(answer.quantity);

        console.log(stk_value);

        if (stk_value > 0) {
          connection.query("UPDATE products set ? where ? ", [
            {
              stock_quantity: stk_value
            },
            {
              id: answer.product
            }
          ]);
          console.log("Thank you for your purchase!");
        } else {
          console.log("Not enough in stock");
          afterConnection();
        }

        afterConnection();
      });
  });
}
