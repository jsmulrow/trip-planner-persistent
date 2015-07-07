var dayRouter = require('express').Router();
var attractionRouter = require('express').Router();

var models = require('../models');

// GET /days
dayRouter.get('/', function (req, res, next) {
    // serves up all days as json - populated
    models.Day.find().sort({number: 1}).populate('hotel restaurants thingsToDo').exec()
	.then(function(days) {
		res.json(days);
	}, function(err) {
		next(err);
	});
});
// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json

    // find the number of existing days
    models.Day.find().exec()
    .then(function(data) {
        // length of all results is the number of days
        return data.length;
    })
    .then(function(len) {
        // make the new day (length + 1)
        var newDay = new models.Day({
            number: len + 1,
            hotel: null
        });
        // save and return it as json
        newDay.save(function(err, day) {
            res.json(day);
        });
    })
    // catch errors
    .then(null, function(err) {
        next(err);
    });
});
// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
    // serves a particular day as json
    models.Day.find({_id: req.params.id}).exec()
	.then(function(day) {
		res.json(day);
	}, function(err) {
		next(err);
	});
});
// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {

    // deletes a particular day
    models.Day.remove({_id: req.params.id}).exec()
	.then(function(day) {
        // decrement number for each day greater than deleted one
        return models.Day.update(
            {number: {$gt: req.body.dayNum}},
            {$inc: {number: -1}},
            {multi: true}
        ).exec();
	})
    .then(function(numAffected) {
        res.json(numAffected);
    })
    // error handler
    .then(null, function(err) {
        console.log('error delete handler');
        next(err);
    });
});

dayRouter.use('/:id', attractionRouter);
// POST /days/:id/hotel
attractionRouter.post('/hotel', function (req, res, next) {
    // creates a reference to the hotel

    models.Day.findByIdAndUpdate(
        // day's id
        req.body.dayID,
        // update query
        {$set: {hotel: req.body.hotelID}}
    ).exec()
    .then(function(day) {
        // send back the updated day
        res.json(day);
    }); 
});
// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
    // deletes the reference of the hotel

    models.Day.findByIdAndUpdate(
        // day's id
        req.body.dayID,
        // update query
        {$unset: {hotel: ''}}
    ).exec()
    .then(function(day) {
        // send back the updated day
        res.json(day);
    });
});
// POST /days/:id/restaurants
attractionRouter.post('/restaurants', function (req, res, next) {
    // creates a reference to a restaurant

    models.Day.findByIdAndUpdate(
        // day's id
        req.body.dayID,
        // update query
        {$push: {restaurants: req.body.restaurantID}}
    ).exec()
    .then(function(day) {
        // send back the updated day
        res.json(day);
    });
});
// DELETE /days/:dayId/restaurants/:restId
attractionRouter.delete('/restaurants/:id', function (req, res, next) {
    // deletes a reference to a restaurant

    models.Day.findByIdAndUpdate(
        // day's id
        req.body.dayID,
        // update query
        {$pull: {restaurants: req.params.id}}
    ).exec()
    .then(function(day) {
        // send back the updated day
        res.json(day);
    });
});
// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do

    models.Day.findByIdAndUpdate(
        // day's id
        req.body.dayID,
        // update query
        {$push: {thingsToDo: req.body.thingToDoID}}
    ).exec()
    .then(function(day) {
        // send back the updated day
        res.json(day);
    });
});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:id', function (req, res, next) {
    // deletes a reference to a thing to do
    
    models.Day.findByIdAndUpdate(
        // day's id
        req.body.dayID,
        // update query
        {$pull: {thingsToDo: req.params.id}}
    ).exec()
    .then(function(day) {
        // send back the updated day
        res.json(day);
    });
});

module.exports = dayRouter;