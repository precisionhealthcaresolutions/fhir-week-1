import {ChangeDetectionStrategy, Component, inject, input, InputSignal, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MPageService, MpageLogComponent, PersonService} from '@clinicaloffice/mpage-developer';
import {NgClass} from '@angular/common';

declare const VERSION: string;

@Component({
  selector: 'app-root',
  imports: [MpageLogComponent, NgClass],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['../styles.scss', '../clinical-office-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {
  public activatedRoute = inject(ActivatedRoute);
  public MPage = inject(MPageService);
  private person = inject(PersonService);

  public title: InputSignal<string> = input('default');

  ngOnInit() {
    // Grab any parameters in the URL (Used in Cerner Components)
    this.activatedRoute.queryParams.subscribe(params => {
      this.MPage.personId = params['personId'] ? parseInt(params['personId']) : this.MPage.personId;
      this.MPage.encntrId = params['encounterId'] ? parseInt(params['encounterId']) : this.MPage.encntrId;
      this.MPage.prsnlId = params['userId'] ? parseInt(params['userId']) : this.MPage.prsnlId;
    });

    this.MPage.setMaxInstances(2, true, 'CHART', false);

  }

}
