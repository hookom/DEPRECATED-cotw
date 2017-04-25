import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { AddModule } from './add.module';

export function main() {
   describe('Add component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [AddModule]
      });
    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let addDOMEl = fixture.debugElement.children[0].nativeElement;

              expect(addDOMEl.querySelectorAll('h2')[0].textContent).toEqual('Features');
          });
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-add></sd-add>'
})
class TestComponent {}
