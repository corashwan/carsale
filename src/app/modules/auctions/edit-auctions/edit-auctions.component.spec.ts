import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuctionsComponent } from './edit-auctions.component';

describe('EditAuctionsComponent', () => {
  let component: EditAuctionsComponent;
  let fixture: ComponentFixture<EditAuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAuctionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
