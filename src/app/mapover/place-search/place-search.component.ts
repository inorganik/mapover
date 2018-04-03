import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { WindowRef } from '@agm/core/utils/browser-globals';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';

declare let google: any;

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  encapsulation: ViewEncapsulation.None
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlaceSearchComponent implements OnInit {

  autocompleteService: any;

  placeCtrl = new FormControl('', []);
  predicts = [];
  keyupTimeout: any;
  keyupDelay = 500;

  @Output() onSelected = new EventEmitter<any>();

  // location
  private _location: any;
  get location(): any {
    return this._location;
  }
  @Input()
  set location(val) {
    this._location = val;
    this.placeCtrl.setValue(this._location);
  }

  constructor(
    private loader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.loader.load().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });
    if (this.location && this.location.place_id) {
      this.placeCtrl.setValue(this.location);
    }
  }

  onChange(event) {
    clearTimeout(this.keyupTimeout);
    this.keyupTimeout = setTimeout(() => {
      this.placeSearch();
    }, this.keyupDelay);
  }

  placeSearch() {
    const term = this.placeCtrl.value;
    console.log('place search', term);
    if (term.length > 0) {
      if (this.autocompleteService) {
        this.autocompleteService.getPlacePredictions({
          input: term,
          types: ['(regions)']
        }, (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.predicts = predictions;
          }
          else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            this.predicts = [
              { description: 'No results' }
            ];
          }
          else {
            this.predicts = [
              { description: 'Server error' }
            ];
            console.error(status);
          }
          console.log('got predicts');
        });
      }
      else {
        console.error('No autocomplete service');
      }
    }
    else {
      this.predicts = [];
    }
  }

  // different view/model values for autocomplete
  displayFn(placeObj: any) {
    return placeObj ? placeObj.description : '';
  }

  selectedPlace(place) {
    console.log('selected place from autocomplete', place);
    this.onSelected.emit(place.option.value);
  }

}
