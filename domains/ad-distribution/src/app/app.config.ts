import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      {
        path: '',
        loadChildren: () => import('./remote-entry/entry.module').then(m => m.RemoteEntryModule)
      }
    ])
  ]
};
