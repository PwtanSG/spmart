/*
//To start server and listen for request
const path = require('path');


// import express app
const app = require('./controller/app') 

//define port /hostname of server port 443 for https
var port=8081;
var hostname="localhost";

//listen to request
app.listen(port, hostname, (err) => {
    err ?  console.log(err) : console.log(`Server started and accessible via http://${hostname}:${port}/`);
});
*/

var app=require('./controller/app.js');

var port=8081;

var server=app.listen(port,function(){

    console.log("Web App hosted t http://localhost:%s",port);
});