import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdsComponent } from './account-ads.component';

describe('AccountAdsComponent', () => {
  let component: AccountAdsComponent;
  let fixture: ComponentFixture<AccountAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
