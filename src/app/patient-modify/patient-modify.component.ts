import {Component, inject} from '@angular/core';
import {FhirPatientService} from '../services/fhir-patient.service';
import {
  ButtonDirective, ISelectValue,
  MpageIconComponent,
  MpageInputComponent,
  MpageSelectComponent
} from '@clinicaloffice/mpage-developer';
import {FormsModule} from '@angular/forms';
import {Dialog} from '@angular/cdk/dialog';
import {MpageConfirmComponent} from '@clinicaloffice/mpage-developer';

@Component({
  selector: 'app-patient-modify',
  imports: [
    ButtonDirective,
    MpageIconComponent,
    MpageInputComponent,
    FormsModule,
    MpageSelectComponent
  ],
  templateUrl: './patient-modify.component.html',
  styleUrl: './patient-modify.component.scss',
  standalone: true
})
export class PatientModifyComponent {
  protected fhirPatient = inject(FhirPatientService);
  private dialog = inject(Dialog);

  protected genders: ISelectValue[] = [
    {key: 'female', value: 'Female'},
    {key: 'male', value: 'Male'},
    {key: 'other', value: 'Other'}
  ];

  protected savePatient(): void {
    // New Patient
    if (this.fhirPatient.patient().patientId === '') {
      this.fhirPatient.createPatient();
    } else {
      this.fhirPatient.updatePatient();
    }
    this.fhirPatient.loadPatients();
    this.fhirPatient.view.set('table');
  }

  protected deletePatient(): void {
    const dialogRef = this.dialog.open<boolean>(MpageConfirmComponent,
      {
        width: '500px',
        data: {
          title: 'Confirm Patient Delete',
          titleColor: 'warn',
          text: 'Are you sure you want to delete ' + this.fhirPatient.patient().givenName + ' ' + this.fhirPatient.patient().familyName + '?',
          icon: 'delete',
          showConfirmButton: true,
          showCancelButton: true
        }
      });

    dialogRef.closed.subscribe(deletePatient => {
      if (deletePatient) {
        console.log('delete');
        this.fhirPatient.deletePatient();
        this.fhirPatient.view.set('table');
      }
    })
  }
}
