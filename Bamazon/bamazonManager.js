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
    viewProducts();
  });

  function start(res) {
      inquirer.prompt([

    {
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: ["View Products for sale", "View low inventory", "Add to Inventory", "Add New Product"]
      },
  
  ]).then(function(answer) {
    
    if (answer.task === "View Products for sale") {
      viewProducts();
    } else if(answer.task === "View low inventory") {
      lowInventory(res);
    } else if(answer.task === "Add to Inventory") {
        addInventory(res);
    } else if(answer.task === "Add New Product") {
       addProduct();
    } else{
      connection.end();
    }
  });
}

  function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        start(res);
  })
  
};

function lowInventory(response){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.table(res);
        start(response);
  })
  
};

function addInventory(res){
    inquirer.prompt([

        {
            type: "input",
            name: "moreProduct",
            message: "ID of product youd like to add more of"
            
          },
        {
            type: "input",
            name: "productQuantity",
            message: "How many?"

        }
      
      ]).then(function(answer) {
        var result = res.filter(function(row){
            return row.id == answer.moreProduct
        })[0];
        connection.query(
          "UPDATE products set ? where ? ",
          [{
            
            stock_quantity: parseInt(answer.productQuantity) + result.stock_quantity
          },
        {
            id: answer.moreProduct
        }]
          
      );
      
        viewProducts();
      })
    }

    function addProduct() {

        inquirer.prompt([

            {
                type: "input",
                name: "addProduct",
                message: "What product would you like to add?"
                
              },
            {
                type: "input",
                name: "productQuantity",
                message: "How many?"
    
            },
            {
                type: "input",
                name: "departmentName",
                message: "What department?"
    
            },
            {
                type: "input",
                name: "productPrice",
                message: "How much will you charge the customer?"
    
            }
          
          ]).then(function(answer) {
            
            connection.query(
              "INSERT INTO products SET ?",
              {
                product_name: answer.addProduct,
                stock_quantity: answer.productQuantity,
                department_name: answer.departmentName,
                customer_price: answer.productPrice,
                
              },
              function(err) {
                if (err) throw err;
                console.log("Your auction was created successfully!");
              
                viewProducts();
              }
            );
          });
    }
