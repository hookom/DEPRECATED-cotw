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
  public detourControl: FormControl;

  @ViewChild("originSearch")
  public originSearchElementRef: ElementRef;

  @ViewChild("destSearch")
  public destSearchElementRef: ElementRef;

  @ViewChild("detourDist")
  public detourDistElementRef: ElementRef;

  @ViewChild(DirectionsMapDirective)
  directions: DirectionsMapDirective;

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
    this.detourControl = new FormControl();

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
      // this.setupDistanceChangedListener();
    });

    //detect changes to detourDistance to trigger routeboxing unless there's no mapped route

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
            this.directions.origin = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; 
            this.directions.originPlaceId = place.place_id;
          } else {
            this.directions.destination = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; // its a example aleatory position
            this.directions.destinationPlaceId = place.place_id;
          }

          if(this.directions.directionsDisplay === undefined) {
            this.mapsAPILoader.load()
              .then(() => { 
                this.directions.directionsDisplay = new google.maps.DirectionsRenderer;
              }); 
          }

          //Update the directions
          this.directions.updateDirections();
          this.zoom = 12;
        });

      });
    }
}