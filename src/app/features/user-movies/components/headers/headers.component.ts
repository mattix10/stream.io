import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [],
  templateUrl: './headers.component.html',
  styleUrl: './headers.component.scss',
})
export class HeadersComponent {
  @Input({ required: true }) isEditMode: boolean = false;

  @Output() editModeChanged = new EventEmitter<boolean>();

  changeEditMode(isEditMode: boolean): void {
    this.isEditMode = isEditMode;
    this.editModeChanged.emit(this.isEditMode);
  }
}
