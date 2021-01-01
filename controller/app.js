//Conntroller-application : interact client requests and defining webservices end points 

 //load express library
 const express = require('express');                                        
 const bodyParser = require('body-parser');                //Parse incoming request req.body for MW handlers
 
 //import model
 const userDB = require('../model/user');
 const categoryDB = require('../model/category');
 const productDB = require('../model/product');
 
 //create an express app instance
 var app=express();
 
 //---------------  apply middleware ------------------------------

 //pre-processing of data passing in from request
 var urlencodedParser = bodyParser.urlencoded({ extended: false }); //parse application/x-www-form-urlencoded
 app.use(urlencodedParser);                                         //attach body-parser middleware
 app.use(bodyParser.json());                                        //parse json & looks at requests Json Content-Type



// Defining Webservices endpoint (VERB+URL) 

//GET - end point to retrieve records of all users
app.get('/user', function(req,res){                                //get db record through user.js model

    userDB.getUsers(function(err,result){
        if (err){                                                   //if error 
            res.status(500);                                        //return err response code
            res.send(`{"message":"${err}"}`);                       //return response err message in json
        } else {                                                    //if success, display result
            res.status(200);                                        //return success response code
            res.send(`{"Users":${JSON.stringify(result)}}`);        //return response in json
        }
    });
});

//GET - WS end point to retrieve record of a user by id
app.get('/user/:userid', function(req,res){

    var userid = req.params.userid;                                 //retrieve id pass in as params from req URI
    
    userDB.getUser(userid,function(err,result){                     //get record from user.js model
        if (err){                                                   //if error
            res.status(500);                                        //return err response code
            res.send(`{"message":"${err}"}`);                       //return response err message in json
        } else {                                                    //if success
            res.status(200);                                        //return success response code
            if(Object.keys(result).length === 0){                   //if record not found, return err in json
                res.send(`{"message":"Error - user record id.${userid} not found"}`);    
            }else{
                res.send(result[0]);                                //return single record found in json
            }
        }
    });
});

//POST -end point to insert a record of user
app.post('/user', function(req,res){
    
    var username = req.body.username;                                       //retrieve user info pass from req.body
    var email = req.body.email;    
    var role = req.body.role;    
    var password = req.body.password;    

    userDB.insertUser(username,email,role,password,function(err,result){    //insert record using user.js model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(201);                                                //return success response code
            //res.send(`insert: ${result.insertId}`); 
            res.send(`{"insertId":${result.insertId}}`);                   //return record ID in json format                             
        }
    });
});

//PUT - Update user record by id
app.put('/user/:userid', function(req,res){

    var userid = req.params.userid;                                             //retrieve id pass in as params from req URI
    var email = req.body.email;                                                 //retrieve user info pass from req.body
    var password = req.body.password;                                           //retrieve password info pass from req.body

    userDB.updateUser(email,password,userid,function(err,result){      //update record using user.js model
        if (err){                                                               //if error
            res.status(500);                                                    //return err response code
            res.send(`{"message":${err}}`);                                     //return response err message in json
        } else {                                                                //if success
            res.status(200);                                                    //return success response code
            //res.send(result);  
            if (result.affectedRows === 1){                                     //if record found
                res.send(`{"updatedId":${userid}}`);   
            }else {
                res.send(`{"message":"Error - user record id.${userid} not found"}`); 
            }  
        }
    });
});

//Delete user record by id
app.delete('/user/:userid', function(req,res){

    var userid = req.params.userid;                                         //retrieve id pass in as params from req URI
    
    userDB.deleteUser(userid,function(err,result){                          //get record from user.js model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {
            res.status(200);
            if (result.affectedRows){                                       //return resp in json format 
                res.send(`{"deleted id":${userid}}`);   
            }else{                                                          //return resp in json format 
                res.send(`{"message":"Error - user record id.${userid} not found"}`); 
             }                                                    
        }
    });
});



//GET - WS end point to retrieve DB records of all categories
app.get('/category', function(req,res){                                

    categoryDB.getCategory(function(err,result){                        
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(200);                                                //return success response code
            res.send(`{"Category":${JSON.stringify(result)}}`);             //return response in json
        }
    });
});


//POST -end point to insert a record of user
app.post('/category', function(req,res){
    
    var name = req.body.name;                                               //retrieve user info pass from req.body
    var description = req.body.description;    

    categoryDB.insertCategory(name,description,function(err,result){        //insert record via model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(201);                                                //return success response code
            //res.send(`insert: ${result.insertId}`); 
            res.send(`{"insertId":${result.insertId}}`);                   //return record ID in json format                             
        }
    });
});


//PUT - Update category record by id
app.put('/category/:categoryid', function(req,res){

    var categoryid = req.params.categoryid;                                          //retrieve id pass in as params from req URI
    var name = req.body.name;                                                        //retrieve name pass from req.body
    var description = req.body.description;                                          //retrieve description pass from req.body

    categoryDB.updateCategory(name,description,categoryid,function(err,result){      //update record using user.js model
        if (err){                                                                    //if error
            res.status(500);                                                         //return err response code
            res.send(`{"message":${err}}`);                                          //return response err message in json
        } else {                                                                     //if success
            res.status(200);                                                         //return success response code
            //res.send(result);  
            if (result.affectedRows === 1){                                          //if record found
                res.send(`{"updatedId":${categoryid}}`);   
            }else {
                res.send(`{"message":"Error - record id.${categoryid} not found"}`); 
            }  
        }
    });
});


//Delete category record by id
app.delete('/category/:categoryid', function(req,res){

    var categoryid = req.params.categoryid;                                         //retrieve id pass in as params from req URI
    
    categoryDB.deleteCategory(categoryid,function(err,result){                          //get record from user.js model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {
            res.status(200);
            if (result.affectedRows){                                       //return resp in json format 
                res.send(`{"deleted id":${categoryid}}`);   
            }else{                                                          //return resp in json format 
                res.send(`{"message":"Error - record id.${categoryid} not found"}`); 
             }                                                    
        }
    });
});



//GET - end point to retrieve records of all products
app.get('/product', function(req,res){                                //get db record through user.js model

    productDB.getProducts(function(err,result){
        if (err){                                                   //if error 
            res.status(500);                                        //return err response code
            res.send(`{"message":"${err}"}`);                       //return response err message in json
        } else {                                                    //if success, display result
            res.status(200);                                        //return success response code
            res.send(`{"Users":${JSON.stringify(result)}}`);        //return response in json
        }
    });
});

//GET - WS end point to retrieve record of a user by id
app.get('/product/:productid', function(req,res){

    var productid = req.params.productid;                                 //retrieve id pass in as params from req URI
    
    productDB.getProduct(productid,function(err,result){                     //get record from user.js model
        if (err){                                                   //if error
            res.status(500);                                        //return err response code
            res.send(`{"message":"${err}"}`);                       //return response err message in json
        } else {                                                    //if success
            res.status(200);                                        //return success response code
            if(Object.keys(result).length === 0){                   //if record not found, return err in json
                res.send(`{"message":"Error - user record id.${productid} not found"}`);    
            }else{
                res.send(result[0]);                                //return single record found in json
            }
        }
    });
});

//POST -end point to insert a record of user
app.post('/product', function(req,res){
    
    var name = req.body.name;                                               //retrieve product info pass from req.body
    var description = req.body.description;    
    var price = req.body.price;    
    var imageurl = req.body.imageurl; 
    var categoryid = req.body.categoryid;     

    productDB.insertProduct(name,description,price,imageurl,categoryid,function(err,result){    //insert record using user.js model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(201);                                                //return success response code
            //res.send(`insert: ${result.insertId}`); 
            res.send(`{"insertId":${result.insertId}}`);                   //return record ID in json format                             
        }
    });
});


module.exports = app;               