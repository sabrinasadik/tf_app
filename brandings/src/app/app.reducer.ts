import { BrandingActions, BrandingActionTypes } from '../actions/branding.actions';
import { EventPresence, EventPresenceStatus } from '../interfaces/agenda.interfaces';
import { SetReferralResult } from '../interfaces/referrals.interfaces';
import { apiRequestLoading, apiRequestSuccess } from '../interfaces/rpc.interfaces';
import { IBrandingState, initialState } from '../state/app.state';

export function appReducer(state: IBrandingState = initialState, action: BrandingActions): IBrandingState {
  switch (action.type) {
    case BrandingActionTypes.API_CALL_COMPLETE:
      return {
        ...state,
        apiCallResult: { ...action.payload },
      };
    case BrandingActionTypes.GET_GLOBAL_STATS:
      return {
        ...state,
        globalStatsStatus: apiRequestLoading,
      };
    case BrandingActionTypes.GET_GLOBAL_STATS_COMPLETE:
      return {
        ...state,
        globalStats: action.payload,
        globalStatsStatus: apiRequestSuccess,
      };
    case BrandingActionTypes.GET_GLOBAL_STATS_FAILED:
      return {
        ...state,
        globalStatsStatus: action.payload,
      };
    case BrandingActionTypes.GET_SEE_DOCUMENTS:
      return {
        ...state,
        seeDocumentsStatus: apiRequestLoading,
      };
    case BrandingActionTypes.GET_SEE_DOCUMENTS_COMPLETE:
      return {
        ...state,
        seeDocuments: action.payload,
        seeDocumentsStatus: apiRequestSuccess,
      };
    case BrandingActionTypes.GET_SEE_DOCUMENTS_FAILED:
      return {
        ...state,
        seeDocumentsStatus: action.payload,
      };
    case BrandingActionTypes.SET_REFERRER:
      return {
        ...state,
        setReferrerStatus: apiRequestLoading,
      };
    case BrandingActionTypes.SET_REFERRER_COMPLETE:
      return {
        ...state,
        setReferrerResult: (<SetReferralResult>action.payload).result,
        setReferrerStatus: apiRequestSuccess,
      };
    case BrandingActionTypes.SET_REFERRER_FAILED:
      return {
        ...state,
        setReferrerStatus: action.payload,
      };
    case BrandingActionTypes.GET_EVENTS:
      return {
        ...state,
        events: initialState.events,
      };
    case BrandingActionTypes.GET_EVENTS_COMPLETE:
      return {
        ...state,
        events: action.payload,
      };
    case BrandingActionTypes.GET_EVENT_PRESENCE:
      return {
        ...state,
        eventPresenceStatus: apiRequestLoading,
      };
    case BrandingActionTypes.GET_EVENT_PRESENCE_COMPLETE:
      return {
        ...state,
        eventPresence: action.payload,
        eventPresenceStatus: apiRequestSuccess,
      };
    case BrandingActionTypes.GET_EVENT_PRESENCE_FAILED:
      return {
        ...state,
        eventPresenceStatus: action.payload,
      };
    case BrandingActionTypes.UPDATE_EVENT_PRESENCE:
      let newPresentCount = state.eventPresence!.present_count;
      if (action.payload.status === EventPresenceStatus.PRESENT && state.eventPresence!.status !== EventPresenceStatus.PRESENT) {
        newPresentCount += 1;
      } else if (action.payload.status === EventPresenceStatus.ABSENT && state.eventPresence!.status === EventPresenceStatus.PRESENT) {
        newPresentCount -= 1;
      }
      return {
        ...state,
        updateEventPresenceStatus: apiRequestLoading,
        eventPresence: {
          ...state.eventPresence!,
          present_count: newPresentCount,
        },
      };
    case BrandingActionTypes.UPDATE_EVENT_PRESENCE_COMPLETE:
      return {
        ...state,
        eventPresence: {
          ...<EventPresence>state.eventPresence,
          ...action.payload
        },
        updateEventPresenceStatus: apiRequestSuccess,
      };
    case BrandingActionTypes.UPDATE_EVENT_PRESENCE_FAILED:
      return {
        ...state,
        updateEventPresenceStatus: action.payload,
      };
    case BrandingActionTypes.GET_NODE_STATUS:
      return {
        ...state,
        nodeStatusStatus: apiRequestLoading,
      };
    case BrandingActionTypes.GET_NODE_STATUS_COMPLETE:
      return {
        ...state,
        nodeStatus: action.payload,
        nodeStatusStatus: apiRequestSuccess,
      };
    case BrandingActionTypes.GET_NODE_STATUS_FAILED:
      return {
        ...state,
        nodeStatusStatus: action.payload,
      };
  }
  return state;
}
