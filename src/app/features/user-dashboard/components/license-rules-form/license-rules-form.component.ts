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
  #destroyRef = inject(DestroyRef);
  #formBuilder = inject(FormBuilder);

  readonly licenseType = LicenseType;

  licenseDurationOptions = licenseDurationOptions;
  licenseTypeOptions = licenseTypeOptions;

  @Input({ required: true }) set submit(submit: Subject<void>) {
    this.onSubmitChange(submit);
  }

  @Output() rulesChanged = new EventEmitter<LicenseRule[]>();

  licenseRules: LicenseRule[] = [];
  licenseRulesForm: FormGroup = this.#formBuilder.group({
    rules: this.#formBuilder.array([]),
  });

  get rules(): FormArray {
    return this.licenseRulesForm.controls['rules'] as FormArray;
  }

  ngOnInit(): void {
    this.addRule();
    this.rulesListener();
  }

  addRule(): void {
    const type = new FormControl();
    const duration = new FormControl();
    if (
      this.rules
        .getRawValue()
        .map(({ type }) => +type)
        .includes(LicenseType.Buy)
    ) {
      console.log('here1');
      type.setValue(LicenseType.Rent);
      console.log(
        this.licenseDurationOptions.filter(({ disabled }) => !disabled)[0]
      );
      duration.setValue(
        this.licenseDurationOptions.filter(({ disabled }) => !disabled)[0].value
      );
    } else {
      console.log('here2');

      type.setValue(LicenseType.Buy);
      duration.setValue(null);
      duration.disable();
    }
    const rule = this.#formBuilder.group({
      price: new FormControl(0),
      type,
      duration,
    });

    this.rules.push(rule);
    this.loadAvailableLicenseDurationLabels();
    this.loadAvailableLicenseTypeLabels();
    console.log(this.rules.value);
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
    this.loadAvailableLicenseTypeLabels();
    this.loadAvailableLicenseDurationLabels();
  }

  protected loadAvailableLicenseDurationLabels(): void {
    const usedLicenseDuration = [
      ...new Set(this.rules.getRawValue().map(({ duration }) => +duration)),
    ];
    this.licenseDurationOptions = this.licenseDurationOptions.map((option) => {
      const disabled = usedLicenseDuration.includes(option.value);
      return { ...option, disabled };
    });
    console.log('this.licenseDurationOptions: ', this.licenseDurationOptions);
  }

  protected loadAvailableLicenseTypeLabels(): void {
    const isUsedLicenseTypeBuy = this.rules
      .getRawValue()
      .map(({ type }) => +type)
      .includes(LicenseType.Buy);

    this.licenseTypeOptions = this.licenseTypeOptions.map((option) => {
      let disabled = option.value === LicenseType.Buy && isUsedLicenseTypeBuy;
      return { ...option, disabled };
    });
  }

  manageDurationField({ value }: any, index: number): void {
    if (value == LicenseType.Rent) {
      this.rules.controls[index].enable();
      this.rules.controls[index].patchValue({
        duration: this.getFirstAvailableDurationOption(),
      });
    }
  }

  private onSubmitChange(submit: Subject<void>): void {
    submit
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.rulesChanged.emit(this.licenseRules));
  }

  private rulesListener(): void {
    this.rules.valueChanges.subscribe((rule) => {
      console.log(rule);
      this.loadAvailableLicenseDurationLabels();
    });
  }

  private getFirstAvailableDurationOption = () =>
    this.licenseDurationOptions.filter(({ disabled }) => !disabled)[0].value;
}
