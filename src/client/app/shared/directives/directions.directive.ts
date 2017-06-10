import { Directive, Input, Output } from '@angular/core';
import { } from '@types/googlemaps';

import { RouteBoxerService } from '../services/routeboxer/routeboxer.service';
import { LocationsService } from '../services/locations/locations.service';
import { Location } from '../models/location';

@Directive({
  selector: 'sebm-google-map-directions',
  providers: [LocationsService]
})

export class DirectionsMapDirective {
  @Input() origin: any;
  @Input() destination: any;

  public originPlaceId: any;
  public destinationPlaceId: any;
  public directionsDisplay: any;
  public map: google.maps.Map;

  private currentRoute: any;
  private foundLocationMarkers: google.maps.Marker[] = [];
  private boxpolys: google.maps.Rectangle[] = null;
  private errorMessage: string;
  private db_locations: Location[];

  constructor (
    private routeBoxerService: RouteBoxerService,
    private locationsService: LocationsService
  ) {}

  updateRoute() {
      if(!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }

      let directionsService = new google.maps.DirectionsService;
      let globalsRef = this;

      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setOptions({
          polylineOptions: {
              strokeWeight: 8,
              strokeOpacity: 0.7,
              strokeColor:  '#00468c'
          }
      });

      this.directionsDisplay.setDirections({routes: []});
      directionsService.route({
          origin: {placeId : this.originPlaceId },
          destination: {placeId : this.destinationPlaceId },
          avoidHighways: true,
          travelMode: google.maps.TravelMode.DRIVING
      }, function(response: any, status: any) {
          if (status === 'OK') {
              globalsRef.currentRoute = response.routes[0];
              globalsRef.directionsDisplay.setDirections(response);
              let point = response.routes[ 0 ].legs[ 0 ];
              console.log( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
          } else {
              console.log('Directions request failed due to ' + status);
          }
      });
  }

  findCrags(dist: number) {
    this.clearBoxes();
    this.clearMarkers();

    let distance = dist * 1.609344;

    if(this.currentRoute !== null) {
      let path = this.currentRoute.overview_path;
      let boxes: google.maps.LatLngBounds[] = this.routeBoxerService.box(path, distance);

      this.locationsService.getLocations()
        .subscribe(locations => {
                                  this.db_locations = locations;
                                  this.placeMarkers(boxes);
                                },
                   error => this.errorMessage = <any>error);

      // this.drawBoxes(boxes);
    }
  }

  private clearBoxes() {
    if (this.boxpolys !== null) {
      for (let i = 0; i < this.boxpolys.length; i++) {
        this.boxpolys[i].setMap(null);
      }
    }
    this.boxpolys = null;
  }

  private clearMarkers() {
    if (this.foundLocationMarkers !== null) {
      for (let i = this.foundLocationMarkers.length - 1; i >= 0; i--) {
        this.foundLocationMarkers[i].setMap(null);
        this.foundLocationMarkers.pop();
      }
    }
  }

  private placeMarkers(boxes: google.maps.LatLngBounds[]) {
    console.log("Checking " + boxes.length + " boxes for " + this.db_locations.length + " locations")
    for (let i = 0; i < boxes.length; i++) {

        for (let n = 0; n < this.db_locations.length; n++) {
            let temp_loc = new google.maps.LatLng(this.db_locations[n].lat, this.db_locations[n].long);

            if (boxes[i].contains(temp_loc)) {
                let temp_title;
                if(this.db_locations[n].verified == 0) {
                    temp_title = "(Unverified): " + this.db_locations[n].name;
                } else {
                    temp_title = this.db_locations[n].name;
                }

                let infowindow = new google.maps.InfoWindow({
                  content: temp_title,
                  maxWidth: 200
                });

                let marker = new google.maps.Marker({
                    position: temp_loc,
                    map: this.map,
                    title: temp_title
                });

                marker.addListener('click', function() {
                  infowindow.open(this.map, marker);
                });

                if(this.db_locations[n].verified == 0) {
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                }

                this.foundLocationMarkers.push(marker);
            }
        }
    }
  }

//   function showContributed() {

//     var db_locations = null;

//     // Making this synchronous for now as db_locations
//     // is used immediately after this call. Can alternatively
//     // block until success callback, but seems the same?
//     $.ajax({
//         url: "/lib/db/data.php",
//         dataType: 'json',
//         async: false,
//         success: function(data) {
//             db_locations = data;
//         }
//     });

//     for (var n=0; n < db_locations.length; n++) {
//         var temp_loc = new google.maps.LatLng(db_locations[n][1], db_locations[n][2]);
//         var temp_title;
//         if(db_locations[n][3] == 0) {
//             temp_title = "(Unverified): " + db_locations[n][0];
//         } else {
//             temp_title = db_locations[n][0];
//         }
//         var marker = new google.maps.Marker({
//             position: temp_loc,
//             map: map,
//             title: temp_title
//         });

//         if(db_locations[n][3] == 0) {
//             marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
//         }

//         foundLocationMarkers.push(marker);
//     }

// }

// function validate_submission() {
//     var fields = ["insertName", "insertLat", "insertLong"];

//     for(var i = 0; i < fields.length; i++) {
//         var fieldVal = document.forms["userSub"][fields[i]].value;

//         if (fieldVal.search(/^\s+$/) != -1) {
//             alert("Crag Name, Latitude, and Longitude are required.");
//             return false;
//         }
//     }
// }

  // // Draw the array of boxes as polylines on the map
  // private drawBoxes(boxes: google.maps.LatLngBounds[]) {
  //   this.boxpolys = new Array(boxes.length);
  //   for (var i = 0; i < boxes.length; i++) {
  //     this.boxpolys[i] = new google.maps.Rectangle(
  //                           { bounds: boxes[i],
  //                             fillOpacity: 0,
  //                             strokeOpacity: 1.0,
  //                             strokeColor: '#000000',
  //                             strokeWeight: 1,
  //                             map: this.map
  //                           } );
  //   }
  // }

}
