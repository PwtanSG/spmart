// Model for retreiving DB records from product table

var db = require('./databaseConfig')                                        //dB connection



var productDB = {                                                          //async function with callback

    //Retreive all records in products table 
    getProducts: function (callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                      //if DB connection Error
                return callback(err, null)                                  //return error, null result
            } else {                                                        //if DB connection Successful
                var sql = "SELECT * FROM products";                         //SQL query statement
                dbConn.query(sql, function (err, results) {                 //execute DB query 
                    dbConn.end();                                           //release/close DB connection
                    if (err) {                                              //if DB query error    
                        console.log(err)                                    //log query error
                    }
                    return callback(err, results)                           //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Retrieve record of a product by id
    getProduct: function (productid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                               //if DB connection Error
                return callback(err, null)                           //return error, null result
            } else {                                                  //if DB connection Successful
                var sql = "SELECT * FROM products WHERE productid=?";      //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [productid], function (err, results) {    //execute DB query 
                    dbConn.end();                                   //release/close DB connection
                    if (err) {                                       //if DB query error    
                        console.log(err)                            //log query error
                    }
                    return callback(err, results)                    //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Insert a new record of a product
    //name,description,price,imageurl,categoryid
    insertProduct: function (name, description, price, imageurl, categoryid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                       //if DB connection Error
                return callback(err, null)                                                   //return error, null result
            } else {                                                                          //if DB connection Successful
                var sql = `INSERT INTO products (name, description, price, imageurl, categoryid) 
                                VALUES(?,?,?,?,?)`;                                              //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [name, description, price, imageurl, categoryid], function (err, results) {     //execute DB query 
                    dbConn.end();                                                          //release/close DB connection
                    if (err) {                                                              //if DB query error    
                        console.log(err)                                                   //log query error
                    }
                    return callback(err, results)                                           //return callback of DB query, either err or result     
                });
            }
        });
    },
}

module.exports = productDB;                                //export for use in app