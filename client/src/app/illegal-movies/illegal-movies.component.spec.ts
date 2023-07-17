import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllegalMoviesComponent } from './illegal-movies.component';

describe('IllegalMoviesComponent', () => {
  let component: IllegalMoviesComponent;
  let fixture: ComponentFixture<IllegalMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IllegalMoviesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllegalMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
