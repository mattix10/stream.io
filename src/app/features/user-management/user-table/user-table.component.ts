import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent {
  @Input({ required: true }) users: User[] = [];

  ngOnChanges() {
    console.log(this.users);
  }
}
