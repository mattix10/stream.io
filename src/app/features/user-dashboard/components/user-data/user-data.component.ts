import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { UserData } from 'src/app/core/models/user-data';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss',
})
export class UserDataComponent implements OnInit {
  @Input({ required: true }) user!: User;
  @Output() userDataChanged = new EventEmitter<UserData>();

  password: string = '';
  email: string = '';
  isEditMode: boolean = false;

  ngOnInit(): void {
    this.setUserEmail();
  }

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onSave(): void {
    this.userDataChanged.emit({ email: this.email, password: this.password });
    this.resetFields();
  }

  private setUserEmail(): void {
    this.email = this.user.email;
  }

  private resetFields(): void {
    this.email = '';
    this.password = '';
  }
}
