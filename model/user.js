// Model for retreiving records from user table in DataBase 

var db = require('./databaseConfig');                    //dB connection
var secret = require('../config');                       //load secret key
var jwt = require('jsonwebtoken');                       //import jwt

var userDB = {

    //Retreive records of all users 
    getUsers: function (callback) {                        //async function with callback
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                   //if DB connection Error
                return callback(err, null)               //return error and null result
            } else {                                      //if DB connection Successful
                var sql = "SELECT * FROM user";         //SQL query statement retreive ALL users
                dbConn.query(sql, function (err, results) { //execute DB query 
                    dbConn.end();                       //release/close DB conn after use
                    if (err) {                           //if DB query error    
                        console.log(err)                //log query error
                    }
                    return callback(err, results)        //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Retrieve record of a user by id
    getUser: function (userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                               //if DB connection Error
                return callback(err, null)                           //return error, null result
            } else {                                                  //if DB connection Successful
                var sql = "SELECT * FROM user WHERE userid=?";      //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [userid], function (err, results) {    //execute DB query 
                    dbConn.end();                                   //release/close DB connection
                    if (err) {                                       //if DB query error    
                        console.log(err)                            //log query error
                    }
                    return callback(err, results)                    //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Insert a new record of a user
    insertUser: function (username, email, role, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                       //if DB connection Error
                return callback(err, null)                                                   //return error, null result
            } else {                                                                          //if DB connection Successful
                var sql = `INSERT INTO user (username,email,role,password) 
                            VALUES(?,?,?,?)`;                                              //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [username, email, role, password], function (err, results) {     //execute DB query 
                    dbConn.end();                                                          //release/close DB connection
                    if (err) {                                                              //if DB query error    
                        console.log(err)                                                   //log query error
                    }
                    return callback(err, results)                                           //return callback of DB query, either err or result     
                });
            }
        });
    },

    //Update an existing user record by id
    updateUser: function (email, password, userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                                                       //if DB connection Error
                return callback(err, null)                                                   //return error, null result
            } else {                                                                          //if DB connection Successful
                var sql = "UPDATE user SET email=? , password=? WHERE userid = ?";                                                       //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [email, password, userid], function (err, results) {             //execute DB query 
                    dbConn.end();                                                          //release/close DB connection
                    if (err) {                                                              //if DB query error    
                        console.log(err)                                                   //log query error
                    }
                    return callback(err, results)                                           //return callback of DB query, either err or result     
                });
            }
        });
    },

    //delete a user record by id
    deleteUser: function (userid, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {                                               //if DB connection Error
                return callback(err, null)                           //return error, null result
            } else {                                                  //if DB connection Successful
                var sql = "DELETE FROM user WHERE userid=?";        //SQL query parameter statement to prevent SQLI
                dbConn.query(sql, [userid], function (err, results) {    //execute DB query 
                    dbConn.end();                                   //release/close DB connection
                    if (err) {                                       //if DB query error    
                        console.log(err)                            //log query error
                    }
                    return callback(err, results)                    //return callback of DB query, either err or result     
                });
            }
        });
    },

    //user login 
    loginUser: function (email, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//connecting to d/b encounter some error
                return callback(err, null);
            } else {
                var sql = "select * from user where email=? and password=?";

                dbConn.query(sql, [email, password], function (err, result) {

                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else { //login match
                        if (result.length == 1) {//Success loing found a matching record
                            //issue you a json web token = jwt payload - secret key - expires    
                            var token = jwt.sign({ userid:result[0].userid,username: result[0].username, role: result[0].role, email: result[0].email }, secret.key, { expiresIn: 3600 });
                            return callback(null, token);
                            //return callback(null, result);
                        } else { //login no match
                            return callback(null, null);
                        }
                    }
                });
            }

        });
    }

}

module.exports = userDB;                                            //export for use by others