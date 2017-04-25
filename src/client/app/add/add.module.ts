import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add.component';
import { AddRoutingModule } from './add-routing.module';

@NgModule({
  imports: [CommonModule, AddRoutingModule],
  declarations: [AddComponent],
  exports: [AddComponent]
})
export class AddModule { }
