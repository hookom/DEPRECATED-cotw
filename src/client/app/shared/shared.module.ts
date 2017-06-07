import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { HttpModule } from '@angular/http';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FindMapComponent } from './components/findMap/findMap.component';
import { AddMapComponent } from './components/addMap/addMap.component';
import { RouteBoxerService } from './services/routeboxer/routeboxer.service';
import { DirectionsMapDirective } from './directives/directions.directive';
import { LocationsService } from './services/locations/locations.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule,
            AgmCoreModule.forRoot({
              apiKey: 'AIzaSyA-2Qvfc-Qj1sgX0Mpp4FKz8L86d5ycF5U',
              libraries: ['places']
            }),
            BrowserModule, FormsModule,
            ReactiveFormsModule, HttpModule],
  declarations: [NavbarComponent, AddMapComponent, FindMapComponent, DirectionsMapDirective],
  exports: [NavbarComponent, AddMapComponent, FindMapComponent,
            CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [RouteBoxerService, LocationsService]
    };
  }
}
