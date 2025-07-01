import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DateTime} from 'luxon';
import {MPageService} from '@clinicaloffice/mpage-developer';

export interface IPatient {
  patientId: string;
  familyName: string;
  givenName: string;
  gender: string;
  birthDate: Date;
  phoneNumber: string;
  fullUrlId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FhirPatientService {
  public readonly serviceName = 'FhirPatientService';
  public fhirServer: WritableSignal<string> = signal('');
  public logKeys: string[] = ['name'];

  public patients: WritableSignal<any[]> = signal([]);
  public previousLink: WritableSignal<string> = signal('');
  public nextLink: WritableSignal<string> = signal('');
  public searchText: WritableSignal<string> = signal('');
  public view: WritableSignal<string> = signal('table');
  public patient: WritableSignal<IPatient> = signal({...this.newPatient()});

  private http = inject(HttpClient);
//  private headers = inject(HttpHeaders);
  private mPage = inject(MPageService);

  public newPatient(): IPatient {
    return {
      patientId: '',
      familyName: '',
      givenName: '',
      gender: '',
      birthDate: new Date(),
      phoneNumber: '',
      fullUrlId: ''
    };
  }

  private get(url: string): Observable<any> {
    return this.http.get(url);
  }

  private post(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.post(url, JSON.stringify(data), {headers});
  }

  private put(url: string, data: any): Observable<any> {
    console.log(data);
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.put(url, JSON.stringify(data), {headers});
  }

  private delete(url: string): Observable<any> {
    return this.http.delete(url);
  }

  // Create new patient
  public createPatient(): void {
    this.post(this.fhirServer() + 'Patient', this.patientData()).subscribe(result => {
      console.log(result);
    });
  }

  // Update patient
  public updatePatient(): void {
    this.put(this.fhirServer() + 'Patient/' + this.patient().patientId, {id: this.patient().patientId, ...this.patientData()}).subscribe(result => {
      console.log(result);
    });
  }

  private patientData(): any {
    return {
      resourceType: 'Patient',
      name: [
        {
          family: this.patient().familyName,
          given: [
            this.patient().givenName,
          ]
        }
      ],
      gender: this.patient().gender,
      birthDate: this.mPage.fromJSDate(this.patient().birthDate, false),
      telecom: [
        {
          system: 'phone',
          value: this.patient().phoneNumber
        }
      ],
      active: true
    }
  }

  // Delete Patient
  public deletePatient(): void {
    this.delete(this.fhirServer() + 'Patient/' + this.patient().patientId).subscribe(deletedPatient => {
      console.log(deletedPatient);
    })
  }

  // Process patient load
  public loadPatients(url = this.fhirServer() + 'Patient?active=true' + this.searchText() + '&_count=20&_sort=family,given') {
    this.get(url).subscribe(patients => {
      // Store the previous and next link if available
      this.previousLink.set('');
      this.nextLink.set('');
      if (patients.link) {
        patients.link.forEach((link: any) => {
          if (link.relation === 'previous') this.previousLink.set(link.url);
          else if (link.relation === 'next') this.nextLink.set(link.url);
        })
      }

      // Only process patients with a name
      const data: IPatient[] = [];
      if (patients.entry) {
        patients.entry.forEach((patient: any) => {
          data.push({
            patientId: patient.resource.id,
            familyName: this.patientName(patient.resource, 'family'),
            givenName: this.patientName(patient.resource, 'given'),
            birthDate: this.displayDate(patient.resource.birthDate),
            gender: patient.resource.gender ?? '',
            phoneNumber: patient.resource.telecom ? patient.resource.telecom[0].value : 'N/A',
            fullUrlId: patient.fullUrl
          })
        });
      }
      this.patients.set(data);
    })
  }

  private displayDate(dateValue: any): any {
    if (dateValue) {
      return DateTime.fromISO(dateValue).toJSDate()
    }
    return '0000-00-00T00:00:00.000+00:00';
  }

  // Parses the patient name into something useful
  private patientName(patient: any, nameType: string): string {
    if (patient.name) {
      const foundName = patient.name.find((name: any) => {
        return name.use === undefined || name.use === 'usual' || name.use === 'official'
      });
      if (foundName) {
        return nameType === 'family' ? foundName.family ?? '' : foundName.given[0] ?? '';
      } else if (patient.name.length > 0) {  // Put alternate name if other name types not found.
        return nameType === 'family' ? patient.name[0].family ?? '' : patient.name[0].given[0] ?? '';
      }
    }

    return '!!! Name not assigned !!!';
  }

  // Return all values
  public values(): any[] {
    return this.patients();
  }

  // Return number of entries
  public length(): number {
    return this.patients().length;
  }
}
