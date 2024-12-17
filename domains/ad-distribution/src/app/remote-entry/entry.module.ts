import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntryComponent } from './entry.component';

@NgModule({
  declarations: [EntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EntryComponent
      }
    ])
  ]
})
export class RemoteEntryModule { }
