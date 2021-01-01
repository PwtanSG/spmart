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

    //Method to get all products by category number (fk ref category table) 
    getProductForCategory: function (categoryid, callback) {

        var dbConn = db.getConnection();                                //connecting to DB
        dbConn.connect(function (err) {
            if (err) {                                                   //if DB connection Error
                return callback(err, null)                               //return error, null result
            } else {                                                      //if DB connection Successful
                var sql =
                    `SELECT c.categoryid, c.cname, p.productid,p.name,p.description,p.price,p.imageurl 
                FROM category c, products p    
                WHERE c.categoryid=p.categoryid and p.categoryid=?
                ORDER BY p.price ASC`;                                      //prep-stmt query join 2 table with fk, param to prevent SQL
                dbConn.query(sql, [categoryid], function (err, results) {    //execute DB query 
                    dbConn.end();                                       //release/close DB connection
                    if (err) {                                           //if DB query error    
                        console.log(err)                                //log query error
                    }
                    return callback(err, results)                        //return callback of DB query, either err or result     
                });
            }
        });
    },


    //Retrieve record of a product by id
    searchProduct: function (queryString, callback) {
        //var qString = CONCAT("%", "?" , "%");
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                               //if DB connection Error
                return callback(err, null)                           //return error, null result
            } else {                                                  //if DB connection Successful
                var sql = "SELECT c.categoryid, c.cname category,p.categoryid, p.name,p.description products FROM category c INNER JOIN products p USING(categoryid) WHERE (p.description LIKE ?) OR (c.cname LIKE ?)";
                //var sql = `SELECT c.categoryid, c.cname category,p.categoryid, p.name,p.description products FROM category c INNER JOIN products p USING(categoryid) WHERE (p.description LIKE ${qString}) OR (c.cname LIKE ${qString})`;
                dbConn.query(sql,["%"+queryString+"%","%"+queryString+"%"],function (err, results) {    //execute DB query 
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

    //Update an existing product record by id
    updateProduct: function (name, description, price, imageurl, categoryid, productid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                        //if DB connection Error
                return callback(err, null)                                                    //return error, null result
            } else {                                                                          //if DB connection Successful
                var sql = "UPDATE products SET name=?, description=?, price=?, imageurl=?, categoryid=? WHERE productid = ?";                                                       //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [name, description, price, imageurl, categoryid, productid], function (err, results) {             //execute DB query 
                    dbConn.end();                                                             //release/close DB connection
                    if (err) {                                                                //if DB query error    
                        console.log(err)                                                      //log query error
                    }
                    return callback(err, results)                                             //return callback of DB query, either err or result     
                });
            }
        });
    },

    //delete a product record by id
    deleteProduct: function (productid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                      //if DB connection Error
                return callback(err, null)                                  //return error, null result
            } else {                                                        //if DB connection Successful
                var sql = "DELETE FROM products WHERE productid=?";          //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [productid], function (err, results) {    //execute DB query 
                    dbConn.end();                                           //release/close DB connection
                    if (err) {                                              //if DB query error    
                        console.log(err)                                    //log query error
                    }
                    return callback(err, results)                           //return callback of DB query, either err or result     
                });
            }
        });
    }

}

module.exports = productDB;                                                 //export for use in app