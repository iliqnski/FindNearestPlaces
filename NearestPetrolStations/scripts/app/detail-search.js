var app = app || {};

(function(a) {
    var map;
    var location;
    var infowindow;

    var DetailSearchViewModel = kendo.data.ObservableObject.extend({
        onNavigateHome: function () {
            var mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            var mapCanvas = document.getElementById("detailSearch-map-canvas");
            map = new google.maps.Map(mapCanvas, mapOptions);    

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(location);
                    new google.maps.Marker({
                        map: map,
                        position: location,
                        icon:'http://maps.google.com/mapfiles/arrow.png'
                    });
                },
                function (error) {
                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                                                 function () {
                                                 }, "Location failed", 'OK');
                },
                {
                timeout: 30000,
                enableHighAccuracy: true
            });
        },

        onSearchPlace: function () {
            app.detailSearchService.initLocation();

            var placeType = document.getElementById("place-type");
            var selectedPlaceType = placeType.options[placeType.selectedIndex].value;
            
            var distance = document.getElementById("place-distance");
            var selectedDistance = distance.options[distance.selectedIndex].value;
            
            var request = {
                location:location,
                radius: selectedDistance,
                types:[selectedPlaceType.toLowerCase()]
            };

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, GetResults);

            function GetResults(results, status) {
                if (results.length > 0) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }
                    }
                }
                else {
                    alert("No places found.");
                }
            }

            function createMarker(place) {    
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                });

                var placeIcon = '<img src="' + place.icon + '" /><font style="color:#000;">';
                var placeName = place.name;
                var placeVicinity = 'Vicinity: ' + place.vicinity;
                var placeRating;
                if (place.rating) {
                    placeRating = '<br />Rating: ' + place.rating + '<br />';
                }
                else {
                    placeRating = "<br/>";
                }

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(placeIcon + placeName + placeRating + placeVicinity);
                    infowindow.open(map, this);
                });
            }
        },
    });

    app.detailSearchService = {
        initLocation: function () {
            var mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("detailSearch-map-canvas"), mapOptions);            
            app.detailSearchService.viewModel.onNavigateHome.apply(app.detailSearchService.viewModel, []);
        },

        viewModel: new DetailSearchViewModel()
    };
}(app));