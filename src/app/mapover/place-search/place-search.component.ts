import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { WindowRef } from '@agm/core/utils/browser-globals';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';

declare let google: any;

interface Place {
  description: string;
  matched_substrings: [any];
  place_id: string;
  terms: [any];
  types: [string];
}

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  encapsulation: ViewEncapsulation.None
})

export class PlaceSearchComponent implements OnInit {

  autocompleteService: any;

  placeCtrl = new FormControl();
  keyupDelay = 500;
  places$: Observable<any>;

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

  @Input()
  color: string;

  constructor(
    private loader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.loader.load().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });

    this.places$ = this.placeCtrl.valueChanges.pipe(
      debounceTime(this.keyupDelay),
      distinctUntilChanged(),
      switchMap(searchTerm => this.placeSearch(searchTerm))
    );
  }

  placeSearch(searchTerm): Observable<Place[]> {
    if (searchTerm.length > 0) {
      if (!this.autocompleteService) {
        console.error('No autocomplete service');
        return of([]);
      }
      return Observable.create(obs => {
        const getPredicts = (predictions, status) => {
          // console.log('got predicts', predictions, status);
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            obs.next(predictions.slice());
          }
          else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            obs.next([
              { description: 'No results' }
            ]);
          }
          else {
            console.error(status);
            obs.next([
              { description: 'Server error' }
            ]);
          }
          obs.complete();
        };

        this.autocompleteService.getPlacePredictions({
          input: searchTerm,
          types: ['(regions)']
        }, getPredicts);
      });
    }
    else {
      return of([]);
    }
  }

  // different view/model values for autocomplete
  displayFn(place: Place) {
    return place ? place.description : '';
  }

  selectedPlace(place) {
    // console.log('selected place from autocomplete', place);
    this.onSelected.emit(place.option.value);
  }

}
