import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAuctionsComponent } from './single-auctions.component';

describe('SingleAuctionsComponent', () => {
  let component: SingleAuctionsComponent;
  let fixture: ComponentFixture<SingleAuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleAuctionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
