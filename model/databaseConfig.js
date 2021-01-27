//Establish connection to database
var mysql = require('mysql');                   //load mySQL library

var dbconnect = {                               //define the connection settings for mySQL DB
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            //host: "aanagn8dxnryh5.c747wvhzkqny.us-east-2.rds.amazonaws.com", //rds in aws
            user: "root",
            password: "12345",
            database: "spmart"
        });    
        return conn;
    }
};
module.exports = dbconnect                      //export module for use
