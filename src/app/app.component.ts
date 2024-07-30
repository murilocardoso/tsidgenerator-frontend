import { Component } from '@angular/core';
import { GenerateTsidService } from './services/generate-tsid.service';
import { ConvertTsidFromLongToStringService } from './services/convert-tsid-from-long-to-string.service';
import { ConvertTsidFromStringToLongService } from './services/convert-tsid-from-string-to-long.service';
import { RESPONSE_VALUE_WHEN_INVALID_ARGUMENT } from './services/tsid.constants';
import { environment } from '../environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly TSID_STRING_MAX_SIZE: number = 13
  readonly TSID_LONG_MAX_SIZE: number = 18
  readonly VALUE_WHEN_INVALID_ARGUMENT = RESPONSE_VALUE_WHEN_INVALID_ARGUMENT;
  readonly TSID_API_BASE_URL: string = environment.tsidBaseUrl;

  newTsidAsString: string = '';
  newTsidAsLong: string = '';
  tsidLongInput: string = '';
  tsidLongInputAsLong: BigInt = BigInt(0);
  tsidLongOuput: string = '';
  tsidStringInput: string = '';
  tsidStringOutput: string = '';

  curl_generate: string = 'curl -X GET '+ environment.tsidBaseUrl +'/new'
  curl_from_string_to_long: string = 'curl -X GET '+ environment.tsidBaseUrl +'/STRING_TSID/as-long';
  curl_from_long_to_string: string = 'curl -X GET '+ environment.tsidBaseUrl +'/LONG_TSID/as-string';

  constructor(private generateTsId: GenerateTsidService,
    private convertTsidFromStringToLongService: ConvertTsidFromStringToLongService,
    private convertTsidFromLongToStringService: ConvertTsidFromLongToStringService
  ) {}

  generateTsid() {
    this.generateTsId.execute()
      .subscribe(response  => {
        this.newTsidAsString = response.valueAsString;
        this.newTsidAsLong = response.valueAsLong;
        this.atualizarCurls();
      });
  }

  convertTsidFromStringToLong() {
    this.convertTsidFromStringToLongService.execute(this.tsidStringInput)
      .subscribe(response => {
        this.tsidLongOuput = response.value;
        this.atualizarCurls();
      });
  }

  convertTsidFromLongToString() {
    if (!this.handleInvalidInputTsIdAsLong()) {
      this.atualizarCurls();
      return;
    }

    this.convertTsidFromLongToStringService.execute(this.tsidLongInputAsLong)
      .subscribe(response => {
        this.tsidStringOutput = response.value;
        this.atualizarCurls();
      });
  }

  onGetAsLongChange(value: string) {
    this.tsidStringInput = value
    if (value.length != this.TSID_STRING_MAX_SIZE) {
      this.tsidLongOuput = "";
      return;
    }
    this.convertTsidFromStringToLong();
  }

  onGetAsStringChange(value: string) {
    this.tsidLongInput = value
    if (value.length != this.TSID_LONG_MAX_SIZE) {
      this.tsidStringOutput = "";
      return;
    }
    this.convertTsidFromLongToString();
  }

  handleInvalidInputTsIdAsLong(): boolean {
    try {
      this.tsidLongInputAsLong = BigInt(this.tsidLongInput);
    } catch (error) {
      this.tsidLongInputAsLong = BigInt(0);
      this.tsidLongInput = "";
      this.tsidStringOutput = this.VALUE_WHEN_INVALID_ARGUMENT;
      return false;
    }
    return true;
  }

  atualizarCurls() {
    this.curl_generate = `curl -X GET ${environment.tsidBaseUrl}/new`;
    this.curl_from_string_to_long = `curl -X GET ${environment.tsidBaseUrl}/${String(this.tsidStringInput) || String(this.newTsidAsString) || String(this.tsidStringOutput) || 'STRING_TSID'}/as-long`;
    this.curl_from_long_to_string = `curl -X GET ${environment.tsidBaseUrl}/${String(this.tsidLongInput) || String(this.newTsidAsLong) || String(this.tsidLongOuput) || 'LONG_TSID'}/as-string`;
  }

  copyGenerateCurlToClipboard() {
    this.copyToClipboard(this.curl_generate);
  }

  copyFromStringToLongCurlToClipboard() {
    this.copyToClipboard(this.curl_from_string_to_long);
  }

  copyFromLongToStringCurlToClipboard() {
    this.copyToClipboard(this.curl_from_long_to_string);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
}
