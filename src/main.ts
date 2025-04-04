import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



bootstrapApplication(AppComponent, {
  ...appConfig, // ⬅️ Include existing app configuration
  providers: [
    ...(appConfig.providers || []), // Preserve existing providers
    provideHttpClient(withInterceptorsFromDi()) // Add new HttpClient provider
  ]
}).catch((err) => console.error(err));