import { insertItem, updateItem } from '../../../framework/client/ngrx/redux-utils';
import { apiRequestLoading, apiRequestSuccess } from '../../../framework/client/rpc/rpc.interfaces';
import * as actions from '../actions/threefold.action';
import { TffActions } from '../actions/threefold.action';
import { initialTffState, ITffState } from '../states/index';

export function tffReducer(state: ITffState = initialTffState, action: TffActions): ITffState {
  switch (action.type) {
    case actions.TffActionTypes.GET_ORDERS:
      return {
        ...state,
        ordersStatus: apiRequestLoading,
        orders: action.payload.cursor ? state.orders : initialTffState.orders,
        ordersQuery: action.payload,
      };
    case actions.TffActionTypes.GET_ORDERS_COMPLETE:
      return {
        ...state,
        orders: {
          cursor: action.payload.cursor,
          more: action.payload.more,
          results: [ ...state.orders.results, ...action.payload.results ],
        },
        ordersQuery: {
          ...state.ordersQuery,
          cursor: action.payload.cursor,
        },
        ordersStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_ORDERS_FAILED:
      return {
        ...state,
        ordersStatus: action.payload,
      };
    case actions.TffActionTypes.RESET_ORDER:
      return {
        ...state,
        order: initialTffState.order,
        updateOrderStatus: initialTffState.updateOrderStatus,
      };
    case actions.TffActionTypes.GET_ORDER:
      return {
        ...state,
        order: initialTffState.order,
        orderStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_ORDER_COMPLETE:
      return {
        ...state,
        order: action.payload,
        orderStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_ORDER_FAILED:
      return {
        ...state,
        orderStatus: action.payload,
      };
    case actions.TffActionTypes.UPDATE_ORDER:
      return {
        ...state,
        updateOrderStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.UPDATE_ORDER_COMPLETE:
      return {
        ...state,
        order: action.payload,
        orders: {
          ...state.orders,
          results: updateItem(state.orders.results, action.payload, 'id'),
        },
        updateOrderStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.UPDATE_ORDER_FAILED:
      return {
        ...state,
        updateOrderStatus: action.payload,
      };
    case actions.TffActionTypes.GET_INVESTMENT_AGREEMENTS:
      return {
        ...state,
        investmentAgreementsStatus: apiRequestLoading,
        investmentAgreementsQuery: action.payload,
        investmentAgreements: action.payload.cursor ? state.investmentAgreements :
          initialTffState.investmentAgreements,
      };
    case actions.TffActionTypes.GET_INVESTMENT_AGREEMENTS_COMPLETE:
      return {
        ...state,
        investmentAgreements: {
          cursor: action.payload.cursor,
          more: action.payload.more,
          results: [ ...state.investmentAgreements.results, ...action.payload.results ],
        },
        investmentAgreementsStatus: apiRequestSuccess,
        investmentAgreementsQuery: {
          ...state.investmentAgreementsQuery,
          cursor: action.payload.cursor,
        },
      };
    case actions.TffActionTypes.GET_INVESTMENT_AGREEMENTS_FAILED:
      return {
        ...state,
        investmentAgreementsStatus: action.payload,
      };
    case actions.TffActionTypes.RESET_INVESTMENT_AGREEMENT:
      return {
        ...state,
        investmentAgreement: initialTffState.investmentAgreement,
      };
    case actions.TffActionTypes.GET_INVESTMENT_AGREEMENT:
      return {
        ...state,
        investmentAgreement: initialTffState.investmentAgreement,
        investmentAgreementStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_INVESTMENT_AGREEMENT_COMPLETE:
      return {
        ...state,
        investmentAgreement: action.payload,
        investmentAgreementStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_INVESTMENT_AGREEMENT_FAILED:
      return {
        ...state,
        investmentAgreementStatus: action.payload,
      };
    case actions.TffActionTypes.UPDATE_INVESTMENT_AGREEMENT:
      return {
        ...state,
        updateInvestmentAgreementStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.UPDATE_INVESTMENT_AGREEMENT_COMPLETE:
      return {
        ...state,
        investmentAgreement: action.payload,
        investmentAgreements: {
          ...state.investmentAgreements,
          results: updateItem(state.investmentAgreements.results, action.payload, 'id'),
        },
        updateInvestmentAgreementStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.UPDATE_INVESTMENT_AGREEMENT_FAILED:
      return {
        ...state,
        updateInvestmentAgreementStatus: action.payload,
      };
    case actions.TffActionTypes.CREATE_INVESTMENT_AGREEMENT:
      return {
        ...state,
        createInvestmentAgreementStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.CREATE_INVESTMENT_AGREEMENT_COMPLETE:
      return {
        ...state,
        investmentAgreement: action.payload,
        investmentAgreements: initialTffState.investmentAgreements,
        createInvestmentAgreementStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.CREATE_INVESTMENT_AGREEMENT_FAILED:
      return {
        ...state,
        createInvestmentAgreementStatus: action.payload,
      };
    case actions.TffActionTypes.GET_GLOBAL_STATS_LIST:
      return {
        ...state,
        globalStatsListStatus: apiRequestLoading,

      };
    case actions.TffActionTypes.GET_GLOBAL_STATS_LIST_COMPLETE:
      return {
        ...state,
        globalStatsList: action.payload,
        globalStatsListStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_GLOBAL_STATS_LIST_FAILED:
      return {
        ...state,
        globalStatsListStatus: action.payload,
      };
    case actions.TffActionTypes.GET_GLOBAL_STATS:
      return {
        ...state,
        globalStats: initialTffState.globalStats,
        globalStatsStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_GLOBAL_STATS_COMPLETE:
      return {
        ...state,
        globalStats: action.payload,
        globalStatsStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_GLOBAL_STATS_FAILED:
      return {
        ...state,
        globalStatsStatus: action.payload,
      };
    case actions.TffActionTypes.UPDATE_GLOBAL_STATS:
      return {
        ...state,
        updateGlobalStatsStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.UPDATE_GLOBAL_STATS_COMPLETE:
      return {
        ...state,
        globalStats: action.payload,
        globalStatsList: updateItem(state.globalStatsList, action.payload, 'id'),
        updateGlobalStatsStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.UPDATE_GLOBAL_STATS_FAILED:
      return {
        ...state,
        updateGlobalStatsStatus: action.payload,
      };
    case actions.TffActionTypes.SEARCH_USERS:
      return {
        ...state,
        userListQuery: action.payload,
        userListStatus: apiRequestLoading,
        userList: action.payload.cursor ? state.userList : initialTffState.userList,
      };
    case actions.TffActionTypes.SEARCH_USERS_COMPLETE:
      return {
        ...state,
        userListQuery: {
          ...state.userListQuery,
          cursor: action.payload.cursor,
        },
        userList: {
          cursor: action.payload.cursor,
          more: action.payload.more,
          results: [ ...state.userList.results, ...action.payload.results ],
        },
        userListStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.SEARCH_USERS_FAILED:
      return {
        ...state,
        userListStatus: action.payload,
      };
    case actions.TffActionTypes.GET_USER:
      return {
        ...state,
        user: null,
        userStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_USER_COMPLETE:
      return {
        ...state,
        user: action.payload,
        userStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_USER_FAILED:
      return {
        ...state,
        userStatus: action.payload,
      };
    case actions.TffActionTypes.GET_TFF_PROFILE:
      return {
        ...state,
        tffProfile: null,
        tffProfileStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_TFF_PROFILE_COMPLETE:
      return {
        ...state,
        tffProfile: action.payload,
        tffProfileStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_TFF_PROFILE_FAILED:
      return {
        ...state,
        tffProfileStatus: action.payload,
      };
    case actions.TffActionTypes.GET_BALANCE:
      return {
        ...state,
        balance: initialTffState.balance,
        balanceStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_BALANCE_COMPLETE:
      return {
        ...state,
        balance: action.payload,
        balanceStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_BALANCE_FAILED:
      return {
        ...state,
        balanceStatus: action.payload,
      };
    case actions.TffActionTypes.GET_USER_TRANSACTIONS:
      return {
        ...state,
        userTransactions: initialTffState.userTransactions,
        userTransactionsStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_USER_TRANSACTIONS_COMPLETE:
      return {
        ...state,
        userTransactions: action.payload,
        userTransactionsStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_USER_TRANSACTIONS_FAILED:
      return {
        ...state,
        userTransactionsStatus: action.payload,
      };
    case actions.TffActionTypes.RESET_NEW_TRANSACTION:
      return {
        ...state,
        createTransactionStatus: initialTffState.createTransactionStatus,
      };
    case actions.TffActionTypes.CREATE_TRANSACTION:
      return {
        ...state,
        createTransactionStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.CREATE_TRANSACTION_COMPLETE:
      return {
        ...state,
        createTransactionStatus: apiRequestSuccess,
        userTransactions: {
          ...state.userTransactions,
          results: [ ...state.userTransactions.results, action.payload ],
        },
      };
    case actions.TffActionTypes.CREATE_TRANSACTION_FAILED:
      return {
        ...state,
        createTransactionStatus: action.payload,
      };
    case actions.TffActionTypes.SET_KYC_STATUS:
      return { ...state, setKYCStatus: apiRequestLoading };
    case actions.TffActionTypes.SET_KYC_STATUS_COMPLETE:
      return {
        ...state,
        setKYCStatus: apiRequestSuccess,
        tffProfile: action.payload,
      };
    case actions.TffActionTypes.SET_KYC_STATUS_FAILED:
      return { ...state, setKYCStatus: action.payload };
    case actions.TffActionTypes.GET_AGENDA_EVENTS:
      return {
        ...state,
        agendaEventsStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_AGENDA_EVENTS_COMPLETE:
      return {
        ...state,
        agendaEvents: action.payload,
        agendaEventsStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_AGENDA_EVENTS_FAILED:
      return {
        ...state,
        agendaEventsStatus: action.payload,
      };
    case actions.TffActionTypes.GET_AGENDA_EVENT:
      return {
        ...state,
        agendaEventStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_AGENDA_EVENT_COMPLETE:
      return {
        ...state,
        agendaEvent: action.payload,
        agendaEventStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_AGENDA_EVENT_FAILED:
      return {
        ...state,
        agendaEventStatus: action.payload,
      };
    case actions.TffActionTypes.RESET_AGENDA_EVENT:
      return {
        ...state,
        createAgendaEventStatus: initialTffState.createAgendaEventStatus,
      };
    case actions.TffActionTypes.CREATE_AGENDA_EVENT:
      return {
        ...state,
        createAgendaEventStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.CREATE_AGENDA_EVENT_COMPLETE:
      return {
        ...state,
        agendaEvent: action.payload,
        agendaEvents: insertItem(state.agendaEvents, action.payload),
        createAgendaEventStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.CREATE_AGENDA_EVENT_FAILED:
      return {
        ...state,
        createAgendaEventStatus: action.payload,
      };
    case actions.TffActionTypes.UPDATE_AGENDA_EVENT:
      return {
        ...state,
        updateAgendaEventStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.UPDATE_AGENDA_EVENT_COMPLETE:
      return {
        ...state,
        agendaEvent: action.payload,
        updateAgendaEventStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.UPDATE_AGENDA_EVENT_FAILED:
      return {
        ...state,
        updateAgendaEventStatus: action.payload,
      };
    case actions.TffActionTypes.GET_EVENT_PARTICIPANTS:
      return {
        ...state,
        eventParticipants: initialTffState.eventParticipants,
        eventParticipantsStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_EVENT_PARTICIPANTS_COMPLETE:
      return {
        ...state,
        eventParticipants: action.payload,
        eventParticipantsStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_EVENT_PARTICIPANTS_FAILED:
      return {
        ...state,
        eventParticipantsStatus: action.payload,
      };
    case actions.TffActionTypes.GET_KYC_CHECKS:
      return {
        ...state,
        kycChecksStatus: apiRequestLoading,
      };
    case actions.TffActionTypes.GET_KYC_CHECKS_COMPLETE:
      return {
        ...state,
        kycChecks: action.payload,
        kycChecksStatus: apiRequestSuccess,
      };
    case actions.TffActionTypes.GET_KYC_CHECKS_FAILED:
      return {
        ...state,
        kycChecksStatus: action.payload,
      };
    default:
      return state;
  }
}
