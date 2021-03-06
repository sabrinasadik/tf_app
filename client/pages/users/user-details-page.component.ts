import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IAppState } from '../../../../framework/client/ngrx/state/app.state';
import { ApiRequestStatus } from '../../../../framework/client/rpc';
import { Profile } from '../../../../its_you_online_auth/client/interfaces/user.interfaces';
import { getUser, getUserStatus } from '../../tff.state';

@Component({
  selector: 'tff-user-details-page',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: `
    <div class="default-component-padding" *ngIf="(status$ | async).success">
      <pre>{{ user$ | async | json }}</pre>
    </div>
    <tff-api-request-status [status]="status$ | async"></tff-api-request-status>`
})
export class UserDetailsPageComponent implements OnInit {
  user$: Observable<Profile | null>;
  status$: Observable<ApiRequestStatus>;

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.user$ = this.store.select(getUser);
    this.status$ = this.store.select(getUserStatus);
  }
}
