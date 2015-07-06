var Hotel;

$(document).ready(function() {
    Hotel = function(data) {
        var self = this;
        eachKeyValue(data, function(key, val) {
            self[key] = val;
        });
        if (currentDay.hotel) {
            currentDay.hotel.delete();
        }
        this.buildMarker()
            .drawMarker()
            .buildItineraryItem()
            .drawItineraryItem();
        currentDay.hotel = this;
    }

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
        currentDay.hotel
            .eraseMarker()
            .eraseItineraryItem();
        currentDay.hotel = null;
    };
});