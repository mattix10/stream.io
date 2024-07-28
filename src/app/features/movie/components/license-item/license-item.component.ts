import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  DEFAULT_CURRENCY_CODE,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core';
import { LicenseRule } from 'src/app/core/models/license-rule';
import { LicenseType } from 'src/app/core/models/license-type.enum';
import { LicenseTypePipe } from 'src/app/features/user-movies/pipes/license-type.pipe';
import '@angular/common/locales/global/pl';
import { LicenseDurationPipe } from 'src/app/features/user-movies/pipes/license-duration.pipe';

@Component({
  selector: 'app-license-item',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LicenseTypePipe, LicenseDurationPipe],
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

  iconName: string = 'buy-license';

  private licenseIconName = {
    [LicenseType.Buy]: 'buy-license',
    [LicenseType.Rent]: 'rent-license',
  };

  ngOnInit(): void {
    this.setIconName();
  }

  setIconName(iconName?: string): void {
    this.iconName = iconName
      ? iconName
      : this.licenseIconName[this.licenseRule?.type!];
  }

  onSelectLicenseRule(licenseRule: LicenseRule): void {
    this.selectLicenseRuleChanged.emit(licenseRule);
  }
}
