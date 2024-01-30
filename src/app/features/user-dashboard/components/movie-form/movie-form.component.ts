import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MovieCategory } from 'src/app/core/models/movie-item';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.scss',
})
export class MovieFormComponent {
  movieForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(''),
    fileImage: new FormControl(''),
    fileMovie: new FormControl(''),
  });

  categories: MovieCategory[] = [MovieCategory.Movie, MovieCategory.Series];

  // TODO: remove any
  @Output() movieFormChanged = new EventEmitter<any>();

  onSubmit(): void {
    if (this.movieForm.invalid) {
      return;
    }

    this.movieFormChanged.emit(this.movieForm.value);
  }
}
