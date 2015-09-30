// TODO: Speicherlogik nutzen wie in http://jsfiddle.net/dmftLt40/ oder besser employee beispiel
// location fertig machen


var destinationType;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // Kamera
        if (!navigator.camera) {
            alert("Camera Failure");
        } else {
            destinationType = navigator.camera.DestinationType;
        }
        // Button Foto aufnehmen
        document.getElementById("btnTakePhoto").onclick = function () {
            handleCamera();
        };
        //Button Foto löschen
        document.getElementById("btnDelPhoto").onclick = function () {
            window.localStorage.removeItem("photo1");
            refreshPhoto();
        };

        //Location
        document.getElementById("btnUpdateLocation").onclick = function () {
            updateLocation();
        };
        document.getElementById("btnDelLocation").onclick = function () {
            window.localStorage.removeItem("locLat1");
            window.localStorage.removeItem("locLong1");
            refreshLocation();
        };

        //Google Maps
        document.getElementById("btnShowMap").onclick = function () {
            displayRestaurantMap();
        };

    };


    /**
    Nimmt ein Foto auf und sppeichert es in der Galerie des Geräts
    */
    function handleCamera() {
        //alert("Launching Camera");
        navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
            quality: 75,
            destinationType: destinationType.FILE_URI,
            saveToPhotoAlbum: true, // in Galerie Speichern
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

    /**
    Ruft aktuelle Koordinaten ab und speichert diese
    */
    function updateLocation() {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                localStorage.setItem("locLat1", position.coords.latitude);
                localStorage.setItem("locLong1", position.coords.longitude);
                refreshLocation(); // Anzeige der Location neu laden
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


    function onPause() {
        // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
    };

    function onResume() {
        // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
    };
})();


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

/**
Gespeichertes Bild und Location laden
*/
$(document).on("pageinit", "#restaurant", function () {
    refreshPhoto();
    refreshLocation();
});

function refreshLocation() {
    var currentLocLat = document.getElementById("locationLat");
    var currentLocLong = document.getElementById("locationLong");
    var savedLocLat = window.localStorage.getItem("locLat1");
    var savedLocLong = window.localStorage.getItem("locLong1");

    if (savedLocLat != null) {
        currentLocLat.innerHTML = "Latitude=" + savedLocLat;
    } else { // Ansonsten "noimage" Foto anzeigen
        currentLocLat.innerHTML = "No Latitude Data";
    }
    if (savedLocLong != null) {
        currentLocLong.innerHTML = "Longitude=" + savedLocLong;
    } else { // Ansonsten "noimage" Foto anzeigen
        currentLocLong.innerHTML = "No Longitude Data";
    }
};

function displayRestaurantMap() {

    var lat = window.localStorage.getItem("locLat1");
    var long = window.localStorage.getItem("locLong1");
    if (lat != null && long != null) {
        document.getElementById("map-canvas").hidden = false;
        document.getElementById("locErrArea").innerHTML = "";
        drawMap(new google.maps.LatLng(lat, long));
    } else {
        document.getElementById("map-canvas").hidden = true;
        document.getElementById("locErrArea").innerHTML = "No Location Data";
    }
};

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
};


$(document).on("pageinit", "#stuffHome", function () {
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("volumedownbutton", onVolumeDownKeyDown, false);
    document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);
    window.addEventListener("batterystatus", onBatteryStatus, false);

    var onShake = function () {
        var lastPhotoContainer1 = document.getElementById("gruselFoto");
        lastPhotoContainer1.src = "images/grusel.png";
        shake.stopWatch();
    };
    shake.startWatch(onShake, 30);

    function onBatteryStatus(info) {
        var status;
        status = "The Battery Level is <b>" + info.level + "</b>% and the cable is <b>";
        if (info.isPlugged) {
            status += "plugged in";
        } else if (!info.isPlugged) {
            status += "not plugged in";
        } else {
            status += "unknown";
        }
        status += "</b>";
        document.getElementById("pluggedStatus").innerHTML = status;
    }
    function onVolumeUpKeyDown() {
        //  var sliderValue = document.getElementById("slider-2").value;
        // alert("old value " + document.getElementById("slider-2").value);
        $("#slider-2").val(1).slider("refresh");
        //  alert("new value " + document.getElementById("slider-2").value);
    }
    function onVolumeDownKeyDown() {
        var sliderValue = document.getElementById("slider-2").value;
        $("#slider-2").val(0).slider("refresh");
    }

    function onMenuKeyDown() {
        alert("Menu key pressed");
    }

    function onBackKeyDown() {
        alert("Back button pressed");
    }

    function checkConnection() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        document.getElementById("networkStatus").innerHTML = "The device is connected via: <b>" + states[networkState] + "</b>";
    }

    checkConnection();

});

/**
Google Maps
*/
/**
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
    
});*/