import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { NameListService } from './name-list/name-list.service';
import { AgmCoreModule } from '@agm/core';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule,
            AgmCoreModule.forRoot({
              apiKey: "AIzaSyA-2Qvfc-Qj1sgX0Mpp4FKz8L86d5ycF5U",
              libraries: ["places"]
            }),
            BrowserModule, FormsModule,
            ReactiveFormsModule],
  declarations: [ToolbarComponent, NavbarComponent, MapComponent],
  exports: [ToolbarComponent, NavbarComponent, MapComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService]
    };
  }
}
