import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { Subscription } from 'rxjs/Subscription';
import { IAppState } from '../../../../framework/client/ngrx/state/app.state';
import { ApiRequestStatus } from '../../../../framework/client/rpc/rpc.interfaces';
import { GetOrderAction, ResetNodeOrderAction, UpdateOrderAction } from '../../actions/threefold.action';
import { NodeOrder } from '../../interfaces/nodes.interfaces';
import { ApiErrorService } from '../../services/api-error.service';
import { getOrder, getOrderStatus, updateOrderStatus } from '../../tff.state';

@Component({
  selector: 'tff-order-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tff-order-detail [nodeOrder]="order$ | async"
                      [status]="orderStatus$ | async"
                      [updateStatus]="updateOrderStatus$ | async"
                      (onUpdate)="onUpdate($event)"></tff-order-detail>`
})

export class OrderDetailPageComponent implements OnInit, OnDestroy {
  order$: Observable<NodeOrder>;
  orderStatus$: Observable<ApiRequestStatus>;
  updateOrderStatus$: Observable<ApiRequestStatus>;

  private _errorSub: Subscription;
  constructor(private store: Store<IAppState>,
              private route: ActivatedRoute,
              private apiErrorService: ApiErrorService) {
  }

  ngOnInit() {
    const orderId = this.route.snapshot.params.orderId;
    this.store.dispatch(new ResetNodeOrderAction());
    this.store.dispatch(new GetOrderAction(orderId));
    this.order$ = <Observable<NodeOrder>>this.store.select(getOrder).pipe(filter(o => o !== null));
    this.orderStatus$ = this.store.select(getOrderStatus);
    this.updateOrderStatus$ = this.store.select(updateOrderStatus);
    this._errorSub = this.updateOrderStatus$.pipe(filter(status => !status.success && !status.loading && status.error !== null))
      .subscribe(status => this.apiErrorService.showErrorDialog(status.error));
  }

  ngOnDestroy() {
    this._errorSub.unsubscribe();
  }

  onUpdate(nodeOrder: NodeOrder) {
    this.store.dispatch(new UpdateOrderAction(nodeOrder));
  }
}
