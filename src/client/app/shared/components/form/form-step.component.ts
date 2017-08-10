import { Component, Input } from '@angular/core';

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
  @Input() hidden: boolean = false;
  @Input() isValid: boolean = true;

  private _isActive: boolean = false;
  isDisabled: boolean = true;

  constructor() { }

  @Input('isActive')
  set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }

}
