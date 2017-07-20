import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cotw-social',
  templateUrl: 'social.component.html',
  styleUrls: ['social.component.css'],
})
export class SocialComponent implements OnInit {
  ngOnInit() {
    $("#click").click(function(){
      $("#nav").toggleClass("closed");
    });
  }
}
