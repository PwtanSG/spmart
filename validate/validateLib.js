//middleware to validate user input

const validator = require('validator');                       //import validator 
var validateLib = {

    validateUserId: function (req, res, next) {

        var userid = req.params.userid;

        var pattern = new RegExp(`^[1-9][0-9]*$`);

        if (pattern.test(userid)) {

            next();
        } else {

            res.status(500);
            res.send(`{"Message":"Invalid Input Data"}`);
        }

    },

    validateUserRegistration: function (req, res, next) {

        var username = req.body.username;
        var email = req.body.email;
        var role = req.body.role;
        var password = req.body.password;

        var patternName = new RegExp(`^[a-zA-Z0-9 ]+$`);


        if (patternName.test(username) && validator.isEmail(email)
            && (role == "admin" || role == "user") && validator.isAlphanumeric(password) && password.length >= 8) {
            next();
        } else {
            res.status(500);
            res.send(`{"Message":"Invalid Input Data"}`);
        }
    },

    validateInsertProduct: function (req, res, next) {

        var name = validator.escape(req.body.name);                                               //retrieve product info pass from req.body
        var description = validator.escape(req.body.description);    
        //var price = req.body.price;    
        var imageurl = validator.escape(req.body.imageurl); 
        //var categoryid = req.body.categoryid;   

        //var patternName = new RegExp(`^[a-zA-Z0-9 ]+$`);


        if (name.length >= 50) {
            next();
        } else {
            res.status(500);
            res.send(`{"Message":"Invalid Input Data ${name}"}`);
        }
    }
}
module.exports = validateLib;