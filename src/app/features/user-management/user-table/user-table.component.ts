import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user-service/user-service.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent {
  @Input({ required: true }) users: User[] = [];

  readonly #router = inject(Router);
  @Output() deleteUserChanged = new EventEmitter<string>();

  ngOnChanges() {
    console.log(this.users);
  }

  onEditUser(id: string): void {
    this.#router.navigateByUrl(`/user-dashboard/edit?username=${id}`);
  }

  onDeleteUser(id: string): void {
    this.deleteUserChanged.emit(id);
  }
}
