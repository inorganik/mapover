import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
// google maps
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
// custom
import { MapoverComponent } from './mapover.component';
import { SharedModule } from '../shared/shared.module';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { MapstyleService } from './mapstyle.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    })
  ],
  declarations: [
    MapoverComponent,
    PlaceSearchComponent,
    ShareModalComponent
  ],
  entryComponents: [
    ShareModalComponent
  ],
  providers: [
    MapstyleService
  ]
})
export class MapoverModule { }
