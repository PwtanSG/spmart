var jwt = require('jsonwebtoken');            //use jwt lib
var secret = require('../config');            //secret key

//middlewares to verify token and authorization
var authLibrary = {

    // method to retrieve token from header, deconstruct token to get role and username
    verifyToken: function (req, res, next) {

        //console.log(req.headers['authorization']);
        var bearerToken = req.headers['authorization'];               //get token from header's authorization

        if (!bearerToken || !bearerToken.includes("Bearer ")) {       //if no token or no "Bearer" format
            res.status(401).send(`{"message":"Not Authorized"}`);
        } else {
            jwtToken = bearerToken.split("Bearer ")[1];               //extract jwt token 'Bearer XXXtokenXX'
            //console.log(jwtToken);

            jwt.verify(jwtToken, secret.key, function (err, decoded) {   //verify token with secret key, decoded=payload
                //console.log(err);
                console.log(decoded);
                if (err) {                                            //invalid token
                    res.status(401).send(`{"message":"Not Authorized"}`);
                } else {                                              //valid token
                    req.userid = decoded.userid;
                    req.username = decoded.username;                  //get role and username of login
                    req.role = decoded.role;                          //payload's role,username is in decoded 
                    next();                                           //allow to proceed to next MW
                }
            });
        }
    },

    //method to authorize if login user's role = Admin
    verifyAdmin: function (req, res, next) {
        if (req.role == "admin") {
            //console.log(req)
            next();
        }
        else {
            res.status(401).send(`{"Message":"Not Authorized"}`);
        }
    },

    //method to authorize if user role = Admin OR Login user id = userid's record 
    verifyAdminOrUserId: function (req, res, next) {
        var userid = req.params.userid;     
        //console.log("userid:" + userid);
        if ((req.role == "admin") || (req.userid == userid)) {
            console.log(req)
            next();
        }
        else {
            res.status(401).send(`{"Message":"Not Authorized"}`);
        }
    }
}

module.exports = authLibrary;