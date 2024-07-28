import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgToggleModule } from 'ng-toggle-button';
import { User } from 'src/app/core/models/user';
import { UserStatusEvent } from '../../user-dashboard/models/user-status-event';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgIf, NgFor, NgToggleModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent {
  @Input({ required: true }) users: User[] = [];

  @Output() userStatusChanged = new EventEmitter<UserStatusEvent>();

  onUserStatusChange(status: boolean, { userName }: User): void {
    this.userStatusChanged.emit({ status, userName });
  }
}
