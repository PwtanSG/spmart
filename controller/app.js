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

//GET -  end point to retrieve record of a user by id
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

//PUT - endpoint to Update user record by id
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

//Delete - end point to del user record by id
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

//end point to login
app.post('/user/login',function(req,res){

    var email=req.body.email;
    var password=req.body.password;

    userDB.loginUser(email,password,function(err,result){

        if(err){
            res.status(500).send(`{"message":"Error!"}`);
        }else{
            if(result==null){
                res.status(200).send(`{"message":"Login Failed"}`);
            }else{
                res.status(200).send(`{"JWT":"${result}"}`);
                //res.status(200).send(result);
            }
        }
    })
});



//GET - end point to get DB records of all categories
app.get('/category', function(req,res){                                

    categoryDB.getCategories(function(err,result){                        
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(200);                                                //return success response code
            res.send(`{"Category":${JSON.stringify(result)}}`);             //return response in json
        }
    });
});

//GET -  end point to get record of a category by id
app.get('/category/:categoryid', function(req,res){

    var categoryid = req.params.categoryid;                                 //retrieve id pass in as params from req URI
    
    categoryDB.getCategory(categoryid,function(err,result){                             //get record via model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(200);                                                //return success response code
            if(Object.keys(result).length === 0){                           //if record not found, return err in json
                res.send(`{"message":"Error - record id.${categoryid} not found"}`);    
            }else{
                res.send(result[0]);                                        //return single record found in json
            }
        }
    });
});

//GET- WS endpoint to retrieve data of all products belonging to a category id <num>
app.get('/category/:categoryid/product', function(req,res){                 

    var categoryid = req.params.categoryid;                                           //retrieve catid pass in as params from req URI

    productDB.getProductForCategory(categoryid,function(err,result){
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(200);                                                //return success response code
            if (Object.entries(result).length === 0){                       //if No return record found
                res.send(`No record found or Category id.${categoryid} does not exist`);
            }else{
                //res.send(JSON.stringify(result))
                //res.send(`{"Products":${JSON.stringify(result)}}`);        //if exist return response in json                
                res.send(JSON.stringify(result)); 
            }         
        }
    });
});


//POST -end point to insert a record of user
app.post('/category', function(req,res){
    
    var cname = req.body.name;                                               //retrieve user info pass from req.body
    var cdescription = req.body.description;    

    categoryDB.insertCategory(cname,cdescription,function(err,result){        //insert record via model
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


//PUT - end point to Update category record by id
app.put('/category/:categoryid', function(req,res){

    var categoryid = req.params.categoryid;                                          //retrieve id pass in as params from req URI
    var cname = req.body.name;                                                        //retrieve name pass from req.body
    var cdescription = req.body.description;                                          //retrieve description pass from req.body

    categoryDB.updateCategory(cname,cdescription,categoryid,function(err,result){      //update record using user.js model
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


//Delete - end point to del category record by id
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
            res.send(`{"Products":${JSON.stringify(result)}}`);        //return response in json
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
                res.send(`{"message":"Error - record id.${productid} not found"}`);    
            }else{
                res.send(result[0]);                                //return single record found in json
            }
        }
    });
});


//GET - WS end point to retrieve record of a user by id
app.get('/search', function(req,res){

    var q = req.query.q;                                            //retrieve string pass in as query from req URI
    //res.status(200);
    if (q != null){
        //res.send("search this : " + q);
        productDB.searchProduct(q,function(err,result){                     //get record from user.js model
            if (err){                                                   //if error
                res.status(500);                                        //return err response code
                res.send(`{"message":"${err}"}`);                       //return response err message in json
            } else {                                                    //if success
                res.status(200);                                        //return success response code
                if(Object.keys(result).length === 0){                   //if record not found, return err in json
                    res.send("No record found -" + q);    
                }else{
                    res.send(JSON.stringify(result));                                //return single record found in json
                }
            }
        });
    }
 
});


//POST -end point to insert a new record of product
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


//PUT - endpoint to Update product by id
app.put('/product/:productid', function(req,res){

    var productid = req.params.productid;                                       //retrieve id pass in as params from req URI
    var name = req.body.name;                                                   //retrieve info pass from req.body
    var description = req.body.description;
    var price = req.body.price;
    var imageurl = req.body.imageurl;
    var categoryid = req.body.categoryid;
    
    productDB.updateProduct(name,description,price,imageurl,categoryid,productid,function(err,result){      //update record using user.js model
        if (err){                                                               //if error
            res.status(500);                                                    //return err response code
            res.send(`{"message":${err}}`);                                     //return response err message in json
        } else {                                                                //if success
            res.status(200);                                                    //return success response code
            //res.send(result);  
            if (result.affectedRows === 1){                                     //if record found
                res.send(`{"updatedId":${productid}}`);   
            }else {
                res.send(`{"message":"Error - record id.${productid} not found"}`); 
            }  
        }
    });
});


//Delete - endpoint to del product by id
app.delete('/product/:productid', function(req,res){

    var productid = req.params.productid;                                            //retrieve id pass in as params from req URI
    
    productDB.deleteProduct(productid,function(err,result){                          //get record from user.js model
        if (err){                                                                    //if error
            res.status(500);                                                         //return err response code
            res.send(`{"message":"${err}"}`);                                        //return response err message in json
        } else {
            res.status(200);                                                         //return status ok
            if (result.affectedRows){                                                //if deleted return resp in json format 
                res.send(`{"deleted id":${productid}}`);   
            }else{                                                          //if no del, resp in json format 
                res.send(`{"message":"Error - record id.${productid} not found"}`); 
             }                                                    
        }
    });
});

module.exports = app;               