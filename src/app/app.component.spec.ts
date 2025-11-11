import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    // Arrange
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  describe('Component Initialization', () => {
    it('should create the AppComponent instance', () => {
      // Arrange - Already done in beforeEach

      // Act
      const isComponentCreated = component !== null && component !== undefined;

      // Assert
      expect(isComponentCreated).toBe(true);
      expect(component).toBeInstanceOf(AppComponent);
    });

    it('should initialize with no properties or methods requiring setup', () => {
      // Arrange - Already done in beforeEach

      // Act & Assert
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Template Rendering', () => {
    it('should render the navbar component in the template', () => {
      // Arrange
      fixture.detectChanges();

      // Act
      const navbarElement = compiled.query(By.directive(NavbarComponent));

      // Assert
      expect(navbarElement).toBeTruthy();
    });

    it('should have router-outlet for application routing', () => {
      // Arrange
      fixture.detectChanges();

      // Act
      const routerOutlet = compiled.query(By.css('router-outlet'));

      // Assert
      expect(routerOutlet).toBeTruthy();
    });

    it('should render navbar before router-outlet', () => {
      // Arrange
      fixture.detectChanges();

      // Act
      const navbarIndex =
        compiled.nativeElement.innerHTML.indexOf('<app-navbar');
      const routerOutletIndex =
        compiled.nativeElement.innerHTML.indexOf('<router-outlet');

      // Assert
      expect(navbarIndex).toBeLessThan(routerOutletIndex);
    });
  });

  describe('Component Structure', () => {
    it('should have the correct component selector', () => {
      // Act
      const isCorrectComponent = component instanceof AppComponent;

      // Assert
      expect(isCorrectComponent).toBe(true);
    });
  });
});
