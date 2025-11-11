import { Pipe, PipeTransform } from '@angular/core';
import { licenseDurationLabels } from '../models/license-duration-labels';
import { LicenseDuration } from '@app/core/models/enums/license-duration.enum';

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
