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

// CORS 
apiRoutes.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
  res.json({
    message: 'Welcome to the RoomManager API!'
  });
});

/*
 * /auth
 * username [string]
 * password [string]
 */
apiRoutes.get('/auth', function (req, res, next) {

  mc.query('SELECT * FROM utenti WHERE username = "' + req.query.username + '" AND password = "' + req.query.password + '"', function (error, results, fields) {
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
		res.send(JSON.stringify({"status": 200, "message": null, "response": results}));
  });

});

apiRoutes.get("/aule", function(req, res) {
  mc.query('SELECT * FROM aule', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {
      res.json({
        success: false,
        message: 'Aule non trovate'
      });
    } else {
      res.json({
        success: true,
        message: 'Aule',
        aule: results
      });
    }
  });

});

/*
 * /prenotazioni
 *
 * date: date of the first day of weekend [string]
*/
apiRoutes.get("/prenotazioni", function(req, res) {
  mc.query('SELECT * FROM prenotazioni ORDER BY id_aula', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {
      res.json({
        success: false,
        message: 'Prenotazioni non trovate'
      });
    } else {
      res.json({
        success: true,
        message: 'Aule e orari',
        prenotazioni: results
      });
    }
  });

});

// route middleware to verify a token
apiRoutes.use(function (req, res, next) {

  if (req.method === 'OPTIONS') {
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
  } else {

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
  }
});


// ######### API PROTECTED #########

/*
 * /prenota
 * data: date of the day [string]
 * orario1: start time [string]
 * orario2: finish time [string]
 * id_aula: id of the room [integer]
 */
apiRoutes.post("/prenota", function (req, res) {

  var data = req.body.data;
  var orario1 = req.body.orario1.substring(0, 2);
  var orario2 = req.body.orario2.substring(0, 2);
  var id_aula = req.body.id_aula;
  var professore = req.body.professore;
  var descrizione = req.body.descrizione;

	mc.query('SELECT * \
  FROM prenotazioni \
  WHERE giorno="' + data + '" AND id_aula=' + id_aula + ' \
  AND ( \
       (' + orario1 + ' = SUBSTRING(orario1, 1, 2) AND ' + orario2 + ' = SUBSTRING(orario2, 1, 20)) /* stesso orario */ \
    OR	 (' + orario1 + ' > SUBSTRING(orario1, 1, 2) AND ' + orario1 + ' < SUBSTRING(orario2, 1, 2)) /* ' + orario1 + ' compreso tra orario1 e orario2 */ \
    OR   (' + orario2 + ' > SUBSTRING(orario1, 1, 2) AND ' + orario2 + ' < SUBSTRING(orario2, 1, 2)) /* ' + orario2 + ' compreso tra orario1 e orario2 */ \
    OR	 (SUBSTRING(orario1, 1, 2) > ' + orario1 + ' AND SUBSTRING(orario1, 1, 2) < ' + orario2 + ') /* orario1 compreso tra ' + orario1 + ' e ' + orario2 + ' */ \
    OR	 (SUBSTRING(orario2, 1, 2) > ' + orario1 + ' AND SUBSTRING(orario2, 1, 2) < ' + orario2 + ') /* orario2 compreso tra ' + orario1 + ' e ' + orario2 + ' */ \
  );', function (error, results, fields) {
    if (error) throw error;

    if (results.length == 0) {

      mc.query("INSERT INTO `prenotazioni` (`id_aula`, `giorno`, `orario1`, `orario2`,`professore`, `descrizione`) VALUES \
                (" + id_aula + ", '" + data + "', '" + orario1 + "', '" + orario2 + "', '" + professore + "', '" + descrizione + "')\
          ;",  function (error, results, fields) {

        if (error) throw error;

        if (results)
          res.send({
            "status": 200,
            "message": "Prenotazione effettuata!"
          });
        else
          res.send({
            "status": 200,
            "message": "Errore durante la prenotazione."
          });
      });
    }
    else {
      res.send({
        "status": 200,
        "message": "Questa prenotazione va in conflitto con altre prenotazioni!"
      });
    }

  });

});


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('RoomManager http://localhost:' + port);
