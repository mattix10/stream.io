import { Pipe, PipeTransform } from '@angular/core';
import {
  LicenseType,
  licenseTypeValueLabels,
} from 'src/app/core/models/license-rule';

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
