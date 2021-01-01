//Establish connection to database
var mysql = require('mysql');                   //load mySQL library

var dbconnect = {                               //define the connection settings for mySQL DB
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "12345",
            database: "spmart"
        });    
        return conn;
    }
};
module.exports = dbconnect                      //export module for use
