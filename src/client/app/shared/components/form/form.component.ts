import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { FormStepComponent } from './form-step.component';

@Component({
  moduleId: module.id,
  selector: 'cotw-form',
  template:
  `<div class="stepForm">
    <button type="button" (click)="previous()" [ngClass]="{'hidden-btn': !hasPrevStep}">
      <i class="fa fa-caret-left fa-4x"></i>
    </button>
    <div class="steps">
      <ng-content></ng-content>
    </div>
    <button type="button" (click)="next()" [disabled]="!activeStep.isValid" [ngClass]="{'hidden-btn': !hasNextStep}">
      <i class="fa fa-caret-right fa-4x"></i>
    </button>
  </div>`
  ,
  styleUrls: ['form.component.css']
})
export class FormComponent implements AfterContentInit {
  @ContentChildren(FormStepComponent)
  wizardSteps: QueryList<FormStepComponent>;

  private _steps: Array<FormStepComponent> = [];

  constructor() { }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  get steps(): Array<FormStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get activeStep(): FormStepComponent {
    return this.steps.find(step => step.isActive);
  }

  set activeStep(step: FormStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
    }
  }

  public get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  public next(): void {
    if (this.hasNextStep) {
      let nextStep: FormStepComponent = this.steps[this.activeStepIndex + 1];
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      let prevStep: FormStepComponent = this.steps[this.activeStepIndex - 1];
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

}
