import { Component, Input, ContentChildren, QueryList } from '@angular/core';

@Component({
  selector: 'cotw-form-step',
  template:
  `
    <div [hidden]="!isActive">
      <ng-content></ng-content>
    </div>
  `
})
export class FormStepComponent {
  @ContentChildren('childForm') form: any;

  private _isActive: boolean = false;

  constructor() { }

  ngAfterContentInit() {
    // this breaks form on add page
    // console.log(this.form.first.nativeElement);
  }

  set isActive(val: boolean) {
    this._isActive = val;
  }

  get isActive(): boolean {
    return this._isActive;
  }

}
