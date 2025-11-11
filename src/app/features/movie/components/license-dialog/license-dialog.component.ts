import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LicenseItemComponent } from '../license-item/license-item.component';
import { LicenseDialogConfigDetails } from '../../models/license-dialog-config';
import { dialogConfig } from './license-dialog-config';
import { isLoading } from 'src/app/core/models/interfaces/loading';
import { EMPTY, finalize, Observable, tap } from 'rxjs';
import { LicenseService } from '../../services/license.service';
import { LicenseDialogType } from '../../models/license-dialog-type';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { LicenseRule } from 'src/app/core/models/interfaces/license-rule';

@Component({
    selector: 'app-license-dialog',
    imports: [LicenseItemComponent, SpinnerComponent],
    templateUrl: './license-dialog.component.html',
    styleUrl: './license-dialog.component.scss'
})
export class LicenseDialogComponent implements isLoading {
  @Input({ required: true }) licenseRules?: LicenseRule[];
  @Input({ required: true }) licenseId?: string;

  @Input({ required: true }) set licenseDialogType(
    licenseDialogType: LicenseDialogType | undefined
  ) {
    if (!licenseDialogType) return;

    this.dialogConfig = dialogConfig[licenseDialogType];
    this.dialogType = licenseDialogType;
    this.isLicenseExpired = licenseDialogType === LicenseDialogType.Renew;
  }

  @Input({ required: true }) contentId?: string;

  @Output() submitButtonChanged = new EventEmitter<void>();

  isLoading: boolean = false;
  protected isLicenseExpired = false;
  protected dialogConfig: LicenseDialogConfigDetails =
    dialogConfig[LicenseDialogType.Buy];
  protected selectedRuleIndex?: number;
  protected dialogType?: LicenseDialogType;
  readonly #licenseService = inject(LicenseService);
  #selectedLicenseRule?: LicenseRule;

  onSelectLicenseRuleChange(licenseRule: LicenseRule, ruleIndex: number): void {
    this.selectedRuleIndex = ruleIndex;
    this.#selectedLicenseRule = licenseRule;
  }

  onSubmit(): void {
    if (!this.dialogType) return;
    this.isLoading = true;

    const call =
      this.dialogType === LicenseDialogType.Buy
        ? this.buyLicenseCall()
        : this.renewLicenseCall();

    call
      .pipe(
        tap(() => this.submitButtonChanged.emit()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  buyLicenseCall(): Observable<Response> {
    if (!this.#selectedLicenseRule || !this.contentId) return EMPTY;

    return this.#licenseService.createLicense({
      licenseRulesModel: this.#selectedLicenseRule,
      contentId: this.contentId,
    });
  }

  renewLicenseCall(): Observable<Response> {
    if (!this.#selectedLicenseRule || !this.licenseId || !this.contentId)
      return EMPTY;

    return this.#licenseService.updateLicense(
      {
        licenseRulesModel: this.#selectedLicenseRule,
        contentId: this.contentId,
      },
      this.licenseId
    );
  }
}
