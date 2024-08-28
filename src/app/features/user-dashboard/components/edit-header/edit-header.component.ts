import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-header',
  standalone: true,
  templateUrl: './edit-header.component.html',
  styleUrl: './edit-header.component.scss',
})
export class EditHeaderComponent {
  isEditMode: boolean = false;

  @Input() header = '';
  @Output() editChanged = new EventEmitter<boolean>();

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
    this.editChanged.emit(this.isEditMode);
  }
}
