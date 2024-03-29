//Conntroller-application : interact client requests and defining webservices end points 

 //load express library
 const express = require('express');       
  //create an express app instance
 var app=express();
                                  
 const bodyParser = require('body-parser');                //Parse incoming request req.body for MW handlers
 
 //import model
 const userDB = require('../model/user');
 const categoryDB = require('../model/category');
 const productDB = require('../model/product');

 //import token verification library
 const authLibrary = require('../auth/verifyToken');

 //import validator library
 const validateLibrary = require('../validate/validateLib')
 
 //import cross origin policy lib
 var cors= require('cors');

 //import aws sdk 
 var aws = require('aws-sdk')
//import multer for upload image
var multer  = require('multer')
var multerS3 = require('multer-s3')

//configure aws s3 upload
aws.config.update({
    secretAccessKey: '',
    accessKeyId:'',
    region: 'us-east-1'
});
var s3 = new aws.S3();

const upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:'bdd-image',
        acl: 'public-read',
        metadata:function(req, file, cb){
            cb(null,{fieldname: 'TESTING_META_DATA'});
        },
        key:function(req,file,cb){
            cb(null,file.originalname)
        }
    })
})

/*
//multer define upload product image's local server location and using original filename
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //cb(null, './upload')
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
//multer define file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


var upload = multer({ storage: storage, fileFilter: fileFilter })
*/



 //enable cors for all origins:
 app.options('*', cors()); 
 app.use(cors());

 //---------------  apply middleware ------------------------------

 //pre-processing of data passing in from request
 var urlencodedParser = bodyParser.urlencoded({ extended: false }); //parse application/x-www-form-urlencoded
 app.use(urlencodedParser);                                         //attach body-parser middleware
 app.use(bodyParser.json());                                        //parse json & looks at requests Json Content-Type

 
// Defining Webservices endpoint (VERB+URL) 

app.get('/', function (req, res) {
    res.send('Hello! this is a web api for BDD CA2');
});

//GET - (Admin ONLY) end point to retrieve records of all users
app.get('/user',authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){                                //get db record through user.js model

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

//GET -  (Only Admin for all id. For member ONLY his own Id ) end point to retrieve record of a user by id
app.get('/user/:userid', authLibrary.verifyToken, authLibrary.verifyAdminOrUserId, function(req,res){

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
app.post('/user', validateLibrary.validateUserRegistration, function(req,res){
    
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

//PUT - (Admin-for all user, For user only his ID )endpoint to Update user record by id
app.put('/user/:userid',authLibrary.verifyToken, authLibrary.verifyAdminOrUserId, function(req,res){

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
                res.send(`{"message": user record id.${userid} not found"}`); 
            }  
        }
    });
});

//Delete - (Admin ONLY) end point to del user record by id
app.delete('/user/:userid',authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){

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

//GET- endpoint to retrieve data of all products belonging to a category id <num>
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


//POST - (Admin ONLY) end point to insert a record of user
app.post('/category', authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){
    
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


//PUT - (Admin ONLY) end point to Update category record by id
app.put('/category/:categoryid', authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){

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


//Delete - (Admin ONLY) end point to del category record by id
app.delete('/category/:categoryid', authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){

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
app.get('/product', function(req,res){                                  //get db record through user.js model

    productDB.getProducts(function(err,result){
        if (err){                                                       //if error 
            res.status(500);                                            //return err response code
            res.send(`{"message":"${err}"}`);                           //return response err message in json
        } else {                                                        //if success, display result
            res.status(200);                                            //return success response code
            res.send(`{"Products":${JSON.stringify(result)}}`);         //return response in json
        }
    });
});


//GET - (Admin ONLY )end point to retrieve records of productlog history
app.get('/product/productlog', authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){                                //get db record through user.js model

    productDB.getProductLog(function(err,result){
        if (err){                                                   //if error 
            res.status(500);                                        //return err response code
            res.send(`{"message":"${err}"}`);                       //return response err message in json
        } else {                                                    //if success, display result
            res.status(200);                                        //return success response code
            res.send(`{"Logs":${JSON.stringify(result)}}`);        //return response in json
        }
    });
});


//GET - end point to retrieve record of a user by id
//app.get('/search', function(req,res){
app.get('/product/search', function(req,res){

    var q = req.query.q;                                                    //retrieve string pass in as '?' query from req URI
    //res.status(200);
    if (q != null){
        //res.send("search this : " + q);
        productDB.searchProduct(q,function(err,result){                     //get record from user.js model
            if (err){                                                       //if error
                res.status(500);                                            //return err response code
                res.send(`{"message":"${err}"}`);                           //return response err message in json
            } else {                                                        //if success
                res.status(200);                                            //return success response code
                if(Object.keys(result).length === 0){                       //if record not found, return err in json
                    res.send("No record found -" + q);    
                }else{
                    res.send(JSON.stringify(result));                       //return single record found in json
                }
            }
        });
    }
 
});

//GET - end point to retrieve record of a product by id
app.get('/product/:productid', function(req,res){

    var productid = req.params.productid;                                   //retrieve id pass in as params from req URI
    
    productDB.getProduct(productid,function(err,result){                    //get record from user.js model
        if (err){                                                           //if error
            res.status(500);                                                //return err response code
            res.send(`{"message":"${err}"}`);                               //return response err message in json
        } else {                                                            //if success
            res.status(200);                                                //return success response code
            if(Object.keys(result).length === 0){                           //if record not found, return err in json
                res.send(`{"message":"Error - record id.${productid} not found"}`);    
            }else{
                res.send(result[0]);                                        //return single record found in json
            }
        }
    });
});

//Upload route
app.post('/product/upload',authLibrary.verifyToken, authLibrary.verifyAdmin, upload.single('image'), (req, res) => {
    console.log("uploading")
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});

//POST - (Admin ONLY) end point to insert a new record of product
app.post('/product', authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){
    
    var name = req.body.name;                                               //retrieve product info pass from req.body
    var description = req.body.description;    
    var price = req.body.price;    
    var imageurl = req.body.imageurl; 
    var categoryid = req.body.categoryid;
    var createdby = "Created by " + req.username;                           //for productlog history who created

    productDB.insertProduct(name,description,price,imageurl,categoryid,createdby,function(err,result){    //insert record using user.js model
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


//PUT - (Admin ONLY) endpoint to Update product by id
app.put('/product/:productid',authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){

    var productid = req.params.productid;                                       //retrieve id pass in as params from req URI
    var name = req.body.name;                                                   //retrieve info pass from req.body
    var description = req.body.description;
    var price = req.body.price;
    var imageurl = req.body.imageurl;
    var categoryid = req.body.categoryid;
    var updatedby = "Updated by " + req.username;                               //for productlog hist who updated
    
    productDB.updateProduct(name,description,price,imageurl,categoryid,productid,updatedby,function(err,result){      //update record using user.js model
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


//Delete - (Admin ONLY) endpoint to del product by id
app.delete('/product/:productid', authLibrary.verifyToken, authLibrary.verifyAdmin, function(req,res){

    var productid = req.params.productid;                                            //retrieve id pass in as params from req URI
    var deletedby = "Deleted by " + req.username;                                    //for productlog history who created

    productDB.deleteProduct(productid,deletedby,function(err,result){                          //get record from user.js model
        if (err){                                                                    //if error
            res.status(500);                                                         //return err response code
            res.send(`{"message":"${err}"}`);                                        //return response err message in json
        } else {
            res.status(200);                                                         //return status ok
            if (result.affectedRows){                                                //if deleted return resp in json format 
                res.send(`{"deleted id":${productid}}`);   
            }else{                                                                   //if no del, resp in json format 
                res.send(`{"message":"Error - record id.${productid} not found"}`); 
             }                                                    
        }
    });
});



module.exports = app;               