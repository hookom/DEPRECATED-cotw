import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cotw-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.css'],
})
export class SocialComponent {
  closeClicked = false;

  onClick() {
      this.closeClicked= !this.closeClicked;
  }
    
    // $("#click").click(function(){
    //   $("#nav").toggleClass("closed");
    // });
}
