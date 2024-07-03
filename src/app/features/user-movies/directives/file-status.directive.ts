import { Directive, ElementRef, inject, Input } from '@angular/core';
import { FileStatus } from '../models/file-status';

@Directive({
  selector: '[appFileStatus]',
  standalone: true,
})
export class FileStatusDirective {
  @Input() set appFileStatus(fileStatus: FileStatus) {
    this.setColor(fileStatus);
  }

  #elementRef = inject(ElementRef);

  setColor(fileStatus: FileStatus): void {
    let color: string;

    switch (fileStatus) {
      case FileStatus.Failed:
        color = '#bd362f';
        break;
      case FileStatus.InProgress:
        color = 'white';
        break;
      case FileStatus.Success:
        color = '#51a351';
        break;
    }

    this.#elementRef.nativeElement.style.color = color;
  }
}
