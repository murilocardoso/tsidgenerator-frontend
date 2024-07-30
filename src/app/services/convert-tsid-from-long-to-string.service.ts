import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { catchError, Observable, of } from 'rxjs';
import { ILLEGAL_ARGUMENT_ERROR, RESPONSE_VALUE_WHEN_ERROR, RESPONSE_VALUE_WHEN_INVALID_ARGUMENT } from './tsid.constants';

@Injectable({
  providedIn: 'root'
})
export class ConvertTsidFromLongToStringService {

  private tsidBaseUrl: string;

  constructor(private http: HttpClient) {
    this.tsidBaseUrl = environment.tsidBaseUrl;
  }

  execute(tsid: BigInt): Observable<ConvertTsidFromLongToStringResponse> {
    return this.http.get<ConvertTsidFromLongToStringResponse>(`${this.tsidBaseUrl}/${tsid}/as-string`)
                    .pipe(
                      catchError((err) => {
                        var responseValueWhenError = RESPONSE_VALUE_WHEN_ERROR;
                        if (err.error.code == ILLEGAL_ARGUMENT_ERROR) {
                          responseValueWhenError = RESPONSE_VALUE_WHEN_INVALID_ARGUMENT;
                        }
                        var responseWhenError = new ConvertTsidFromLongToStringResponse(responseValueWhenError);
                        return of(responseWhenError);
                      })
                    );
  }
}

export class ConvertTsidFromLongToStringResponse {
  private _value: string;

  constructor(value: string) {
      this._value = value;
  }

  get value(): string {
      return this._value;
  }
}
