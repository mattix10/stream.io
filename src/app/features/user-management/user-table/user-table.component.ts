import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgToggleModule } from 'ng-toggle-button';
import { User } from 'src/app/core/models/user';
@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgIf, NgFor, NgToggleModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent {
  @Input({ required: true }) users: User[] = [];

  @Output() userStatusChanged = new EventEmitter<string>();

  onUserStatusChange({ userName }: User): void {
    this.userStatusChanged.emit(userName);
  }
}
