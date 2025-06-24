import {createApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {createCustomElement} from '@angular/elements';

createApplication(appConfig)
  .then((app) => {
    const appComponent = createCustomElement(AppComponent, {injector: app.injector});
    customElements.define('mpage-developer-component-template', appComponent);
  })
  .catch((err) => console.error(err));
