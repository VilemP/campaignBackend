// app.routes.ts
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'ad-distribution',
    loadChildren: () => import('ad-distribution/Module').then(m => m.RemoteEntryModule)
  }
];