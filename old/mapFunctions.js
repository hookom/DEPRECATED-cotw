var map = null;
var boxpolys = null;
var routeBoxer = null;
var waypoints = [];
var foundLocationMarkers = [];

var directionsService;
var directionsRenderer;

var rendererOptions = {
    map: map,
    draggable: true,
    suppressInfoWindows: true
};

var temp_marker;

function initClimbMap(contribution) {

    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAAi6L-1-YA2Epj8I8A2fKgDKDKTcNeFiA", function() {

        var mapOptions = {
            center: new google.maps.LatLng(37.09024, -95.712891),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 4
        };

        if(contribution) {
            mapOptions["draggableCursor"] = 'crosshair';
        }

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        if(contribution) {

            showContributed();

            google.maps.event.addListener(map, "rightclick", function(event) {
                if(temp_marker) {
                    temp_marker.setMap(null);
                }
                var lat = event.latLng.lat();
                var lng = event.latLng.lng();
                var temp_loc = new google.maps.LatLng(lat, lng);
                document.getElementById("insertLat").value = lat;
                document.getElementById("insertLong").value = lng;
                temp_marker = new google.maps.Marker({
                    position: temp_loc,
                    map: map,
                    title: document.getElementById("insertName").value
                });
            });

        } else {
            directionsService = new google.maps.DirectionsService();

            directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);

            directionsRenderer.setMap(map);
        }

    });

}

function center() {
    var near = document.getElementById("near").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': near}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
    map.setZoom(8);
}

function climbRoute() {
    $.getScript("../lib/RouteBoxer.js", function() {
        routeBoxer = new RouteBoxer();

        clearBoxes();
        clearMarkers();

        // Convert the distance to box around the route from miles to km
        var distance = parseFloat(document.getElementById("distance").value) * 1.609344;

        var request;
        if (waypoints.length < 1) {
            request = {
                origin: document.getElementById("from").value,
                destination: document.getElementById("to").value,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
        } else {
            request = {
                origin: document.getElementById("from").value,
                destination: document.getElementById("to").value,
                waypoints: waypoints,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
        }

        // Make the directions request
        directionsService.route(
            request,
            function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);

                    // Create boxes around the route
                    var path = result.routes[0].overview_path;
                    var boxes = routeBoxer.box(path, distance);

                    drawBoxes(boxes);
                    findMarkers(boxes);
                } else {
                    alert("Directions query failed: " + status);
                }
            }
        );

        google.maps.event.addListener(
            directionsRenderer,
            'directions_changed',
            function () {
                var coords = [];
                var rleg = directionsRenderer.directions.routes[0].legs[0];
                // var start_loc = {'lat': rleg.start_location.lat(), 'lng':rleg.start_location.lng()};
                // var end_loc = {'lat': rleg.end_location.lat(), 'lng':rleg.end_location.lng()};
                var w = rleg.via_waypoints;

                for(var i=0; i<w.length; i++) {
                    coords[i] = [w[i].lat(), w[i].lng()];
                }

                for(var i=0; i<coords.length; i++) {
                    waypoints[i] = {'location': new google.maps.LatLng(coords[i][0], coords[i][1]),'stopover':false };
                }
            }
        );

    });
}

// Draw the array of boxes as polylines on the map
function drawBoxes(boxes) {
    boxpolys = new Array(boxes.length);
    for (var i = 0; i < boxes.length; i++) {
        boxpolys[i] = new google.maps.Rectangle(
                            { bounds: boxes[i],
                              fillOpacity: 0,
                              strokeOpacity: 1.0,
                              strokeColor: '#000000',
                              strokeWeight: 1,
                              map: map
                            } );
    }
}

// Clear boxes currently on the map
function clearBoxes() {
    if (boxpolys != null) {
        for (var i = 0; i < boxpolys.length; i++) {
            boxpolys[i].setMap(null);
        }
    }
    boxpolys = null;
}

//take an array of LatLngBounds objects
function findMarkers(boxes) {

    var db_locations = null;

    // Making this synchronous for now as db_locations
    // is used immediately after this call. Can alternatively
    // block until success callback, but seems the same?
    $.ajax({
        url: "/lib/db/data.php",
        dataType: 'json',
        async: false,
        success: function(data) {
            db_locations = data;
        }
    });

    // var db_locations = <?php echo json_encode($locations); ?>;

    for (var i=0; i < boxes.length; i++) {

        for (var n=0; n < db_locations.length; n++) {

            var temp_loc = new google.maps.LatLng(db_locations[n][1], db_locations[n][2]);
            if (boxes[i].contains(temp_loc)) {

                var temp_title;
                if(db_locations[n][3] == 0) {
                    temp_title = "(Unverified): " + db_locations[n][0];
                } else {
                    temp_title = db_locations[n][0];
                }

                var marker = new google.maps.Marker({
                    position: temp_loc,
                    map: map,
                    title: temp_title
                });

                if(db_locations[n][3] == 0) {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                }

                foundLocationMarkers.push(marker);
            }
        }
    }

}

function showContributed() {

    var db_locations = null;

    // Making this synchronous for now as db_locations
    // is used immediately after this call. Can alternatively
    // block until success callback, but seems the same?
    $.ajax({
        url: "/lib/db/data.php",
        dataType: 'json',
        async: false,
        success: function(data) {
            db_locations = data;
        }
    });

    for (var n=0; n < db_locations.length; n++) {
        var temp_loc = new google.maps.LatLng(db_locations[n][1], db_locations[n][2]);
        var temp_title;
        if(db_locations[n][3] == 0) {
            temp_title = "(Unverified): " + db_locations[n][0];
        } else {
            temp_title = db_locations[n][0];
        }
        var marker = new google.maps.Marker({
            position: temp_loc,
            map: map,
            title: temp_title
        });

        if(db_locations[n][3] == 0) {
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        }

        foundLocationMarkers.push(marker);
    }

}

function clearMarkers() {

    for (var i=0; i < foundLocationMarkers.length; i++) {
        foundLocationMarkers[i].setMap(null);
        foundLocationMarkers.pop(foundLocationMarkers[i]);
    }

}

function validate_submission() {
    var fields = ["insertName", "insertLat", "insertLong"];

    for(var i = 0; i < fields.length; i++) {
        var fieldVal = document.forms["userSub"][fields[i]].value;

        if (fieldVal.search(/^\s+$/) != -1) {
            alert("Crag Name, Latitude, and Longitude are required.");
            return false;
        }
    }
}