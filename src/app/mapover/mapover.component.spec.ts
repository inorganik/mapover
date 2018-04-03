import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapoverComponent } from './mapover.component';

describe('MapoverComponent', () => {
  let component: MapoverComponent;
  let fixture: ComponentFixture<MapoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
