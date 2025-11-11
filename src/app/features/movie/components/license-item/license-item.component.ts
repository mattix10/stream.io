import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DEFAULT_CURRENCY_CODE,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core';
import { LicenseType } from '@app/core/models/enums/license-type.enum';
import { LicenseTypePipe } from '@app/features/user-movies/pipes/license-type.pipe';
import '@angular/common/locales/global/pl';
import { LicenseDurationPipe } from '@app/features/user-movies/pipes/license-duration.pipe';
import { LicenseRule } from '@app/core/models/interfaces/license-rule';

@Component({
  selector: 'app-license-item',
  imports: [CurrencyPipe, LicenseTypePipe, LicenseDurationPipe],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pl',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'zł',
    },
  ],
  templateUrl: './license-item.component.html',
  styleUrl: './license-item.component.scss',
})
export class LicenseItemComponent implements OnInit {
  @Input() licenseRule?: LicenseRule;
  @Input() isSelectedRule = false;
  @Input() set isLicenseExpired(isLicenseExpired: boolean) {
    if (!isLicenseExpired) return;
    this.setIconName('expired-license');
  }

  @Output() selectLicenseRuleChanged = new EventEmitter<LicenseRule>();

  protected iconName: string = 'buy-license';

  private licenseIconName: Record<LicenseType, string> = {
    [LicenseType.Buy]: 'buy-license',
    [LicenseType.Rent]: 'rent-license',
  };

  ngOnInit(): void {
    this.setIconName();
  }

  onSelectLicenseRule(licenseRule: LicenseRule): void {
    this.selectLicenseRuleChanged.emit(licenseRule);
  }

  private setIconName(iconName?: string): void {
    this.iconName = iconName
      ? iconName
      : this.licenseIconName[this.licenseRule?.type!];
  }
}
