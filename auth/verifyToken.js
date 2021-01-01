//middleware to verify token

var jwt=require('jsonwebtoken');            //jwt lib
var secret=require('../config');            //secret key

//middleware
var authLibrary={

    verifyToken:function(req,res,next){

        //console.log(req.headers['authorization']);
        var bearerToken=req.headers['authorization'];               //get token from header's authorization

        if(!bearerToken || !bearerToken.includes("Bearer ")){       //if no token or no "Bearer" format
            res.status(401).send(`{"message":"Not Authorized"}`);
        }else{              
            jwtToken=bearerToken.split("Bearer ")[1];               //extract jwt token 'Bearer XXXtokenXX'
            console.log(jwtToken);
            
            jwt.verify(jwtToken,secret.key,function(err,decoded){   //verify token with secret key, decoded=payload
                //console.log(err);
                //console.log(decoded);
                if(err){                                            //invalid token
                    res.status(401).send(`{"message":"Not Authorized"}`);
                }else{                                              //valid token
                    req.role=decoded.role;                          //payload is in decoded 
                    req.username=decoded.username;                  //get role and username of login
                    next();                                         //allow to pass through
                }
            });
        }
    },


    verifyAdmin:function(req,res,next){
        if(req.role=="admin")
            next();
        else{
            res.stauts(401).send(`{"Message":"Not Authorized"}`);
        }
    }
}

module.exports=authLibrary;