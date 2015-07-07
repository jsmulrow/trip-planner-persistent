var generateAttraction;

$(document).ready(function() {
    generateAttraction = function(config) {
        config.$all.find('.add').on('click', function() {
            var attraction = config.$all.find(':selected').data();

            //this returns to you a NEW Hotel which
            //invokes methods on its OWN prototype
            //in order to draw certain things
            new config.constructor(attraction);
        });
        config.all.forEach(function(attraction) {
            var $option = $('<option></option>').text(attraction.name).data(attraction);
            config.$all.find('select').append($option);
        });

        return {
            eraseMarker: function() {
                this.marker.setMap(null);
                narrowBounds(this.marker);
                return this;
            },

            buildMarker: function() {
                var location = this.place[0].location;
                this.marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location[0], location[1]),
                    icon: config.icon
                });
                return this;
            },

            drawMarker: function() {
                this.marker.setMap(map);
                extendBounds(this.marker);
                return this;
            },

            eraseItineraryItem: function() {
                this.$itineraryItem.detach();
                return this;
            },

            buildItineraryItem: function() {
                var $title = $('<span class="title"></span>').text(this.name),
                    $button = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');
                var $item = $('<div class="itinerary-item"></div>')
                    .append($title)
                    .append($button);
                this.$itineraryItem = $item;
                var self = this;
                $button.on('click', function() {
                    self.delete();
                });
                return this;
            },

            drawItineraryItem: function() {
                config.$listGroup.append(this.$itineraryItem);
                return this;
            }
        };
    };
});