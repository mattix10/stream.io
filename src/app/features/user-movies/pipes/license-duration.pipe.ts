import { Pipe, PipeTransform } from '@angular/core';
import { licenseDurationLabels } from '../models/license-duration-labels';
import { LicenseDuration } from 'src/app/core/models/license-duration.enum';

@Pipe({
  name: 'licenseDuration',
  standalone: true,
})
export class LicenseDurationPipe implements PipeTransform {
  transform(value: LicenseDuration | undefined | null): string {
    const licenseDurationLabel = licenseDurationLabels.find(
      (label) => label.value === value
    );
    return licenseDurationLabel ? licenseDurationLabel.label : '';
  }
}
