import { Pipe, PipeTransform } from '@angular/core';
import {
  LicenseDuration,
  licenseDurationLabels,
} from 'src/app/core/models/license-rule';

@Pipe({
  name: 'licenseDuration',
  standalone: true,
})
export class LicenseDurationPipe implements PipeTransform {
  transform(value: LicenseDuration): string {
    const licenseDurationLabel = licenseDurationLabels.find(
      (label) => label.value === value
    );
    return licenseDurationLabel ? licenseDurationLabel.label : '';
  }
}
