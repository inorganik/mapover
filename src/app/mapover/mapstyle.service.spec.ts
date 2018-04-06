import { TestBed, inject } from '@angular/core/testing';

import { MapstyleService } from './mapstyle.service';

describe('MapstyleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapstyleService]
    });
  });

  it('should be created', inject([MapstyleService], (service: MapstyleService) => {
    expect(service).toBeTruthy();
  }));
});
