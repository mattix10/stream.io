import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { LoggerService } from '../../../core/services/logger.service';
import { Observable } from 'rxjs';
import { LicenseResponse } from '../../../core/models/responses/license-response';
import { LicenseRuleRequest } from '../../../core/models/requests/license-rule-request';

@Injectable()
export class LicenseService {
  readonly #httpService = inject(HttpService);
  readonly #loggerService = inject(LoggerService);
  readonly #entity = 'license';

  getLicense(contentId: string): Observable<LicenseResponse> {
    return this.#httpService
      .getItem<LicenseResponse>(this.#entity, contentId)
      .pipe(this.#loggerService.error('Nie udało się pobrać licencji', true));
  }

  createLicense(licenseRuleRequest: LicenseRuleRequest): Observable<Response> {
    return this.#httpService
      .create<Response, LicenseRuleRequest>(this.#entity, licenseRuleRequest)
      .pipe(this.#loggerService.error('Nie udało się zakupić licencji'));
  }

  updateLicense(
    licenseRuleRequest: LicenseRuleRequest,
    licenseId: string
  ): Observable<Response> {
    return this.#httpService
      .update<Response, LicenseRuleRequest>(
        `${this.#entity}/${licenseId}`,
        licenseRuleRequest
      )
      .pipe(this.#loggerService.error('Nie udało się zaktualizować licencji'));
  }
}
