import {afterEveryRender, Component, ElementRef, inject, signal, WritableSignal} from '@angular/core';
import {FhirPatientService, IPatient} from '../services/fhir-patient.service';
import {JsonPipe, NgClass, NgStyle} from '@angular/common';
import {
  ButtonDirective, emptyColumnConfig, IColumnConfig,
  MpageIconComponent,
  MpageInputComponent,
  MpageTableComponent
} from '@clinicaloffice/mpage-developer';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-patient-table',
  imports: [
    JsonPipe,
    MpageTableComponent,
    ButtonDirective,
    MpageIconComponent,
    MpageInputComponent,
    FormsModule,
    NgClass,
    NgStyle
  ],
  templateUrl: './patient-table.component.html',
  standalone: true
})
export class PatientTableComponent {

  protected fhirPatient = inject(FhirPatientService);
  protected lastNameSearch: WritableSignal<string> = signal('');
  protected firstNameSearch: WritableSignal<string> = signal('');
  protected phoneSearch: WritableSignal<string> = signal('');
  protected colConfig: WritableSignal<IColumnConfig> = signal(emptyColumnConfig());
  private startUp = true;
  private el = inject(ElementRef);
  private searchTimeOut: ReturnType<typeof setTimeout> | null | undefined;

  protected tableWidth(): any {
    return {width:  this.el.nativeElement.querySelector('#table') ? (this.el.nativeElement.querySelector('#table').getBoundingClientRect().width + 1) + 'px' : '100%' };
  }

  protected search(): void {
    if (this.searchTimeOut) clearTimeout(this.searchTimeOut);

    this.searchTimeOut = setTimeout(() => {
      this.fhirPatient.searchText.set(
        (this.lastNameSearch() ? '&family=' + this.lastNameSearch() : '') +
        (this.firstNameSearch() ? '&given=' + this.firstNameSearch() : '') +
        (this.phoneSearch() ? '&telecom=' + this.phoneSearch() : '')
      );
      this.fhirPatient.loadPatients();
    }, 500);
  }

  protected addNewPatient(): void {
    this.fhirPatient.view.set('modify-patient');
    this.fhirPatient.patient.set({...this.fhirPatient.newPatient()});
  }

  protected modifyPatient(patient: IPatient): void {
    this.fhirPatient.view.set('modify-patient');
    this.fhirPatient.patient.set({...patient});
  }

}
