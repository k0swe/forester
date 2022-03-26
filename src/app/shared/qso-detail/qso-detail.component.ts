import { Band } from '../../reference/band';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DxccRef } from '../../reference/dxcc';
import { FirebaseQso, QsoService } from '../qso/qso.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HamlibService } from 'ngx-kel-agent';
import { LocationService } from '../location/location.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Modes } from '../../reference/mode';
import { Observable } from 'rxjs';
import { Qso } from '../../qso';
import { map } from 'rxjs/operators';

const googleMapsSearchBase = 'https://www.google.com/maps/search/';

@Component({
  selector: 'kel-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.scss'],
  providers: [DatePipe],
})
export class QsoDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FirebaseQso,
    private datePipe: DatePipe,
    private qsoService: QsoService,
    private locationService: LocationService,
    private hamlib: HamlibService,
    private dialog: MatDialogRef<any>
  ) {
    this.firebaseId = data.id;
    const model = {
      ...this.template,
      ...data.qso,
      contactedStation: {
        ...this.template.contactedStation,
        ...data.qso.contactedStation,
      },
      loggingStation: {
        ...this.template.loggingStation,
        ...data.qso.loggingStation,
      },
    };
    this.formatDates(model);
    this.qsoDetailForm = fb.group({
      ...model,
      ...{
        timeOn: [model.timeOn, Validators.required],
        contactedStation: fb.group({
          ...model.contactedStation,
          ...{
            stationCall: [
              model.contactedStation.stationCall,
              Validators.required,
            ],
          },
        }),
        loggingStation: fb.group(model.loggingStation),
      },
    });
  }

  // empty values for each field in the form to prevent error "Cannot find control with name"
  private readonly template: Qso = {
    timeOn: new Date(),
    timeOff: new Date(),
    band: undefined,
    mode: undefined,
    freq: undefined,
    comment: undefined,
    notes: undefined,
    rstSent: undefined,
    rstReceived: undefined,
    contactedStation: {
      stationCall: undefined,
      opName: undefined,
      latitude: undefined,
      longitude: undefined,
      city: undefined,
      state: undefined,
      country: undefined,
      continent: undefined,
      gridSquare: undefined,
    },
    loggingStation: {
      stationCall: this.qsoService.book(),
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
    },
  };

  private readonly firebaseId;
  bands = Band.bands;
  qsoDetailForm: FormGroup;
  mapLink: string;
  startDelete = false;
  modeNames = Modes.modeNames;
  filteredModes$: Observable<string[]>;
  countries = DxccRef.getNames();
  filteredCountries$: Observable<string[]>;

  @ViewChild('saveButton') saveButton: MatButton;

  private static parseDates(qso: Qso): void {
    // form uses strings; turn them back into dates
    qso.timeOn = new Date(qso.timeOn + 'Z');
    qso.timeOff = new Date(qso.timeOff + 'Z');
  }

  static saveMode(formValue): void {
    const realMode = Modes.findMode(formValue.mode);
    if (realMode) {
      // Prefer ADIF-specified modes, but fall back on user input for new modes
      formValue.mode = realMode.mode;
      formValue.submode = realMode.submode;
    }
  }

  static saveCountry(formValue): void {
    const country = formValue.contactedStation.country;
    const entity = DxccRef.getByName(country);
    if (entity != null) {
      formValue.contactedStation.dxcc = entity.id;
    }
  }

  ngOnInit(): void {
    this.setupModeAutocomplete();
    this.setupCountryAutocomplete();
    this.setupAutoContinentFromCountry();
    this.setupAutoBandFromFreq();
    this.setupAutoLocation();
    this.setupAgentFreqMode();
    this.qsoDetailForm
      .get('contactedStation')
      .valueChanges.subscribe(() => this.updateMapLink());
    this.updateMapLink();
    this.qsoDetailForm.valueChanges.subscribe(
      () => (this.saveButton.disabled = !this.qsoDetailForm.valid)
    );
    this.forceUpperCase(
      this.qsoDetailForm.get('contactedStation').get('stationCall')
    );
    this.forceUpperCase(
      this.qsoDetailForm.get('loggingStation').get('stationCall')
    );
  }

  private forceUpperCase(control: AbstractControl) {
    control.valueChanges.subscribe(() =>
      control.patchValue(control.value.toUpperCase(), { emitEvent: false })
    );
  }

  private setupModeAutocomplete(): void {
    const displayMode = this.data.qso.submode
      ? this.data.qso.submode
      : this.data.qso.mode;
    const modeField = this.qsoDetailForm.get('mode');
    modeField.setValue(displayMode);
    this.filteredModes$ = modeField.valueChanges.pipe(
      map((modeInput) => this.filterModes(modeInput))
    );
  }

  private filterModes(modeInput: string): string[] {
    const filterValue = modeInput.toUpperCase();
    return this.modeNames.filter((option) =>
      option.toUpperCase().includes(filterValue)
    );
  }

  private setupCountryAutocomplete(): void {
    const countryField = this.qsoDetailForm.get('contactedStation.country');
    this.filteredCountries$ = countryField.valueChanges.pipe(
      map((countryInput) => this.filterCountries(countryInput))
    );
  }

  private setupAutoLocation(): void {
    const latField = this.qsoDetailForm.get('loggingStation.latitude');
    const lonField = this.qsoDetailForm.get('loggingStation.longitude');
    const gridField = this.qsoDetailForm.get('loggingStation.gridSquare');
    this.locationService.getLocation().subscribe((loc) => {
      if (
        latField.value != null ||
        lonField.value != null ||
        gridField.value != null
      ) {
        // If there's any location info already, don't overwrite it
        return;
      }
      latField.setValue(loc.latitude);
      lonField.setValue(loc.longitude);
      gridField.setValue(loc.gridSquare);
      latField.markAsDirty();
      lonField.markAsDirty();
      gridField.markAsDirty();
    });
  }

  private setupAgentFreqMode(): void {
    const freqField = this.qsoDetailForm.get('freq');
    const modeField = this.qsoDetailForm.get('mode');
    if (freqField.value == null) {
      // only enable rig control updates if there's no existing freq
      this.hamlib.rigState$.subscribe((rig) => {
        if (rig == null) {
          return;
        }
        freqField.setValue(rig.frequency / 1000000);
        modeField.setValue(rig.mode);
        freqField.markAsDirty();
        modeField.markAsDirty();
      });
    }
  }

  private filterCountries(countryInput: string): string[] {
    const filterValue = countryInput.toUpperCase();
    return this.countries.filter((option) =>
      option.toUpperCase().includes(filterValue)
    );
  }

  private setupAutoContinentFromCountry(): void {
    const countryField = this.qsoDetailForm.get('contactedStation.country');
    countryField.valueChanges.subscribe((countryInput) => {
      const entity = DxccRef.getByName(countryInput);
      if (entity != null) {
        this.qsoDetailForm
          .get('contactedStation.continent')
          .setValue(entity.continent);
      }
    });
  }

  private setupAutoBandFromFreq(): void {
    const freqField = this.qsoDetailForm.get('freq');
    const bandField = this.qsoDetailForm.get('band');
    freqField.valueChanges.subscribe((freqInput) => {
      const band = Band.freqToBand(freqInput);
      bandField.setValue(band);
    });
  }

  private updateMapLink(): void {
    const latitude: number =
      this.qsoDetailForm.get('contactedStation').value.latitude;
    const longitude: number =
      this.qsoDetailForm.get('contactedStation').value.longitude;
    const city: string = this.qsoDetailForm.get('contactedStation').value.city;
    const state: string =
      this.qsoDetailForm.get('contactedStation').value.state;
    const country: string =
      this.qsoDetailForm.get('contactedStation').value.country;
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

  save(): void {
    const formValue = this.qsoDetailForm.value;
    QsoDetailComponent.parseDates(formValue);
    QsoDetailComponent.saveMode(formValue);
    QsoDetailComponent.saveCountry(formValue);
    const newQso: FirebaseQso = { id: this.firebaseId, qso: formValue as Qso };
    this.dialog.close(this.qsoService.addOrUpdate(newQso));
  }

  private formatDates(qso: Qso): void {
    // Qso uses date objects; format them
    const timeFormat = 'yyyy-MM-dd HH:mm:ss';
    // @ts-ignore
    qso.timeOn = this.datePipe.transform(qso.timeOn, timeFormat, 'UTC');
    // @ts-ignore
    qso.timeOff = this.datePipe.transform(qso.timeOff, timeFormat, 'UTC');
  }

  delete(): void {
    this.dialog.close(this.qsoService.delete(this.firebaseId));
  }
}
