import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MapComponent } from './components/map/map.component';
import { RouteBoxerService } from './services/routeboxer/routeboxer.service';
import { AgmCoreModule } from '@agm/core';
import { DirectionsMapDirective } from './directives/directions.directive';
import { DbService } from './services/db/db.service';

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
            ReactiveFormsModule],
  declarations: [NavbarComponent, MapComponent, DirectionsMapDirective],
  exports: [NavbarComponent, MapComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [RouteBoxerService, DbService]
    };
  }
}
