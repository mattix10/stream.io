import { JsonPipe, KeyValuePipe, NgFor } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import {
  licenseDurationOptions,
  LicenseRule,
  LicenseType,
  licenseTypeOptions,
} from 'src/app/core/models/license-rule';

@Component({
  selector: 'app-license-rules-form',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, FormsModule, NgFor, JsonPipe],
  templateUrl: './license-rules-form.component.html',
  styleUrl: './license-rules-form.component.scss',
})
export class LicenseRulesFormComponent implements OnInit {
  @Input({ required: true }) set submit(submit: Subject<void>) {
    submit
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.onSubmitChange());
  }

  @Output() rulesChanged = new EventEmitter<LicenseRule[]>();

  readonly licenseType = LicenseType;

  protected licenseDurationOptions = licenseDurationOptions;
  protected licenseTypeOptions = licenseTypeOptions;

  get rules(): FormArray {
    return this.licenseRulesForm.controls['rules'] as FormArray;
  }

  #destroyRef = inject(DestroyRef);
  #formBuilder = inject(FormBuilder);

  licenseRulesForm: FormGroup = this.#formBuilder.group({
    rules: this.#formBuilder.array([]),
  });

  ngOnInit(): void {
    this.addRule();
    this.rulesListener();
  }

  addRule(): void {
    const type = new FormControl();
    const duration = new FormControl();

    if (this.haveRulesContainBuyLicenseType()) {
      type.setValue(LicenseType.Rent);
      duration.enable();
      duration.setValue(this.getFirstAvailableDurationOption());
    } else {
      type.setValue(LicenseType.Buy);
      duration.setValue(null);
      duration.disable();
    }

    const rule = this.#formBuilder.group({
      price: new FormControl(null, Validators.required),
      type,
      duration,
    });

    this.rules.push(rule);
    this.displayAvailableLicenseTypeLabels();
    this.displayAvailableLicenseDurationLabels();
    console.log('this.licenseRulesForm.value: ', this.licenseRulesForm.value);
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
    this.displayAvailableLicenseTypeLabels();
    this.displayAvailableLicenseDurationLabels();
  }

  protected displayAvailableLicenseTypeLabels(): void {
    const usedRentLicensedTypes = this.rules
      .getRawValue()
      .map(({ type }) => +type)
      .filter((type) => type === LicenseType.Rent);

    if (usedRentLicensedTypes.length === 5) {
      this.licenseTypeOptions = this.licenseTypeOptions.map((option) => {
        let disabled = option.value === LicenseType.Rent;
        return { ...option, disabled };
      });

      return;
    }

    this.licenseTypeOptions = this.licenseTypeOptions.map((option) => {
      let disabled =
        option.value === LicenseType.Buy &&
        this.haveRulesContainBuyLicenseType();
      return { ...option, disabled };
    });
  }

  protected displayAvailableLicenseDurationLabels(): void {
    const usedLicenseDurationOptions = [
      ...new Set(this.rules.getRawValue().map(({ duration }) => +duration)),
    ];

    this.licenseDurationOptions = this.licenseDurationOptions.map((option) => {
      const disabled = usedLicenseDurationOptions.includes(option.value);

      return { ...option, disabled };
    });
  }

  protected manageDurationField({ value }: any, index: number): void {
    if (value == LicenseType.Rent) {
      this.rules.controls[index].get('duration')?.enable();
      this.rules.controls[index].patchValue({
        duration: this.getFirstAvailableDurationOption(),
      });
    } else {
      this.rules.controls[index].patchValue({
        duration: new FormControl(null),
      });
      this.rules.controls[index].get('duration')?.disable();
    }
  }

  private onSubmitChange(): void {
    const licenseRules = this.rules.value.map((rule: LicenseRule) =>
      rule.type == LicenseType.Buy ? { ...rule, duration: null } : rule
    );

    this.rulesChanged.emit(licenseRules);
  }

  private rulesListener(): void {
    this.rules.valueChanges.subscribe((rule) => {
      this.displayAvailableLicenseDurationLabels();
    });
  }

  private haveRulesContainBuyLicenseType = (): boolean =>
    this.rules
      .getRawValue()
      .map(({ type }) => +type)
      .includes(LicenseType.Buy);

  private getFirstAvailableDurationOption = () =>
    this.licenseDurationOptions.filter(({ disabled }) => !disabled)[0].value;
}
