import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawnServiceComponent } from './lawn-service.component';

describe('LawnServiceComponent', () => {
  let component: LawnServiceComponent;
  let fixture: ComponentFixture<LawnServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LawnServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawnServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
