import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
// custom
import { SharedModule } from './shared/shared.module';
import { MapoverModule } from './mapover/mapover.module';
import { MapoverComponent } from './mapover/mapover.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MapoverModule,
    SharedModule,
    RouterModule.forRoot(
      [
        { path: 'mapover', component: MapoverComponent },
      ],
      { enableTracing: false } // enable for debug only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// ng build --prod --base-href mapover
