// =======================
// get the packages we need ============
// =======================
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var fs = require('fs');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

var config = require('./config');

var app = express();

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// CORS 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Database connection
const mc = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});
mc.connect();

// ######### API ROUTES #########

// get an instance of the router for api routes
var apiRoutes = express.Router();

// ######### PUBLIC API #########

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
  res.json({
    message: 'Welcome to the RoomManager API!'
  });
});

/*
 * /authenticate
 * username [string]
 * password [string]
 */
apiRoutes.post('/authenticate', function (req, res) {

  // find the user
  mc.query('SELECT * FROM utenti WHERE username = "' + req.body.username + '" AND password = "' + req.body.password + '"', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {
      res.json({
        success: false,
        message: 'Autenticazione fallita. Password errata.'
      });
    } else {

      // if user is found and password is right
      // create a token
      var token = jwt.sign(results[0], app.get('superSecret'), {
        expiresIn: 1440 // expires in 24 hours
      });

      // return the information including token as JSON
      res.json({
        success: true,
        message: 'Autenticazione effettuata!',
        token: token
      });
    }
  });

});

/*
 * /register
 *
 * name:      name of the user [string]
 * password:  password of the user [string]
 * email:     email of the user [string]
 */
apiRoutes.post("/register", function (req, res) {

  var userData = {
    "username": req.body.username,
    "nome": req.body.nome,
    "cognome": req.body.cognome,
    "email": req.body.email,
    "password": req.body.password,
  };

  mc.query("INSERT INTO utenti (`username`, `nome`, `cognome`, `email`, `password`) VALUES ('" + userData.username + "', '" + userData.nome + "', '" + userData.cognome + "', '" + userData.email + "', '" + userData.password + "')", function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });

});

/*
// route middleware to verify a token
apiRoutes.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});
*/

// ######### API PROTECTED #########

apiRoutes.get("/test", function (req, res) {

	mc.query('SELECT * from utenti', function (error, results, fields) {
    if (error) throw error;

    res.send({
      "status": 200,
      "error": null,
      "response": results
    });
  });

});


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('RoomManager http://localhost:' + port);
