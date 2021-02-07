// Model for retreiving records from user table in DataBase 

var db = require('./databaseConfig');                    //dB connection
var secret = require('../config');                       //load secret key
var jwt = require('jsonwebtoken');                       //import jwt
var bcrypt = require('bcryptjs');                         //bcrypjs for hashing pw

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
                console.log(err)
                return callback(err, null)                           //return error, null result
            } else {  
                console.log("connected!")                                                //if DB connection Successful
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
            } else {                                                                        //if DB connection Successful
                bcrypt.hash(password, 10, function (err, hash) {                            // 10 digit hash the original password

                    password = hash;
                    if (err) {
                        return callback(err, null);
                    }
                    var sql = `INSERT INTO user (username,email,role,password) 
                    VALUES(?,?,?,?)`;                                                           //SQL query parameter statement to prevent SQLI
                    dbConn.query(sql, [username, email, "user", password], function (err, results) {     //execute DB query 
                        dbConn.end();                                                          //release/close DB connection
                        if (err) {                                                              //if DB query error    
                            console.log(err)                                                   //log query error
                        }
                        return callback(err, results)                                           //return callback of DB query, either err or result     
                    });
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
                bcrypt.hash(password, 10, function (err, hash) {                             // 10 digit hash the password user entered
                    
                    password = hash;
                    if (err) {
                        return callback(err, null);
                    }

                    var sql = "UPDATE user SET email=? , password=? WHERE userid = ?";          //SQL query parameter statement to prevent SQLI
                    dbConn.query(sql, [email, password, userid], function (err, results) {      //execute DB query 
                        dbConn.end();                                                           //release/close DB connection
                        if (err) {                                                              //if DB query error    
                            console.log(err)                                                    //log query error
                        }
                        return callback(err, results)                                           //return callback of DB query, either err or result     
                    });

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
                var sql = "select * from user where email=?";

                dbConn.query(sql, [email, password], function (err, result) {

                    dbConn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else { //login match
                        if (result.length == 1) {//Success loing found a matching record
                            var hashPwd = result[0].password;   //load hash password dB 
                            // compare password(user input) with hash pwd in dB
                            bcrypt.compare(password, hashPwd, function (err, success) {
                                if (err || !success) {              //err or fail when decrypt hash
                                    return callback(err, null);
                                } else {
                                    //password issue you a json web token = jwt payload - secret key - expires    
                                    var token = jwt.sign({ userid: result[0].userid, username: result[0].username, role: result[0].role, email: result[0].email }, secret.key, { expiresIn: 14400 });
                                    return callback(null, token);
                                }
                            });
                        } else { //login password not match records
                            return callback(null, null);
                        }
                    }
                });
            }

        });
    }

}

module.exports = userDB;                                            //export for use by others