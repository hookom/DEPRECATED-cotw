import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MapsAPILoader } from '@agm/core';
import { DirectionsMapDirective } from './directions.directive';

declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'cotw-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
}) 

export class MapComponent implements OnInit {

  public zoom: number;
  public originLatitude: number;
  public originLongitude: number;
  public originSearchControl: FormControl;
  public destLatitude: number;
  public destLongitude: number;
  public destSearchControl: FormControl;

  @ViewChild("originSearch")
  public originSearchElementRef: ElementRef;

  @ViewChild("destSearch")
  public destSearchElementRef: ElementRef;

  @ViewChild(DirectionsMapDirective)
  vc: DirectionsMapDirective;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.originLatitude = 39.8282;
    this.originLongitude = -98.5795;

    //create search FormControls
    this.originSearchControl = new FormControl();
    this.destSearchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let originAutocomplete = new google.maps.places.Autocomplete(this.originSearchElementRef.nativeElement, {
        types: []
      });
      let destAutocomplete = new google.maps.places.Autocomplete(this.destSearchElementRef.nativeElement, {
        types: []
      });
      originAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = originAutocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude
          this.originLatitude = place.geometry.location.lat();
          this.originLongitude = place.geometry.location.lng();
        });
      });
      destAutocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = destAutocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude, and zoom
          this.destLatitude = place.geometry.location.lat();
          this.destLongitude = place.geometry.location.lng();

          //TODO: reset zoom to include both origin and dest markers
          this.zoom = 8;

          this.vc.destination = {
            longitude: place.geometry.location.lng(),
            latitude: place.geometry.location.lat()
          };
          this.vc.destinationPlaceId = place.place_id;

          if(this.vc.directionsDisplay === undefined) {
            this.mapsAPILoader.load()
              .then(() => { 
                this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
              });
          }

        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.originLatitude = position.coords.latitude;
        this.originLongitude = position.coords.longitude;
        this.zoom = 9;
      });
    }
  }

  // from: string = '';
  // to: string = '';
  // distance: number = 0;

  // ngOnInit() {
  //   var directionsService = new google.maps.DirectionsService;
  //   var directionsDisplay = new google.maps.DirectionsRenderer;
  //   var map = new google.maps.Map(document.getElementById('cotw-map'), {
  //        zoom: 7,
  //        center: {lat: 41.85, lng: -87.65}
  //   });
  //   directionsDisplay.setMap(map);
    

  // }

  // /**
  //  * Creates route on the map with given inputs.
  //  * @return {boolean} false to prevent default form submit behavior to refresh the page.
  //  */
  // climbRoute(): boolean {
  //   calculateAndDisplayRoute(directionsService, directionsDisplay);

  //   function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //     var waypts = [];
  //     var checkboxArray:any[] = [
  //         'winnipeg', 'regina','calgary'
  //     ];
  //     for (var i = 0; i < checkboxArray.length; i++) {

  //       waypts.push({
  //         location: checkboxArray[i],
  //         stopover: true
  //       });

  //     }

  //     directionsService.route({
  //       origin: {lat: 41.85, lng: -87.65},
  //       destination: {lat: 49.3, lng: -123.12},
  //       waypoints: waypts,
  //       optimizeWaypoints: true,
  //       travelMode: 'DRIVING'
  //     }, function(response, status) {
  //       if (status === 'OK') {
  //         directionsDisplay.setDirections(response);
  //       } else {
  //         window.alert('Directions request failed due to ' + status);
  //       }
  //     });
  //   }

  //   this.from = '';
  //   this.to = '';
  //   this.distance = 0;
    
  //   return false;
  // }

}