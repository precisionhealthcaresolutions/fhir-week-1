import {
  ApplicationConfig, ErrorHandler,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';

import {routes} from './app.routes';
import {ConfigService, ErrorHandlerService} from '@clinicaloffice/mpage-developer';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

// Custom date formats
export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: ['dd-MMM-yyyy'],
  },
  display: {
    dateInput: 'dd-MMM-yyyy',
    dateLabel: 'dd-MMM-yyyy',
    dateTimeLabel: 'dd-MMM-yyyy HH:mm',
    locale: 'en-US',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    provideAnimationsAsync('noop'),
    provideAppInitializer(() => {
      // Load the config.json file (if not using, remove the next two lines or the entire provideAppInitializer section.
//      const configService = inject(ConfigService);
//      return configService.loadConfig();
    }),
    {provide: ErrorHandler, useClass: ErrorHandlerService}
  ]
};
