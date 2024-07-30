import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environment';
import { RESPONSE_VALUE_WHEN_ERROR } from './tsid.constants';

@Injectable({
  providedIn: 'root'
})
export class GenerateTsidService {

  private tsidBaseUrl: string;

  constructor(private http: HttpClient) {
    this.tsidBaseUrl = environment.tsidBaseUrl;
  }

  execute(): Observable<GenerateTsidServiceResponse> {
    return this.http.get<GenerateTsidServiceResponse>(`${this.tsidBaseUrl}/new`)
                    .pipe(
                      catchError((err) => {
                        var responseValueWhenError = RESPONSE_VALUE_WHEN_ERROR;
                        var responseWhenError = new GenerateTsidServiceResponse(responseValueWhenError, responseValueWhenError);
                        return of(responseWhenError);
                      })
                    );
  }
}

export class GenerateTsidServiceResponse {
  private _valueAsString: string;
  private _valueAsLong: string;

  constructor(valueAsString: string, valueAsLong: string) {
      this._valueAsString = valueAsString;
      this._valueAsLong = valueAsLong;
  }

  get valueAsString(): string {
      return this._valueAsString;
  }

  get valueAsLong(): string {
    return this._valueAsLong;
}
}

