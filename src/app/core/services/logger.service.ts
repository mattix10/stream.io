import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  readonly #toastrService = inject(ToastrService);

  error<T>(message: string, throwErrorFlag = false) {
    return (source: Observable<T>): Observable<T> => {
      return source.pipe(
        catchError((err: HttpErrorResponse) => {
          this.#toastrService.error(message);
          console.error(message, err);
          return throwErrorFlag ? throwError(() => err) : EMPTY;
        })
      );
    };
  }

  success(meesage: string): void {
    this.#toastrService.success(meesage);
  }
}
