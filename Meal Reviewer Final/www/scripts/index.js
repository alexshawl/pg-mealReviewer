// TODO: Speicherlogik nutzen wie in http://jsfiddle.net/dmftLt40/

var destinationType;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.getElementById("btnTakePhoto").onclick = function () {
        navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
            quality: 75,
            destinationType: destinationType.FILE_URI,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            encodingType: navigator.camera.EncodingType.JPEG
        });
    };
    document.getElementById("btnAddLocation").onclick = function () {
        addLocation();
    };
    function onDeviceReady() {
        // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // Kamera
        console.log("Camera-->" + navigator.camera);
        destinationType = navigator.camera.DestinationType;

        //Location
        console.log("Location-->" + navigator.geolocation);
    };

    function onPause() {
        // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
    };

    function onResume() {
        // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
    };

    function onCameraSuccess(imageData) {
        var lastPhotoContainer = document.getElementById("restaurantPhoto");
        console.log("Bild geändert: -> " + imageData);
        lastPhotoContainer.src = imageData;
        // lastPhotoContainer.innerHTML = "<img src ='" + imageUri + "' style='width: 25%;' />";
    }

    function onCameraFail(message) {
        alert("Camera failure: " + message);
    }

    function addLocation() {
        console.log('addLocation');
        navigator.geolocation.getCurrentPosition(
            function (position) {
                document.getElementById("location").innerHTML = position.coords.latitude + " , " + position.coords.longitude;
                alert('Latitude: ' + position.coords.latitude + '\n' +
           'Longitude: ' + position.coords.longitude + '\n' +
           'Altitude: ' + position.coords.altitude + '\n' +
           'Accuracy: ' + position.coords.accuracy + '\n' +
           'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
           'Heading: ' + position.coords.heading + '\n' +
           'Speed: ' + position.coords.speed + '\n' +
           'Timestamp: ' + position.timestamp + '\n');

            },
            function (error) {
                alert('Error getting location:' + error.code + " , " + error.message);
            });
        return false;
    };
})();

/**
Google Maps
*/
$(document).on("pageinit", "#map-page", function () {
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support

    if (navigator.geolocation) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }

        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }

        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 6000 });
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }

    function drawMap(latlng) {
        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }

});