var app = app || {};

(function (a) {
    var map;
    var location;
    var infowindow;
    
    var LocationViewModel = kendo.data.ObservableObject.extend({
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
        
            var mapCanvas = document.getElementById("search-map-canvas");
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
            app.locationSearchService.initLocation();
            var txtPlaceType = document.getElementById("map-place");
            var request = {
                location:location,
                radius: 1000,
                types:[txtPlaceType.value.toLowerCase()]
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
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent('<img src="' + place.icon + '" /><font style="color:#000;">' + place.name +
                             '<br />Rating: ' + place.rating + '<br />Vicinity: ' + place.vicinity + '</font>');
                    infowindow.open(map, this);
                });
            }
        },
    });

    app.locationSearchService = {
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

            map = new google.maps.Map(document.getElementById("search-map-canvas"), mapOptions);            
            app.locationSearchService.viewModel.onNavigateHome.apply(app.locationSearchService.viewModel, []);
        },

        viewModel: new LocationViewModel()
    };
}(app));