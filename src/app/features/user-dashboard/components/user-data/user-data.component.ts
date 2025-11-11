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
import { User } from '@app/core/models/classes/user';
import { UserData } from '../../models/user-data';
import { Role } from '@app/core/models/enums/roles.enum';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';
import { finalize, Observable, of, tap } from 'rxjs';
import { UserService } from '@app/core/services/user.service';
import { EditHeaderComponent } from '@app/features/user-dashboard/components/edit-header/edit-header.component';
import { isLoading } from '@app/core/models/interfaces/loading';

@Component({
  selector: 'app-user-data',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    EditHeaderComponent,
  ],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit, isLoading {
  @Input({ required: true }) user!: User;

  @Output() userDataChanged = new EventEmitter<void>();

  isLoading: boolean = false;
  isEditMode: boolean = false;
  roles = Object.values(Role);
  userDataForm = new FormGroup({
    email: new FormControl('', Validators.email),
    userName: new FormControl(''),
    role: new FormControl(''),
    phoneNumber: new FormControl(''),
    nip: new FormControl(''),
  });

  get isContentCreator(): boolean {
    return this.user.userLevel === Role.ContentCreator;
  }

  get isEndUser(): boolean {
    return this.user.userLevel === Role.EndUser;
  }

  readonly #userService = inject(UserService);

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
    if (!this.userDataForm.valid) return;

    const { role, ...formValue } = this.userDataForm.value;
    let updatedUserData = formValue as UserData;
    let call: Observable<void> = of();

    this.isLoading = true;

    if (this.isContentCreator) {
      call = this.#userService.updateContentCreator(updatedUserData);
    }

    if (this.isEndUser) {
      call = this.#userService.updateEndUser(updatedUserData);
    }

    call
      .pipe(
        tap(() => {
          this.userDataChanged.emit();
          this.isEditMode = false;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  private setUserData(): void {
    const { email, userName, userLevel: role } = this.user;

    this.userDataForm.patchValue({
      email,
      userName,
      role,
    });

    if (this.isContentCreator) {
      this.userDataForm.patchValue({
        nip: this.user.nip ?? '',
        phoneNumber: this.user.phoneNumber ?? '',
      });
    }
  }
}
