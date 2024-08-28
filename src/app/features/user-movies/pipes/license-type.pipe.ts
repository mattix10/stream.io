import { Pipe, PipeTransform } from '@angular/core';
import { LicenseType } from 'src/app/core/models/enums/license-type.enum';
import { licenseTypeLabels } from '../models/license-type-labels';

@Pipe({
  name: 'licenseType',
  standalone: true,
})
export class LicenseTypePipe implements PipeTransform {
  transform(licenseType: LicenseType): string {
    return (
      licenseTypeLabels.find(({ value }) => value === licenseType)?.label ?? ''
    );
  }
}
