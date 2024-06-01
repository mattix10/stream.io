import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit {
  @Input({ required: true }) user!: User;
  @Input({ required: true }) isAdminEditMode: boolean = false;

  @Output() userDataChanged = new EventEmitter<UserData>();

  userDataForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl(''),
    role: new FormControl('', Validators.required),
  });
  isEditMode: boolean = false;
  roles = Object.values(Role);

  ngOnInit(): void {
    this.setUserData();
  }

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onSave(): void {
    if (!this.userDataForm.valid) {
      return;
    }
    const { role, ...formValue } = this.userDataForm.value;

    let updatedUserData = formValue;
    if (this.isAdminEditMode) {
      updatedUserData = this.userDataForm.value;
    }
    this.userDataChanged.emit(updatedUserData as UserData);
    this.resetFields();
  }

  private setUserData(): void {
    this.userDataForm.patchValue({
      email: this.user.email,
      role: undefined,
    });
  }

  private resetFields(): void {
    this.userDataForm.reset();
  }
}
