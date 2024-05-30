import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileType } from 'src/app/core/models/file-type';

@Component({
  selector: 'app-drag-and-drop-upload-file',
  standalone: true,
  imports: [NgIf],
  templateUrl: './drag-and-drop-upload-file.component.html',
  styleUrl: './drag-and-drop-upload-file.component.scss',
})
export class DragAndDropUploadFileComponent {
  file?: File;
  isDragOver = false;

  @Input({ required: true }) fileType: FileType = FileType.Image;
  @Input({ required: true }) label: string = 'Plik';

  @Output() removeFileChanged = new EventEmitter();
  @Output() uploadFileChanged = new EventEmitter<File>();

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.file = files[0];
      this.uploadFileChanged.emit(this.file);
    }
    this.isDragOver = false;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onInputChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.file = files[0];
      this.uploadFileChanged.emit(this.file);
    }
  }

  removeFile(): void {
    this.file = undefined;
    this.removeFileChanged.emit();
  }
}
