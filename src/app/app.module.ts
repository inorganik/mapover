import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { APP_BASE_HREF } from '@angular/common';
// custom
import { SharedModule } from './shared/shared.module';
import { MapoverModule } from './mapover/mapover.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MapoverModule,
    SharedModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
  for local dev:
  { provide: APP_BASE_HREF, useValue: '/'}

  for prod:
  { provide: APP_BASE_HREF, useValue: '/mapover'}
  prod build:
  ng build --prod --deploy-url=mapover
*/
