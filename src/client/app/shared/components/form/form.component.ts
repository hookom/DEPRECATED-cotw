import { Component, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { FormStepComponent } from './form-step.component';

@Component({
  moduleId: module.id,
  selector: 'cotw-form',
  template:
  `<div class="stepForm">
    <div class="backArrow" [hidden]="isCompleted">
      <button type="button" (click)="previous()" [hidden]="!hasPrevStep || !activeStep.showPrev">
        <i class="fa fa-caret-left fa-4x"></i>
      </button>
    </div>
    <div class="steps">
      <ng-content></ng-content>
    </div>
    <div class="nextArrow" [hidden]="isCompleted">
      <button type="button" (click)="next()" [disabled]="!activeStep.isValid" [hidden]="!hasNextStep || !activeStep.showNext">
        <i class="fa fa-caret-right fa-4x"></i>
      </button>
    </div>
  </div>`
  ,
  styleUrls: ['form.component.css']
})
export class FormComponent implements AfterContentInit {
  @ContentChildren(FormStepComponent)
  wizardSteps: QueryList<FormStepComponent>;

  private _steps: Array<FormStepComponent> = [];
  private _isCompleted: boolean = false;

  @Output()
  onStepChanged: EventEmitter<FormStepComponent> = new EventEmitter<FormStepComponent>();

  constructor() { }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  get steps(): Array<FormStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get activeStep(): FormStepComponent {
    return this.steps.find(step => step.isActive);
  }

  set activeStep(step: FormStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
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

  public goToStep(step: FormStepComponent): void {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  public next(): void {
    if (this.hasNextStep) {
      let nextStep: FormStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      let prevStep: FormStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

  public complete(): void {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  }

}
