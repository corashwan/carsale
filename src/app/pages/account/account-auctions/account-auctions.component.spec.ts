import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAuctionsComponent } from './account-auctions.component';

describe('AccountAuctionsComponent', () => {
  let component: AccountAuctionsComponent;
  let fixture: ComponentFixture<AccountAuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAuctionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
