var dayRouter = require('express').Router();
var attractionRouter = require('express').Router();

var models = require('../models');

console.log('ran days js');

// GET /days
dayRouter.get('/', function (req, res, next) {
    // serves up all days as json
    models.Day.find().exec()
    	.then(function(days) {
    		res.json(days);
    	}, function(err) {
    		res.json(err);
    	});
});
// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json
    var newDay = new models.Day();
    newDay.save(function(err, day) {
        console.log(day);
    	res.json(day);
    });
});
// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
    // serves a particular day as json
    models.Day.find({number: req.params.id}).exec()
    	.then(function(day) {
    		res.json(day);
    	}, function(err) {
    		res.json(err);
    	});
});
// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {
    // deletes a particular day
    models.Day.remove({number: req.params.id})
    	.then(function(day) {
    		res.json(day);
    	}, function(err) {
    		res.json(err);
    	});
});

dayRouter.use('/:id', attractionRouter);
// POST /days/:id/hotel
attractionRouter.post('/hotel', function (req, res, next) {
    // creates a reference to the hotel
    models.Day.findOne({number: req.params.id}).exec()
    	.then(function(day) {
    		// update the day's hotel
    		// find the hotel in the database
    		// save that hotel's _id as day.hotel
    		// day.hotel
    		//////////
    		// use ajax.data thing to make new hotel --- on
    		////////
    	});
});
// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
    // deletes the reference of the hotel
});
// POST /days/:id/restaurants
attractionRouter.post('/restaurants', function (req, res, next) {
    // creates a reference to a restaurant
});
// DELETE /days/:dayId/restaurants/:restId
attractionRouter.delete('/restaurant/:id', function (req, res, next) {
    // deletes a reference to a restaurant
});
// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do
});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:id', function (req, res, next) {
    // deletes a reference to a thing to do
});

module.exports = dayRouter;