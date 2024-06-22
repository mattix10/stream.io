import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { UserData } from '../../models/user-data';
import { Role } from 'src/app/core/models/roles.enum';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from 'src/app/features/auth/models/loading';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit, isLoading {
  @Input({ required: true }) user!: User;
  @Input({ required: true }) isAdminEditMode: boolean = false;

  @Output() userDataChanged = new EventEmitter<UserData>();

  isLoading: boolean = false;
  userDataForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
    phoneNumber: new FormControl(''),
    nip: new FormControl(''),
  });
  isEditMode: boolean = false;
  roles = Object.values(Role);

  get isContentCreator(): boolean {
    return this.user.role === Role.ContentCreator;
  }

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

    let updatedUserData = formValue;
    this.isEditMode = false;

    if (this.isAdminEditMode) updatedUserData = this.userDataForm.value;

    this.userDataChanged.emit(updatedUserData as UserData);

    this.resetFields();
  }

  private setUserData(): void {
    this.userDataForm.patchValue({
      email: this.user.email,
      role: this.user.role ? this.user.role : undefined,
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
}
