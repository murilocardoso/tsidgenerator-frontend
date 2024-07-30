import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environment';
import { ILLEGAL_ARGUMENT_ERROR, RESPONSE_VALUE_WHEN_ERROR, RESPONSE_VALUE_WHEN_INVALID_ARGUMENT } from './tsid.constants';

@Injectable({
  providedIn: 'root'
})
export class ConvertTsidFromStringToLongService {

  private tsidBaseUrl: string;

  constructor(private http: HttpClient) {
    this.tsidBaseUrl = environment.tsidBaseUrl;
  }

  execute(tsid: string): Observable<ConvertTsidFromStringToLongResponse> {
    return this.http.get<ConvertTsidFromStringToLongResponse>(`${this.tsidBaseUrl}/${tsid}/as-long`)
                    .pipe(
                      catchError((err) => {
                        var responseValueWhenError = RESPONSE_VALUE_WHEN_ERROR;
                        if (err.error.code == ILLEGAL_ARGUMENT_ERROR) {
                          responseValueWhenError = RESPONSE_VALUE_WHEN_INVALID_ARGUMENT;
                        }
                        var responseWhenError = new ConvertTsidFromStringToLongResponse(responseValueWhenError);
                        return of(responseWhenError);
                      })
                    );
  }
}

export class ConvertTsidFromStringToLongResponse {
  private _value: string;

  constructor(value: string) {
      this._value = value;
  }

  get value(): string {
      return this._value;
  }
}


