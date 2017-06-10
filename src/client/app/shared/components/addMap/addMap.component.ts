import { Component, OnInit, ElementRef, NgZone, ViewChild, NgModule, Directive, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MapsAPILoader, AgmCoreModule } from '@agm/core';
import { } from '@types/googlemaps';

import { LocationsService } from '../../services/locations/locations.service';
import { Location } from '../../models/location';

@Component({
    moduleId: module.id,
    selector: 'cotw-add-map',
    templateUrl: 'addMap.component.html',
    styleUrls: ['addMap.component.css'],
    providers: [LocationsService]
})

export class AddMapComponent implements OnInit {

  public climbUpload: FormGroup;

  private errorMessage: string;
  private db_locations: Location[];
  private map: any;

  @ViewChild('nearbySearch')
  public originSearchElementRef: ElementRef;

  constructor(
    private locationsService: LocationsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.locationsService.getLocations()
        .subscribe(locations => {
                                  this.db_locations = locations;
                                  this.placeMarkers();
                                },
                    error => this.errorMessage = <any>error);

    this.climbUpload = new FormGroup({
      nearbySearchControl: new FormControl('', Validators.required),
      distanceControl: new FormControl('', Validators.required)
    });

    let mapConfig = {
            center: new google.maps.LatLng(39.8282, -98.5795),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    this.map = new google.maps.Map(document.getElementById("map-container"), mapConfig);

    this.mapsAPILoader.load().then(() => {
      let originAutocomplete = new google.maps.places.Autocomplete(this.originSearchElementRef.nativeElement, {
        types: []
      });

      originAutocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = originAutocomplete.getPlace();
          if (place.geometry === undefined) {
            return;
          }

          this.setMapFocus(place.geometry.location.lat(), place.geometry.location.lng());
        });
      });
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
  }

  private setMapFocus(lat: number, long: number) {
    this.map.setCenter(new google.maps.LatLng(lat, long));
    this.map.setZoom(12);
  }

  private placeMarkers() {
    for (let n = 0; n < this.db_locations.length; n++) {
      let temp_loc = new google.maps.LatLng(this.db_locations[n].lat, this.db_locations[n].long);

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
    }
  }
}
