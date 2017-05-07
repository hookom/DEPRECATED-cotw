import { Component, OnInit, ElementRef, NgZone, ViewChild, NgModule, Directive, Input } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MapsAPILoader, AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsMapDirective } from './directions.directive';

declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'cotw-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
    providers: [GoogleMapsAPIWrapper]
}) 

export class MapComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public originSearchControl: FormControl;
  public destSearchControl: FormControl;

  @ViewChild("originSearch")
  public originSearchElementRef: ElementRef;

  @ViewChild("destSearch")
  public destSearchElementRef: ElementRef;

  @ViewChild(DirectionsMapDirective)
  vc: DirectionsMapDirective;

  public origin: any;
  public destination: any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private gmapsApi: GoogleMapsAPIWrapper,
    private _elementRef : ElementRef
  ) {}

  ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

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

      this.setupPlaceChangedListener(originAutocomplete, 'ORG');
      this.setupPlaceChangedListener(destAutocomplete, 'DES');
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  private setupPlaceChangedListener(autocomplete: any, mode: any ) {
    autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined) {
            return;
          }
          if (mode === 'ORG') {
            this.vc.origin = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; 
            this.vc.originPlaceId = place.place_id;
          } else {
            this.vc.destination = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; // its a example aleatory position
            this.vc.destinationPlaceId = place.place_id;
          }

          if(this.vc.directionsDisplay === undefined) {
            this.mapsAPILoader.load()
              .then(() => { 
                this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
              }); 
          }

          //Update the directions
          this.vc.updateDirections();
          this.zoom = 12;
        });

      });
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