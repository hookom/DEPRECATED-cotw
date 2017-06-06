import { Component, OnInit, ElementRef, NgZone, ViewChild, NgModule, Directive, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MapsAPILoader, AgmCoreModule } from '@agm/core';
import { } from '@types/googlemaps';

import { DirectionsMapDirective } from '../../directives/directions.directive';

@Component({
    moduleId: module.id,
    selector: 'cotw-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
    providers: []
})

export class MapComponent implements OnInit {

  public orig: any;
  public dest: any;
  public lat: number;
  public long: number;
  public zoom: number;
  public climbSearch: FormGroup;

  @ViewChild('originSearch')
  public originSearchElementRef: ElementRef;

  @ViewChild('destSearch')
  public destSearchElementRef: ElementRef;

  @ViewChild(DirectionsMapDirective)
  public directions: DirectionsMapDirective;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.zoom = 4;
    this.lat = 39.8282;
    this.long = -98.5795;

    this.climbSearch = new FormGroup({
      originSearchControl: new FormControl('', Validators.required),
      destSearchControl: new FormControl('', Validators.required),
      distanceControl: new FormControl('', Validators.required)
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setMapFocus(position.coords.latitude, position.coords.longitude);
      });
    }

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

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.directions.findCrags(value.distanceControl);
  }

  private setMapFocus(lat: number, long: number) {
    this.lat = lat;
    this.long = long;
    this.zoom = 12;
  }

  private setupPlaceChangedListener(autocomplete: any, mode: any ) {
    autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined) {
            return;
          }

          if (mode === 'ORG') {
            this.directions.origin = {
              longitude: place.geometry.location.lng(),
              latitude: place.geometry.location.lat()
            };
            this.directions.originPlaceId = place.place_id;
          } else {
            this.directions.destination = {
              longitude: place.geometry.location.lng(),
              latitude: place.geometry.location.lat()
            };
            this.directions.destinationPlaceId = place.place_id;
          }

          this.setMapFocus(place.geometry.location.lat(), place.geometry.location.lng());

          if(this.directions.directionsDisplay === undefined) {
            this.mapsAPILoader.load()
              .then(() => {
                this.directions.directionsDisplay = new google.maps.DirectionsRenderer;
              });
          }

          this.directions.updateRoute();
        });

      });
    }
}
