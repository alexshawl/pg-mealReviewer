// TODO: Speicherlogik nutzen wie in http://jsfiddle.net/dmftLt40/
// location fertig machen
// - Menü bei Klick auf Menü Buttun (Android)

var destinationType;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // Kamera
        destinationType = navigator.camera.DestinationType;
        if (!navigator.camera) {
            alert("Camera Failure");
        }
        document.getElementById("btnTakePhoto").onclick = function () {
            handleCamera();
        }
        document.getElementById("btnDelPhoto").onclick = function () {
            window.localStorage.removeItem("photo1");
            refreshPhoto();
        }

        //Location
        document.getElementById("btnUpdateLocation").onclick = function () {
            updateLocation();
        };
        document.getElementById("btnDelLocation").onclick = function () {
            window.localStorage.removeItem("locLat1");
            window.localStorage.removeItem("locLong1");
            refreshLocation();
        }

    };

    function onPause() {
        // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
    };

    function onResume() {
        // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
    };

    function handleCamera() {
        //alert("Launching Camera");
        navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
            quality: 75,
            destinationType: destinationType.FILE_URI,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            encodingType: navigator.camera.EncodingType.JPEG
        });
    };
    function onCameraSuccess(imageData) {
        var lastPhotoContainer = document.getElementById("restaurantPhoto");
        console.log("Bild geändert: -> " + imageData);
        lastPhotoContainer.src = imageData;

        // Pfad des Fotos speichern
        window.localStorage.setItem("photo1", imageData);

    };

    function onCameraFail(message) {
        alert("Camera failure: " + message);
    };


    function updateLocation() {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                localStorage.setItem("locLat1", position.coords.latitude);
                localStorage.setItem("locLong1", position.coords.longitude);
                refreshLocation();
                //    document.getElementById("location").innerHTML = position.coords.latitude + " , " + position.coords.longitude;
                /* alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');*/

            },
            function (error) {
                alert('Error getting location:' + error.code + " , " + error.message);
            });
        return false;
    };
})();

/**
Gespeichertes Bild laden
*/
$(document).on("pageinit", "#restaurant", function () {
    refreshPhoto();
});
function refreshPhoto() {
    var currentPhoto = document.getElementById("restaurantPhoto");
    var savedPhoto = window.localStorage.getItem("photo1");

    //Wenn es ein gespeichertes Foto gibt, dieses laden
    if (savedPhoto != null) {
        currentPhoto.src = window.localStorage.getItem("photo1");
    } else { // Ansonsten "noimage" Foto anzeigen
        currentPhoto.src = "images/noimage.gif"
    }
};

function refreshLocation() {
    var currentLocLat = document.getElementById("locationLat");
    var currentLocLong = document.getElementById("locationLong");
    var savedLocLat = window.localStorage.getItem("locLat1");
    var savedLocLong = window.localStorage.getItem("locLong1");

    if (savedLocLat != null) {
        currentLocLat.innerHTML = "Latitude=" + savedLocLat;
    } else { // Ansonsten "noimage" Foto anzeigen
        currentLocLat.innerHTML = "No Location Data";
    }
    if (savedLocLong != null) {
        currentLocLong.innerHTML = "Longitude=" + savedLocLong;
    } else { // Ansonsten "noimage" Foto anzeigen
        currentLocLong.innerHTML = "No Location Data";
    }
};




/**
Gespeichertee Location laden
*/
$(document).on("pageinit", "#restaurant", function () {
    refreshLocation();
});


/**
Google Maps
*/
$(document).on("pageinit", "#map-page", function () {
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support

    if (navigator.geolocation) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(window.localStorage.getItem("locLat1"), window.localStorage.getItem("locLong1")));
        }

        function fail(error) {
            alert("No Location Data");
            //  drawMap(defaultLatLng);  // Failed to find location, show default map
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