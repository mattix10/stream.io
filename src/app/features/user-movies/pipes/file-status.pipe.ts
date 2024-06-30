import { Pipe, PipeTransform } from '@angular/core';
import { FileStatus } from 'src/app/core/models/file-status';

@Pipe({
  name: 'fileStatus',
  standalone: true,
})
export class FileStatusPipe implements PipeTransform {
  transform(value: FileStatus): string {
    switch (value) {
      case FileStatus.Failed:
        return 'Wgrywanie pliku nie powiodło się.';
      case FileStatus.InProgress:
        return 'Wgrywanie pliku w trakcie.';
      case FileStatus.Success:
        return 'Plik został wgrany.';
    }
  }
}
