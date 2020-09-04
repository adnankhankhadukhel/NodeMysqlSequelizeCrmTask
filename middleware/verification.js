const jwt = require("jsonwebtoken");
const path = require("path");
const userAuthorities = require("./user-authorities.json");

module.exports = {
    verifyToken: (req, res, next) => {
        // check header or url parameters or post parameters for token
        console.log("in verify token")
        let token =
            req.body.token || req.query.token || req.headers["x-access-token"];
        // decode token
        if (token) {
            console.log("Token is : ", token);
            jwt.verify(token, process.env.SECRET_KEY, function (err, user) {
                if (err) {
                    console.log("ERROR: Token can not be authenticated: " + err);
                    return res.json({
                        success: false,
                        status: false,
                        message: "Failed to authenticate token." + err
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    console.log(user)
                    req.decoded = user;
                    console.log("email of user is ", user.email);
                    if (user) {
                        console.log("checking role");
                        if (user.user_role == "admin" || user.user_role == "customer") {
                            console.log("User Role is ", user.user_role);
                            let userRole = user.user_role;
                            let url = req.url;
                            let authorized = false;
                            let n = url.search("getWifi");
                            if (n == -1) {
                                authorized = userAuthorities[userRole].some(authUrl => {
                                    console.log("user role is ", userRole, authUrl, url);
                                    return authUrl == url;
                                });
                            } else {
                                authorized = true;
                            }
                            if (authorized) {
                                console.log("Authorized for : ", url);
                                next();
                            } else {
                                console.log("You are Not Authorized for : ", url, " with user role ", userRole);
                                return res.status(400).send({
                                    status: false,
                                    message: "You are not authorized to access this url",
                                    url: req.url
                                });
                            }
                        } else {
                            console.log("USER does not have any userRole assigned to it ");
                            return res.status(400).send({
                                status: false,
                                message: "You are not authorized to access this url",
                                url: req.url
                            });
                        }
                    } else {
                        console.log("USER is undefined ");
                        return res.status(400).send({
                            status: false,
                            message: "You are not authorized to access this url",
                            url: req.url
                        });
                    }
                }
            });
        } else {
            return res.status(400).send({
                message: "token not found",
                result: [{}],
                statuscode: 400
            });

        }
    }
};