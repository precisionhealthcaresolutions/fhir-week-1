import {ChangeDetectionStrategy, Component, inject, input, InputSignal, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  MPageService,
  MpageLogComponent,
  PersonService,
  MPageLogService,
  ConfigService
} from '@clinicaloffice/mpage-developer';
import {JsonPipe, NgClass} from '@angular/common';
import {FhirPatientService} from './services/fhir-patient.service';
import {PatientTableComponent} from './patient-table/patient-table.component';
import {PatientModifyComponent} from './patient-modify/patient-modify.component';

declare const VERSION: string;

@Component({
  selector: 'app-root',
  imports: [MpageLogComponent, NgClass, JsonPipe, PatientTableComponent, PatientModifyComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['../styles.scss', '../clinical-office-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  public activatedRoute = inject(ActivatedRoute);
  public MPage = inject(MPageService);
  public logService = inject(MPageLogService);
  public configService = inject(ConfigService);

  public title: InputSignal<string> = input('default');

  public fhirPatient = inject(FhirPatientService);

  ngOnInit() {
    // Grab any parameters in the URL (Used in Cerner Components)
    this.activatedRoute.queryParams.subscribe(params => {
      this.MPage.personId = params['personId'] ? parseInt(params['personId']) : this.MPage.personId;
      this.MPage.encntrId = params['encounterId'] ? parseInt(params['encounterId']) : this.MPage.encntrId;
      this.MPage.prsnlId = params['userId'] ? parseInt(params['userId']) : this.MPage.prsnlId;
    });

    this.MPage.setMaxInstances(2, true, 'CHART', false);

    this.logService.addService(this.fhirPatient);

    this.fhirPatient.fhirServer.set(this.configService.config.fhirServer ?? '');
    this.fhirPatient.loadPatients();
  }

}
