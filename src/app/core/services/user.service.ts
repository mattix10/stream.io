import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseRegistrationRequest } from '@app/core/models/requests/base-registration-request';
import { UserData } from '@app/features/user-dashboard/models/user-data';
import { BaseUpdateUserRequest } from '../models/requests/base-update-user-request';
import { ChangePasswordRequest } from '../models/requests/change-password-request';
import { UpdateContentCreatorRequest } from '../models/requests/update-content-creator-request';
import { UpdateUserStatusRequest } from '../models/requests/update-user-status-request';
import { HttpService } from './http.service';
import { LoggerService } from './logger.service';
import { RegistrationContentCreatorRequest } from '../models/requests/registration-content-creator-request';
import { UserResponse } from '../models/responses/user-response';
import { UserListResponse } from '../models/responses/user-list-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpService = inject(HttpService);
  readonly #loggerService = inject(LoggerService);
  readonly #entity = 'user';

  registerEndUser(formValue: BaseRegistrationRequest): Observable<void> {
    return this.#httpService
      .create<void, BaseRegistrationRequest>(
        `${this.#entity}/end-user`,
        formValue
      )
      .pipe(
        this.#loggerService.error('Rejestracja nie powiodła się.'),
        tap(() =>
          this.#loggerService.success('Rejestracja zakończona sukcesem.')
        )
      );
  }

  registerContentCreator(
    registrationForm: RegistrationContentCreatorRequest
  ): Observable<void> {
    return this.#httpService
      .create<void, RegistrationContentCreatorRequest>(
        `${this.#entity}/content-creator`,
        registrationForm
      )
      .pipe(
        this.#loggerService.error('Rejestracja nie powiodła się.'),
        tap(() =>
          this.#loggerService.success('Rejestracja zakończona sukcesem.')
        )
      );
  }

  getUser(): Observable<UserResponse> {
    return this.#httpService
      .getItem<UserResponse>(`${this.#entity}`)
      .pipe(
        this.#loggerService.error('Nie udało się załadować danych użytkownika.')
      );
  }

  getUsers(): Observable<UserListResponse> {
    return this.#httpService
      .getItems(`${this.#entity}/all`)
      .pipe(
        this.#loggerService.error<any>('Nie udało się załadować użytkowników.')
      );
  }

  updateEndUser(user: BaseUpdateUserRequest): Observable<void> {
    return this.#httpService
      .update<void, UserData>(`${this.#entity}/end-user`, user)
      .pipe(
        this.#loggerService.error(
          'Nie udało się zaktualizować danych użytkownika.'
        )
      );
  }

  updateContentCreator(user: UpdateContentCreatorRequest): Observable<void> {
    return this.#httpService
      .update<void, UserData>(`${this.#entity}/content-creator`, user)
      .pipe(
        this.#loggerService.error(
          'Nie udało się zaktualizować danych użytkownika.'
        )
      );
  }

  updateUserStatus(
    username: string,
    userStatus: UpdateUserStatusRequest
  ): Observable<UpdateUserStatusRequest> {
    return this.#httpService
      .patch(`${this.#entity}/${username}/status`, userStatus)
      .pipe(
        this.#loggerService.error(
          `Aktualizacja statusu użytkownika "${username}" nie powiodła się.`
        ),
        tap(() => {
          this.#loggerService.success(
            `Status użytkownika "${username}" został zaktualizowany.`
          );
        })
      );
  }

  changePassword(
    changePasswordRequest: ChangePasswordRequest
  ): Observable<ChangePasswordRequest> {
    return this.#httpService
      .patch<ChangePasswordRequest>(
        `${this.#entity}/password`,
        changePasswordRequest
      )
      .pipe(
        this.#loggerService.error('Nie udało się zmienić hasła.'),
        tap(() =>
          this.#loggerService.success(
            'Hasło zostało zmienione pomyślnie. Zaloguj się ponownie.'
          )
        )
      );
  }

  deleteUser(password: string): Observable<void> {
    return this.#httpService.delete(this.#entity, undefined, { password }).pipe(
      this.#loggerService.error('Nie udało się usunąć użytkownika.'),
      tap(() =>
        this.#loggerService.success('Konto zostało usunięte pomyślnie.')
      )
    );
  }
}
