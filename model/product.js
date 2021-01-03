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
                    //console.log("get product id")
                    //console.log(results)
                    console.log(results[0].productid + " " + results[0].name + " " + results[0].description + " "+ results[0].price + " " + results[0].imageurl + " " + results[0].categoryid)
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


    //Retrieve products based on substring of DESCRIPTION OR CATEGORY, SORT by price asc
    searchProduct: function (queryString, callback) {
        //inner left join category and product table w fk, and search for user's queryString in col category's name col product description
        var dbConn = db.getConnection();
        console.log("!searchProduct! " + queryString)
        dbConn.connect(function (err) {
            if (err) {                                               //if DB connection Error
                return callback(err, null)                           //return error, null result
            } else {                                                  //if DB connection Successful
                var sql =
                    `SELECT c.categoryid, c.cname,p.categoryid, p.name,p.description,p.price,p.imageurl 
                    FROM category c 
                    INNER JOIN products p USING(categoryid) 
                    WHERE (p.description LIKE ?) OR (c.cname LIKE ?) 
                    ORDER BY p.price ASC`;

                dbConn.query(sql, ["%" + queryString + "%", "%" + queryString + "%"], function (err, results) {    //execute DB query 
                    dbConn.end();                                   //release/close DB connection
                    if (err) {                                       //if DB query error    
                        console.log(err)                            //log query error
                    }
                    return callback(err, results)                   //return callback of DB query, either err or result     
                });
            }
        });
    },



    //Insert a new record of a product
    insertProduct: function (name, description, price, imageurl, categoryid, createdby, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                          //if DB connection Error
                return callback(err, null)                                                      //return error, null result
            } else {//if DB connection Successful, insert new record 
                var sql = `INSERT INTO products (name, description, price, imageurl, categoryid) 
                                VALUES(?,?,?,?,?)`;                                             //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [name, description, price, imageurl, categoryid], function (err, results) {     //execute DB query 
                    if (err) {                                                                  //if DB query error    
                        console.log(err)                                                        //log query error
                    } else {// if no error productlog history
                        //console.log("result" + results.insertId);
                        var sql1 = `INSERT INTO productlog (productid,name, description, price, imageurl, categoryid,updatedby) 
                        VALUES(?,?,?,?,?,?,?)`;                                                 //SQL query parameter statement to prevent SQLI
                        dbConn.query(sql1, [results.insertId, name, description, price, imageurl, categoryid, createdby], function (err, result1) {     //execute DB query 
                            if (err) {                                                          //if DB query error    
                                console.log(err)                                                //log query error
                            }
                        });
                    }
                    dbConn.end();
                    return callback(err, results)                                           //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Update an existing product record by id
    updateProduct: function (name, description, price, imageurl, categoryid, productid, updatedby, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                        //if DB connection Error
                return callback(err, null)                                                    //return error, null result
            } else {//if DB connection Successful,update product table
                var sql = "UPDATE products SET name=?, description=?, price=?, imageurl=?, categoryid=? WHERE productid = ?";                                                       //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [name, description, price, imageurl, categoryid, productid], function (err, results) {             //execute DB query 
                    if (err) {                                                                //if DB query error    
                        console.log(err)                                                      //log query error
                    } else { //if no error, update productlog table
                        var sql1 = `INSERT INTO productlog (productid,name, description, price, imageurl, categoryid,updatedby) 
                        VALUES(?,?,?,?,?,?,?)`;                                                 //SQL query parameter statement to prevent SQLI
                        dbConn.query(sql1, [productid, name, description, price, imageurl, categoryid, updatedby], function (err, result1) {     //execute DB query 
                            if (err) {                                                          //if DB query error    
                                console.log(err)                                                //log query error
                            }
                        });
                    }
                    dbConn.end();                                                             //release/close DB connection
                    return callback(err, results)                                             //return callback of DB query, either err or result     
                });
            }
        });
    },

    //delete a product record by id
    deleteProduct: function (productid,deletedby, callback) {
        var dbConn = db.getConnection();
        var resultx;
        dbConn.connect(function (err) {
            if (err) {                                                      //if DB connection Error
                return callback(err, null)                                  //return error, null result
            } else {                                                        //if DB connection Successful

                // readback product details for log history use
                var sql1 = "SELECT * FROM products WHERE productid=?";       //SQL query parameter statement to prevent SQLI
                dbConn.query(sql1, [productid], function (err, result1) {    //execute DB query 
                    if (err) {                                              //if DB query error    
                        console.log(err)                                    //log query error
                    }
                    resultx = result1[0];
                });

                //proceed to delete product
                var sql = "DELETE FROM products WHERE productid=?";         //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [productid], function (err, results) {    //execute DB query 
                    if (err) {                                              //if DB query error    
                        console.log(err)                                    //log query error
                    }else { //delete successful log history 
                        console.log("result1")
                        console.log(resultx)
                        var sql2 = `INSERT INTO productlog (productid,name, description, price, imageurl, categoryid,updatedby) 
                        VALUES(?,?,?,?,?,?,?)`;                                                 //SQL query parameter statement to prevent SQLI
                        dbConn.query(sql2, [resultx.productid, resultx.name, resultx.description, resultx.price, resultx.imageurl, resultx.categoryid, deletedby], function (err, result2) {     //execute DB query 
                            if (err) {                                                          //if DB query error    
                                console.log(err)                                                //log query error
                            }
                        });
                    }
                    dbConn.end();                                           //release/close DB connection
                    return callback(err, results)                           //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Retreive all product log in productlog table 
    getProductLog: function (callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                      //if DB connection Error
                return callback(err, null)                                  //return error, null result
            } else {                                                        //if DB connection Successful
                var sql = "SELECT * FROM productlog";                       //SQL query statement
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
}

module.exports = productDB;                                                 //export for use in app