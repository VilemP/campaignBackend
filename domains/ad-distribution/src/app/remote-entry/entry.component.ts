import { Component } from '@angular/core';

@Component({
  selector: 'app-ad-distribution-entry',
  template: `
    <div>
      <h2>Ad Distribution Module</h2>
      <p>This is the entry component for the Ad Distribution remote module.</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `]
})
export class EntryComponent { }
