import { Component, OnInit, OnChanges } from '@angular/core';

declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
}) 

export class MapComponent implements OnInit {

  ngOnInit() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 7,
         center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {

      var waypts = [];
      var checkboxArray:any[] = [
          'winnipeg', 'regina','calgary'
      ];
      for (var i = 0; i < checkboxArray.length; i++) {

        waypts.push({
          location: checkboxArray[i],
          stopover: true
        });

      }

      directionsService.route({
        origin: {lat: 41.85, lng: -87.65},
        destination: {lat: 49.3, lng: -123.12},
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

    }
  }

}