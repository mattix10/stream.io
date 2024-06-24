import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { UserData } from '../../models/user-data';
import { Role } from 'src/app/core/models/roles.enum';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from 'src/app/features/auth/models/loading';
import { catchError, EMPTY, finalize, Observable, of, switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit, isLoading {
  @Input({ required: true }) user!: User;

  @Output() userDataChanged = new EventEmitter<void>();

  isLoading: boolean = false;

  userDataForm = new FormGroup({
    email: new FormControl('', Validators.email),
    userName: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
    phoneNumber: new FormControl('', [
      Validators.maxLength(9),
      Validators.minLength(9),
    ]),
    nip: new FormControl('', [
      Validators.maxLength(10),
      Validators.minLength(10),
    ]),
  });
  isEditMode: boolean = false;
  roles = Object.values(Role);

  get isContentCreator(): boolean {
    return this.user.role === Role.ContentCreator;
  }

  get isEndUser(): boolean {
    return this.user.role === Role.EndUser;
  }

  readonly #userService = inject(UserService);
  readonly #toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.userDataForm.controls.role.disable();

    if (!this.isContentCreator) {
      this.userDataForm.controls.phoneNumber.disable();
      this.userDataForm.controls.nip.disable();
    }

    this.setUserData();
  }

  onEdit(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.setUserData();
    }
  }

  onSave(): void {
    console.log(this.userDataForm);
    if (!this.userDataForm.valid) return;

    const { role, ...formValue } = this.userDataForm.value;
    let updatedUserData = formValue;
    let call: Observable<any> = of(null);

    this.isLoading = true;

    if (this.isContentCreator) {
      call = this.#userService
        .updateContentCreator(updatedUserData as UserData)
        .pipe(this.handleUpdateError());
    }

    if (this.isEndUser) {
      call = this.#userService
        .updateEndUser(updatedUserData as UserData)
        .pipe(this.handleUpdateError());
    }

    call.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
      this.userDataChanged.emit();
      this.isEditMode = false;
      this.#toastrService.success('Dane zostały zaktualizowane.');
      this.resetFields();
    });
  }

  private setUserData(): void {
    this.userDataForm.patchValue({
      email: this.user.email,
      userName: this.user.userName,
      role: this.user.role,
    });

    if (this.isContentCreator) {
      this.userDataForm.patchValue({
        nip: this.user.nip ? this.user.nip : '',
        phoneNumber: this.user.phoneNumber ? this.user.phoneNumber : '',
      });
    }
  }

  private resetFields(): void {
    this.userDataForm.reset();
  }

  private handleUpdateError<T>(): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((error) => {
          this.#toastrService.error(
            `${error?.error?.message} Aktualizacja danych nie powiodła się.`
          );
          return EMPTY;
        })
      );
  }
}
