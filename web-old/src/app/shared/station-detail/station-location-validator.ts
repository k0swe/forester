import Maidenhead from '@amrato/maidenhead-ts';
import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class StationLocationValidator {
  public static consistentLocation(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const latControl = formGroup.get('latitude');
      const lonControl = formGroup.get('longitude');
      const gridControl = formGroup.get('gridSquare');
      if (!latControl || !lonControl || !gridControl) {
        // one or more of the controls doesn't exist
        return null;
      }

      const latitude: number = latControl.value;
      const longitude: number = lonControl.value;
      const grid: string = gridControl.value;
      if (!latitude || !longitude || !grid) {
        // one or more values not set
        return null;
      }
      if (!this.latLonInsideGrid(latitude, longitude, grid)) {
        const error = { locationInconsistent: true };
        latControl.setErrors(error);
        lonControl.setErrors(error);
        gridControl.setErrors(error);
        return error;
      }
      return null;
    };
  }

  public static latLonInsideGrid(
    latitude: number,
    longitude: number,
    grid: string,
  ): boolean {
    const gridFromLatLong = Maidenhead.fromCoordinates(latitude, longitude);
    return gridFromLatLong.locator.toLowerCase().startsWith(grid.toLowerCase());
  }
}
