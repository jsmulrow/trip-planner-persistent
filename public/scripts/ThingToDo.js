var ThingToDo;

$(document).ready(function () {
	ThingToDo = function (data, loaded) {
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

        // save the thing's id to the day
        $.ajax({
            type: 'POST',
            url: '/days/' + currentDay._id + '/thingsToDo',
            data: {dayID: currentDay._id, thingToDoID: self._id},
            success: function(resData) {

                // update the current day (actual thing object)
                currentDay.thingsToDo.push(self);

                // update html and the map
                self.buildMarker()
                    .drawMarker()
                    .buildItineraryItem()
                    .drawItineraryItem();

                console.log('currentDay', currentDay);
                console.log('thing after the update:', self);
            }
        });
	};

	ThingToDo.prototype = generateAttraction({
		icon: '/images/star-3.png',
		$listGroup: $('#my-things-to-do .list-group'),
		$all: $('#all-things-to-do'),
		all: all_things_to_do,
		constructor: ThingToDo
	});

	ThingToDo.prototype.delete = function () {
		// // front-end
		var index = currentDay.thingsToDo.indexOf(this),
			removed = currentDay.thingsToDo.splice(index, 1)[0];
		removed
			.eraseMarker()
			.eraseItineraryItem();

		// // back-end
        // remove reference to this hotel from the current day
        $.ajax({
            type: 'DELETE',
            url: '/days/' + currentDay._id + '/thingsToDo/' + this._id,
            data: {dayID: currentDay._id},
            success: function(resData) {
                console.log(resData);
            }
        });
	};
});