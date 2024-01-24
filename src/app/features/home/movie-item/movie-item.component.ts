import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MovieItem } from 'src/app/core/models/movie-item';

@Component({
  selector: 'app-movie-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss',
})
export class MovieItemComponent {
  @Input() movieItem!: MovieItem;
}
