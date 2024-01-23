import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationComponent } from './authorisation.component';

describe('AuthorisationComponent', () => {
  let component: AuthorisationComponent;
  let fixture: ComponentFixture<AuthorisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
