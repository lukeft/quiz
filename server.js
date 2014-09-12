'use strict';

var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration

mongoose.connect('mongodb://localhost/test'); 	// connect to mongoDB

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-url-encoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// App

var Quiz = mongoose.model('questions', {
  question: String,
  answer: Array,
  categories: Array
});

// routes

app.get('/api/questions', function(req, res) {

  // use mongoose to get all questions in the database
  Quiz.find(function(err, questions) {
    if (err)
      res.send(err);
    res.json(questions);
  });
});


app.get('/api/categories', function(req, res) {

  // use mongoose to get all categories in the database
  Quiz.find(function(err, categories) {
    if (err)
      res.send(err);
    res.json(categories);
  });
});


app.post('/api/questions', function(req, res) {

  console.log(req.body._id);

  if(req.body._id){
    // Update

    console.log('Updating ' + req.body._id);

    Quiz.update({_id:req.body._id},{
      question : req.body.question,
      answer : req.body.answer,
      categories : req.body.categories.toString().split(',')
    }, function(err, question) {
      if (err)
        res.send(err);

      // get and return all the questions after you create another
      Quiz.find(function(err, questions) {
        if (err)
          res.send(err);
        res.json(questions);
      });
    });

  }else{
    // Create

    Quiz.create({
      question : req.body.question,
      answer : req.body.answer,
      categories : req.body.categories.toString().split(',')
    }, function(err, question) {
      if (err)
        res.send(err);

      // get and return all the questions after you create another
      Quiz.find(function(err, questions) {
        if (err)
          res.send(err);
        res.json(questions);
      });
    });
  }



});

// delete a question
app.delete('/api/questions/:question_id', function(req, res) {

  console.log('Deleting ' + req.params.question_id);

  Quiz.remove({
    _id : req.params.question_id
  }, function(err, question) {
    if (err) {
        res.send(err);
    }

    // get and return all the questions after you delete one
    Quiz.find(function(err, questions) {
      console.log('getting updated questions list');
      if (err){
          res.send(err);
      }
        res.json(questions);

    });
  });
});

// application
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js)
app.listen(8080);
console.log('App listening on port 8080');
