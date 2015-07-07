var Restaurant;

$(document).ready(function () {
	Restaurant = function (data, loaded) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});

		// if already loaded, don't query db
        if (loaded) {
            // update html and the map
            self.buildMarker()
                .buildItineraryItem();
            return;
        }

        // limit to three restaurants
        if (currentDay.restaurants.length >= 3) {
            return;
        }

        // save the restaurant's id to the day
        $.ajax({
            type: 'POST',
            url: '/days/' + currentDay._id + '/restaurants',
            data: {dayID: currentDay._id, restaurantID: self._id},
            success: function(resData) {
                // update the current day (actual restaurant object)
                currentDay.restaurants.push(self);

                // update html and the map
                self.buildMarker()
                    .drawMarker()
                    .buildItineraryItem()
                    .drawItineraryItem();
            }
        });
	};

	$.get('/restaurants', function(all_restaurants) {
		Restaurant.prototype = generateAttraction({
			icon: '/images/restaurant.png',
			$listGroup: $('#my-restaurants .list-group'),
			$all: $('#all-restaurants'),
			all: all_restaurants,
			constructor: Restaurant
		});
		Restaurant.prototype.delete = function () {
			// // front-end
			var index = currentDay.restaurants.indexOf(this),
				removed = currentDay.restaurants.splice(index, 1)[0];
			removed
				.eraseMarker()
				.eraseItineraryItem();

			// // back-end
	        // remove reference to this hotel from the current day
	        $.ajax({
	            type: 'DELETE',
	            url: '/days/' + currentDay._id + '/restaurants/' + this._id,
	            data: {dayID: currentDay._id}
	        });
		};
	});
});