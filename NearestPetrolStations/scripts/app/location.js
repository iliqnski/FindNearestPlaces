var app = app || {};

(function (a) {
    var position;
    
    var viewModel = kendo.observable({
        location:[]
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        
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
        
        var mapCanvas = document.getElementById("map-canvas");
        map = new google.maps.Map(mapCanvas, mapOptions);    
        
        navigator.geolocation.getCurrentPosition(
            function (position) {
                position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.panTo(position);
                new google.maps.Marker({
                    map: map,
                    position: position,
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
    }
    
    a.location = {
        init:init
    }
}(app));