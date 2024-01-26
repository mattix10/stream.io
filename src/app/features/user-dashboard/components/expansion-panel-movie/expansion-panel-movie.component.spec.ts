import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanelMovieComponent } from './expansion-panel-movie.component';

describe('ExpansionPanelMovieComponent', () => {
  let component: ExpansionPanelMovieComponent;
  let fixture: ComponentFixture<ExpansionPanelMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionPanelMovieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpansionPanelMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
