// Initiating model
const User = require('../models/User');

// librabries initialization section
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// //******************************** */

//registration of customer
exports.registerUser = function (req, res) {
  try {
    const today = new Date()
    const userData = {
      email: req.body.email,
      password: req.body.password,
      user_role: req.body.user_role,
      created: today
    }
    if (req.body.user_role == "admin") {
      userData.user_status = true;
    } else {
      userData.user_status = false;
    }
    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash
            User.create(userData)
              .then(user => {
                res.status(200).send({
                  "message": "success",
                  "status": true,
                  "data": user.email
                });
              })
              .catch(err => {
                res.status(400).send({
                  message: `error: ${err}`,
                  data: [],
                  status: false
                });
              })
          })
        } else {
          res.status(200).send({
            "message": "user already Exist",
            "status": true,
            "data": []
          });
        }
      })
      .catch(err => {
        res.status(400).send({
          message: `error: ${err}`,
          data: [],
          status: false
        });
      })
  } catch (error) {
    res.status(400).send({
      message: `Exception: ${error}`,
      data: [],
      status: false
    });
  }
};

//login api using email and password
exports.login = function (req, res) {
  try {
    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            let userData = user.dataValues;
            let token = jwt.sign(userData, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.status(200).send({
              "message": "loggedIn",
              "status": true,
              "data": [token]
            });
          }
        } else {
          res.status(400).send({
            message: `User not exist`,
            data: [],
            status: false
          });
        }
      })
      .catch(err => {
        res.status(400).send({
          message: `error: ${err}`,
          data: [],
          status: false
        });
      })
  } catch (error) {
    res.status(400).send({
      message: `Exception: ${error}`,
      data: [{}],
      status: false
    });
  }
};

// Delete a user with the specified id in the request
exports.deleteUser = (req, res) => {
  try {
    const id = req.body.id;
    User.destroy({
        where: {
          id: id
        }
      })
      .then(num => {
        if (num == 1) {
          res.status(200).send({
            "message": "user deleted Succesfully",
            "status": true,
            "data": []
          });
        } else {
          res.status(400).send({
            message: `User not found`,
            data: [],
            status: false
          });
        }
      })
      .catch(err => {
        res.status(400).send({
          message: `user not deleted with id : ${id}`,
          data: [],
          status: false
        });
      });
  } catch (error) {
    res.status(400).send({
      message: `Exception: ${error}`,
      data: [{}],
      status: false
    });
  }
};

// find all customers
exports.listCustomers = (req, res) => {
  try {
    User.findAll({})
      .then(data => {
        res.status(200).send({
          "message": "customers listed",
          "status": true,
          "data": [data]
        });
      })
      .catch(err => {
        res.status(500).send({
          message: `error occured while listing customers`,
          status: false,
          data: []
        });
      });
  } catch (error) {
    res.status(400).send({
      message: `Exception: ${error}`,
      data: [{}],
      status: false
    });
  }
};

//update customer status to active
exports.updateStatus = (req, res) => {
  try {
    const id = req.body.id;
    User.update(req.body, {
        where: {
          id: id
        }
      })
      .then(num => {
        if (num == 1) {
          res.status(200).send({
            "message": "status updated",
            "status": true,
            "data": []
          });
        } else {
          res.status(200).send({
            "message": `cannot update user status with id= ${id}`,
            "status": false,
            "data": [data]
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `error occured while update userstatus`,
          status: false,
          data: []
        });
      });
  } catch (error) {
    res.status(400).send({
      message: `Exception: ${error}`,
      data: [{}],
      status: false
    });
  }
};

// healthCheck api to test working condition of server and routes.
exports.healthcheck = function (req, res) {
  console.log("healthCheck Status: Active");
  try {
    res.status(200).send({
      "status": "active",
      "msg": "version 1.0.0"
    });
  } catch (error) {
    res.status(400).send({
      "status": "active",
      "msg": "version 1.0.0"
    });
  }
};