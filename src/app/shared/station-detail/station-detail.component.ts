import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DxccRef } from '../../reference/dxcc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Station } from '../../qso';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

const googleMapsSearchBase = 'https://www.google.com/maps/search/';

@Component({
  selector: 'kel-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
})
export class StationDetailComponent implements OnInit, OnChanges {
  @Input() station: Station;
  @Output() stationChange = new EventEmitter<Station>();
  @Input() showRig: boolean = true;
  @Input() showTxPower: boolean = true;
  stationDetailForm: FormGroup;
  countries = DxccRef.getNames();
  filteredCountries$: Observable<string[]>;
  mapLink: string;

  // empty values for each field in the form to prevent error "Cannot find control with name"
  private readonly template: Station = {
    stationCall: undefined,
    opName: undefined,
    latitude: undefined,
    longitude: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    continent: undefined,
    gridSquare: undefined,
    rig: undefined,
    antenna: undefined,
    power: undefined,
  };

  constructor(private fb: FormBuilder) {
    const model: Station = {
      ...this.template,
      ...this.station,
    };
    this.stationDetailForm = fb.group(model);
  }

  ngOnInit(): void {
    this.setupCountryAutocomplete();
    this.setupAutoContinentFromCountry();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.station = changes.station.currentValue;
    const model: Station = {
      ...this.template,
      ...this.station,
    };
    this.stationDetailForm = this.fb.group(model);
    this.forceUpperCase(this.stationDetailForm.get('stationCall'));
    this.stationDetailForm.valueChanges.subscribe(() => {
      this.updateMapLink();
      this.stationChange.emit(this.stationDetailForm.value);
    });
    this.updateMapLink();
  }

  private setupCountryAutocomplete(): void {
    const countryField = this.stationDetailForm.get('country');
    this.filteredCountries$ = countryField.valueChanges.pipe(
      map((countryInput) => this.filterCountries(countryInput))
    );
  }

  private filterCountries(countryInput: string): string[] {
    const filterValue = countryInput.toUpperCase();
    return this.countries.filter((option) =>
      option.toUpperCase().includes(filterValue)
    );
  }

  private setupAutoContinentFromCountry(): void {
    const countryField = this.stationDetailForm.get('country');
    countryField.valueChanges.subscribe((countryInput) => {
      const entity = DxccRef.getByName(countryInput);
      if (entity != null) {
        this.stationDetailForm.get('continent').setValue(entity.continent);
      }
    });
  }

  private forceUpperCase(control: AbstractControl) {
    control.valueChanges.subscribe(() =>
      control.patchValue(control.value.toUpperCase(), { emitEvent: false })
    );
  }

  private updateMapLink(): void {
    const latitude: number = this.stationDetailForm.get('latitude').value;
    const longitude: number = this.stationDetailForm.get('longitude').value;
    const city: string = this.stationDetailForm.get('city').value;
    const state: string = this.stationDetailForm.get('state').value;
    const country: string = this.stationDetailForm.get('country').value;
    if (latitude && longitude) {
      this.mapLink = googleMapsSearchBase + latitude + ',' + longitude;
    } else if (city || state || country) {
      this.mapLink =
        googleMapsSearchBase +
        encodeURIComponent(city) +
        '+' +
        encodeURIComponent(state) +
        '+' +
        encodeURIComponent(country);
    } else {
      this.mapLink = '';
    }
  }
}
