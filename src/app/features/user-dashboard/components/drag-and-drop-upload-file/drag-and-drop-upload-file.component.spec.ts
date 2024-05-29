import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropUploadFileComponent } from './drag-and-drop-upload-file.component';

describe('DragAndDropUploadFileComponent', () => {
  let component: DragAndDropUploadFileComponent;
  let fixture: ComponentFixture<DragAndDropUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropUploadFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DragAndDropUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
