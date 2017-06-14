import { Component } from '@angular/core';
import { ShareButtonsModule } from 'ngx-sharebuttons';

@Component({
  moduleId: module.id,
  selector: 'cotw-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})
export class HeaderComponent {
  totalShare: number = 0;
  sumCounts(count: number){
    this.totalShare += count;
  }
}
