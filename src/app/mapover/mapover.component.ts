import { Component, AfterViewInit, ViewChild, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { AgmMap } from '@agm/core';

import { mapStyle1 } from './map-styles/mapstyle-1';
import { mapStyle2 } from './map-styles/mapstyle-2';
import { Location, allLocations } from './location';

declare let google: any;

@Component({
  selector: 'app-mapover',
  templateUrl: './mapover.component.html',
  styleUrls: ['./mapover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapoverComponent implements AfterViewInit {

  allLocations: Location[] = allLocations;
  locations: Location[];

  zoom = 11;

  mapStyle1 = mapStyle1;
  mapStyle2 = mapStyle2;

  loading = false;
  secondaryOnTop = true;

  place1: any;
  place2: any;
  placesService: any;

  @ViewChild(AgmMap) agmMap;

  constructor(
    titleService: Title,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private applicationRef: ApplicationRef
  ) {
    titleService.setTitle('MAPOVER');
    // icons
    const iconPath = '../../assets/icons/';
    iconRegistry.addSvgIcon('pan', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_pan_tool_black_24px.svg'));
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_search_black_24px.svg'));
    iconRegistry.addSvgIcon('swap-vert', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_swap_vert_black_24px.svg'));
    iconRegistry.addSvgIcon('visibility', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_visibility_black_24px.svg'));
    iconRegistry.addSvgIcon('visibility-off', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_visibility_off_black_24px.svg'));
    // locations
    this.locations = this.allLocations.slice(0, 2);
  }

  ngAfterViewInit() {
    // place details service
    this.agmMap.mapReady.subscribe(map => {
      this.placesService = new google.maps.places.PlacesService(map);
    });
  }

  // place chosen from typeahead
  setPlace(idx, place) {
    this.setActive(idx);
    console.log('set place', place);
    if (this.placesService) {
      this.loading = true;
      this.placesService.getDetails({
        placeId: place.place_id
      }, (placeDetails, status) => {
        this.loading = false;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.locations[idx].lat = placeDetails.geometry.location.lat();
          this.locations[idx].lng = placeDetails.geometry.location.lng();
          console.log('set coords:', this.locations[idx].lat, this.locations[idx].lng);
          this.resetZoom();
          this.applicationRef.tick();
        }
        else {
          console.error(status);
        }
      });
    }
  }

  zoomChanged(zoom) {
    this.zoom = zoom;
  }

  resetZoom() {
    this.zoom = 11;
  }

  swapLocations() {
    const loc2 = this.locations[1];
    const loc1 = this.locations[0];
    this.locations = [loc2, loc1];
    this.secondaryOnTop = !this.secondaryOnTop;
  }

  swapActive() {
    this.locations[0].isActive = !this.locations[0].isActive;
    this.locations[1].isActive = !this.locations[0].isActive;
  }

  oppositeIndex(idx) {
    return (idx === 0) ? 1 : 0;
  }
  setActive(idx) {
    this.locations[idx].isActive = true;
    this.locations[this.oppositeIndex(idx)].isActive = false;
  }

  toggleVisibility(idx) {
    this.locations[idx].isVisible = !this.locations[idx].isVisible;
    if (this.locations[idx].isVisible === false) {
      this.locations[this.oppositeIndex(idx)].isVisible = true;
      this.setActive(this.oppositeIndex(idx));
    }
  }

}
