console.log('main.ts is executing...');

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Simple bootstrap since Vite's Module Federation plugin 
// handles the remote module loading automatically
console.log('About to bootstrap Angular application...');
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error bootstrapping application:', err));