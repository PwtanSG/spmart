// Model for retreiving DB records from category table

var db = require('./databaseConfig')                                        //dB connection


var categoryDB = {                                                          //async function with callback

    //Retreive records in Category table 
    getCategories: function (callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                      //if DB connection Error
                return callback(err, null)                                  //return error, null result
            } else {                                                        //if DB connection Successful
                var sql = "SELECT * FROM category";                         //SQL query statement
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

    //Retrieve record of a category by id
    getCategory: function (categoryid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                               //if DB connection Error
                return callback(err, null)                           //return error, null result
            } else {                                                  //if DB connection Successful
                var sql = "SELECT * FROM category WHERE categoryid=?";      //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [categoryid], function (err, results) {    //execute DB query 
                    dbConn.end();                                   //release/close DB connection
                    if (err) {                                       //if DB query error    
                        console.log(err)                            //log query error
                    }
                    return callback(err, results)                    //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Insert a new record into category
    insertCategory: function (cname, cdescription, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                               //if DB connection Error
                return callback(err, null)                                           //return error, null result
            } else {                                                                 //if DB connection Successful
                var sql = `INSERT INTO category (cname,cdescription) 
                                VALUES(?,?)`;                                        //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [cname, cdescription], function (err, results) {     //execute DB query 
                    dbConn.end();                                                    //release/close DB connection
                    if (err) {                                                       //if DB query error    
                        console.log(err)                                             //log query error
                    }
                    return callback(err, results)                                    //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Update an existing user record by id
    updateCategory: function (cname, cdescription, categoryid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                        //if DB connection Error
                return callback(err, null)                                                    //return error, null result
            } else {                                                                          //if DB connection Successful
                var sql = "UPDATE category SET cname=?, cdescription=? WHERE categoryid = ?";                                                       //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [cname, cdescription, categoryid], function (err, results) {    //execute DB query 
                    dbConn.end();                                                             //release/close DB connection
                    if (err) {                                                                //if DB query error    
                        console.log(err)                                                      //log query error
                    }
                    return callback(err, results)                                             //return callback of DB query, either err or result     
                });
            }
        });
    },

    //delete a category record by id
    deleteCategory: function (categoryid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                       //if DB connection Error
                return callback(err, null)                                   //return error, null result
            } else {                                                          //if DB connection Successful
                var sql = "DELETE FROM category WHERE categoryid=?";        //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [categoryid], function (err, results) {          //execute DB query 
                    dbConn.end();                                           //release/close DB connection
                    if (err) {                                               //if DB query error    
                        console.log(err)                                    //log query error
                    }
                    return callback(err, results)                            //return callback of DB query, either err or result     
                });
            }
        });
    }

}

module.exports = categoryDB;                                //export for use in app