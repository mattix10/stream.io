import { Pipe, PipeTransform } from '@angular/core';
import { licenseTypeValueLabels } from '../models/license-type-value-labels';
import { LicenseType } from 'src/app/core/models/license-type.enum';

@Pipe({
  name: 'licenseType',
  standalone: true,
})
export class LicenseTypePipe implements PipeTransform {
  transform(value: LicenseType): string {
    const licenseLabel = licenseTypeValueLabels.find(
      (label) => label.value === value
    );
    return licenseLabel ? licenseLabel.label : '';
  }
}
