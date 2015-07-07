var Day;

$(document).ready(function() {
    Day = function(cb, objectToCopy) {

        var self = this;

        // if the data is already loaded
        if (objectToCopy) {
            // update this with the correct data
            eachKeyValue(objectToCopy, function (key, val) {
                self[key] = val;
            });

            // put the button on the page
            self.buildButton()
                .drawButton();

            // add the day to the days array
            days.push(self);
            return;
        }

        // otherwise, make ajax post request
        $.ajax({
            type: 'POST',
            url: '/days',
            data: null,
            success: function(resData) {
                // save new day in the browser
                console.log('made a new day');
                eachKeyValue(resData, function (key, val) {
                    self[key] = val;
                });

                // put the button on the page
                self.buildButton()
                    .drawButton();

                // add the day to the days array
                days.push(self);

                // accept optional callback
                if (cb) {
                    cb(self);
                }
            }
        });
    };
    // make a new html button for the day
    Day.prototype.buildButton = function() {
        this.$button = $('<button class="btn btn-circle day-btn"></button>').text(this.number);
        var self = this;
        this.$button.on('click', function() {
            // display the current day's data
            self.switchTo();
        });
        return this;
    };

    // placing the button on the html
    Day.prototype.drawButton = function() {
        var $parent = $('.day-buttons');
        this.$button.appendTo($parent);
        return this;
    };

    Day.prototype.eraseButton = function() {
        this.$button.detach();
        return this;
    };

    // remove old day's data, display current day's
    Day.prototype.switchTo = function() {

        console.log(currentDay);

        // remove old day data
        function eraseOne(attraction) {
            attraction.eraseMarker().eraseItineraryItem();
        }
        if (currentDay.hotel) eraseOne(currentDay.hotel);
        currentDay.restaurants.forEach(eraseOne);
        currentDay.thingsToDo.forEach(eraseOne);

        // display new day's data
        function drawOne(attraction) {
            attraction.drawMarker().drawItineraryItem();
        }
        if (this.hotel) drawOne(this.hotel);
        this.restaurants.forEach(drawOne);
        this.thingsToDo.forEach(drawOne);

        // update current button class (highlighted button)
        currentDay.$button.removeClass('current-day');
        this.$button.addClass('current-day');
        $('#day-title > span').text('Day ' + this.number);
        currentDay = this;
    };

    // removes current day from html, browser storage, and db
    function deleteCurrentDay() {
        // can only delete if there is more than 1 day
        if (days.length > 1) {
            // // front-end
            // remove old day and store new current one
            var index = days.indexOf(currentDay),
                previousDay = days.splice(index, 1)[0],
                newCurrent = days[index] || days[index - 1];
            // update each day's number
            days.forEach(function(day, idx) {
                day.number = idx + 1;
                day.$button.text(day.number);
            });

            // // back-end
            // delete old day in db
            $.ajax({
                type: 'DELETE',
                url: '/days/' + currentDay._id,
                data: {dayNum: currentDay.number},
                success: function(resData) {
                    console.log('deleted');
                    console.log('and updated indexes');

                }
            });
            // update number for db entries
            // only days with number greater than the one just deleted need to be decremented by 1



            // update html
            newCurrent.switchTo();
            previousDay.eraseButton();
        }
    }

    $('#add-day').on('click', function() {
        new Day();
    });

    $('#day-title > .remove').on('click', deleteCurrentDay);
});