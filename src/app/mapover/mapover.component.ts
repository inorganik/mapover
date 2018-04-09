import { Component, AfterViewInit, ViewChild, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { AgmMap, MapTypeStyle } from '@agm/core';
import { MatDialog } from '@angular/material/dialog';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { MapLocation, allMapLocations } from './map-location';
import { MapstyleService } from './mapstyle.service';
import { ShareModalComponent } from './share-modal/share-modal.component';

declare let google: any;

@Component({
  selector: 'app-mapover',
  templateUrl: './mapover.component.html',
  styleUrls: ['./mapover.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class MapoverComponent implements AfterViewInit {

  allMapLocations: MapLocation[] = allMapLocations;
  mapLocations: MapLocation[] = [];

  zoom = 11;

  loading = false;
  secondaryOnTop = true;
  isCollapsed = false;

  place1: any;
  place2: any;
  placesService: any;

  @ViewChild(AgmMap) agmMap;

  mapStyle1: MapTypeStyle[] = [];
  mapStyle2: MapTypeStyle[] = [];

  themeIndex = 0;
  themes = [
    ['#00bceb', '#ff0055'],
    ['#FFC107', '#00bceb'],
    ['#ff0055', '#FFC107']
  ];

  width = 700;

  constructor(
    private location: Location,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private applicationRef: ApplicationRef,
    public dialog: MatDialog,
    private mapstyleService: MapstyleService
  ) {
    // icons
    this.addIcon('pan', 'ic_pan_tool_black_24px.svg');
    this.addIcon('search', 'ic_search_black_24px.svg');
    this.addIcon('swap-vert', 'ic_swap_vert_black_24px.svg');
    this.addIcon('visibility', 'ic_visibility_black_24px.svg');
    this.addIcon('visibility-off', 'ic_visibility_off_black_24px.svg');
    this.addIcon('share-image', 'ic_mms_black_24px.svg');
    this.addIcon('random', 'ic_cached_black_24px.svg');
    this.addIcon('collapse', 'ic_keyboard_arrow_up_black_24px.svg');
    this.addIcon('expand', 'ic_keyboard_arrow_down_black_24px.svg');
    // set mapLocations and theme
    this.setThemeIndex(this.themeIndex);
    this.randomLocationForIndex(0);
    this.randomLocationForIndex(1);
    // modal
    if (window.innerWidth < this.width) {
      this.width = window.innerWidth;
    }
  }

  addIcon(iconName, filename) {
    const iconPath = 'assets/icons/';
    const url = this.location.prepareExternalUrl(iconPath + filename);
    this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  randomMapLocation() {
    const rand = Math.floor(Math.random() * this.allMapLocations.length);
    return this.allMapLocations[rand];
  }

  randomLocationForIndex(idx) {
    if (this.mapLocations[idx]) {
      this.mapLocations[idx].isVisible = true;
    }
    let randLoc = this.randomMapLocation();
    const oppo = this.oppositeIndex(idx);
    while (this.mapLocations[idx] && this.mapLocations[idx].description === randLoc.description ||
      this.mapLocations[oppo] && this.mapLocations[oppo].description === randLoc.description) {
      randLoc = this.randomMapLocation();
    }
    this.mapLocations[idx] = randLoc;
    if (this.mapLocations[0] && this.mapLocations[1]) {
      this.setActive(idx);
    }
  }

  randomTheme() {
    const randomTheme = Math.floor(Math.random() * this.themes.length);
    this.setThemeIndex(randomTheme);
  }

  randomize() {
    this.randomTheme();
    this.resetZoom();
    this.randomLocationForIndex(0);
    this.randomLocationForIndex(1);
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
    console.log('set place', place.description);
    this.mapLocations[idx].description = place.description;
    if (this.placesService) {
      this.loading = true;
      this.placesService.getDetails({
        placeId: place.place_id
      }, (placeDetails, status) => {
        this.loading = false;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.mapLocations[idx].lat = placeDetails.geometry.location.lat();
          this.mapLocations[idx].lng = placeDetails.geometry.location.lng();
          console.log('set coords:', this.mapLocations[idx].lat, this.mapLocations[idx].lng);
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
    const loc2 = this.mapLocations[1];
    const loc1 = this.mapLocations[0];
    this.mapLocations = [loc2, loc1];
    this.secondaryOnTop = !this.secondaryOnTop;
  }

  swapActive() {
    this.mapLocations[0].isActive = !this.mapLocations[0].isActive;
    this.mapLocations[1].isActive = !this.mapLocations[0].isActive;
  }

  oppositeIndex(idx) {
    return (idx === 0) ? 1 : 0;
  }
  setActive(idx) {
    this.mapLocations[idx].isActive = true;
    this.mapLocations[this.oppositeIndex(idx)].isActive = false;
  }

  toggleVisibility(idx) {
    this.mapLocations[idx].isVisible = !this.mapLocations[idx].isVisible;
    if (this.mapLocations[idx].isVisible === false) {
      this.mapLocations[this.oppositeIndex(idx)].isVisible = true;
      this.setActive(this.oppositeIndex(idx));
    }
  }

  openShareModal(): void {
    console.log('mapLocations', this.mapLocations);
    const modalRef = this.dialog.open(ShareModalComponent, {
      width: this.width + 'px',
      hasBackdrop: true,
      data: {
        mapLocations: this.mapLocations,
        colors: this.themes[this.themeIndex],
        topIndex: (this.secondaryOnTop) ? 1 : 0,
        zoom: this.zoom
      }
    });
  }

  setThemeIndex(idx) {
    this.themeIndex = idx;
    const theme = this.themes[idx];
    this.mapStyle1 = this.mapstyleService.generateWithColor(theme[0]);
    this.mapStyle2 = this.mapstyleService.generateWithColor(theme[1]);
  }

}
