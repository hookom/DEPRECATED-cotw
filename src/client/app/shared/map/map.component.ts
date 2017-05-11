import { Component, OnInit, ElementRef, NgZone, ViewChild, NgModule, Directive, Input } from '@angular/core'
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  public climbSearch: FormGroup;

  @ViewChild("originSearch")
  public originSearchElementRef: ElementRef;

  @ViewChild("destSearch")
  public destSearchElementRef: ElementRef;

  @ViewChild(DirectionsMapDirective)
  public directions: DirectionsMapDirective;

  public origin: any;
  public destination: any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private gmapsApi: GoogleMapsAPIWrapper
  ) {}

  ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    this.climbSearch = new FormGroup({
      originSearchControl: new FormControl('', Validators.required),
      destSearchControl: new FormControl('', Validators.required),
      distanceControl: new FormControl('', Validators.required)
    });

    this.setCurrentPosition();

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
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
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

          this.directions.updateRoute();
          this.zoom = 12;
        });

      });
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
      this.directions.findCrags(value.distanceControl);
    }
}