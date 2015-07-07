function eachKeyValue(obj, onEach) {
    Object.keys(obj).forEach(function(key) {
        onEach(key, obj[key])
    });
}

var days, currentDay;

$(document).ready(function() {
    days = [];

    // load in all days from database
    $.get('/days', function(resData) {

	    // if there are no days, make an initial one
    	if (!resData.length) {
		    currentDay = new Day(function(day) {
		    	// making a day is async now
		    	day.$button.addClass('current-day');
		    });
    	} else {
    		// otherwise, load the days

    		// convert each returned mongo object into a day
    		days = resData.map(function(mongoObj) {
    			return new Day(null, mongoObj);
    		});

		    // convert each day's hotels, restaurants, and things from mongo objects
		    //    and populate each day's markers and itinerary items
		    days.forEach(convertFromMongo);

    		// set the current day (to the first one)
    		currentDay = days[0];
    		// update it's class
		    currentDay.$button.addClass('current-day');

		    // display the first day's data
		    currentDay.switchTo();

		    console.log(days);
    	}
    });
});

function convertFromMongo(day) {
	if (day.hotel) {
		day.hotel = new Hotel(day.hotel, true);
	}
	if (day.restaurants.length) {
		day.restaurants = day.restaurants.map(function(rest) {
			return new Restaurant(rest, true);
		});
	}
	if (day.thingsToDo.length) {
		day.thingsToDo = day.thingsToDo.map(function(thing) {
			return new ThingToDo(thing, true);
		});
	}
}