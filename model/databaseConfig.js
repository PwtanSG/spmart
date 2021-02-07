//Establish connection to database
var mysql = require('mysql');                   //load mySQL library

var dbconnect = {                               //define the connection settings for mySQL DB
    getConnection: function () {
        var conn = mysql.createConnection({
            
            /*
            //Local host
            host: "localhost",
            user: "root",
            password: "12345",
            database: "spmart"
            */

            
            //AWS RDS
            host:"bdd-db.csn6grmspbkl.us-east-1.rds.amazonaws.com",
            user:"admin88",
            password:"12345678",
            database:"spmart"
            
        });    
        return conn;
    }
};
module.exports = dbconnect                      //export module for use
