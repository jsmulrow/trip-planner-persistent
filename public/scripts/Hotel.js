var Hotel;

$(document).ready(function() {
    Hotel = function(data, loaded) {
        // save the passed data to the this
        var self = this;
        eachKeyValue(data, function(key, val) {
            self[key] = val;
        });

        // if already loaded, don't query db
        if (loaded) {
            // update html and the map
            self.buildMarker()
                .buildItineraryItem();
            return;
        }

        // remove old hotel (if there is one)
        if (currentDay.hotel) {
            currentDay.hotel.delete();
        }

        // save the hotel's id to the day
        $.ajax({
            type: 'POST',
            url: '/days/' + currentDay._id + '/hotel',
            data: {
                dayID: currentDay._id,
                hotelID: self._id
            },
            success: function(resData) {
                // update the current day (actual hotel object)
                currentDay.hotel = self;

                // update html and the map
                self.buildMarker()
                    .drawMarker()
                    .buildItineraryItem()
                    .drawItineraryItem();
            }
        });
    };

    //replaces entire prototype pbject to be return value of generateAttractionFunction
    console.log('BEGIN HOTEL PROTOTYPE');
    Hotel.prototype = generateAttraction({
        icon: '/images/lodging_0star.png',
        $listGroup: $('#my-hotel .list-group'),
        $all: $('#all-hotels'),
        all: all_hotels,
        constructor: Hotel
    });
    console.log("END HOTEL PROTO");

    Hotel.prototype.delete = function() {
        // // front-end
        currentDay.hotel
            .eraseMarker()
            .eraseItineraryItem();
        currentDay.hotel = null;

        // // back-end
        // remove reference to this hotel from the current day
        $.ajax({
            type: 'DELETE',
            url: '/days/' + currentDay._id + '/hotel',
            data: {dayID: currentDay._id}
        });
    };
});