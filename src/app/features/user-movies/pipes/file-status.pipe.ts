import { Pipe, PipeTransform } from '@angular/core';
import { FileStatus } from '../models/file-status';

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
        return 'Trwa wgrywanie pliku.';
      case FileStatus.Success:
        return 'Plik został wgrany pomyślnie.';
    }
  }
}
