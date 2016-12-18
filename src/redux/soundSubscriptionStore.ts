import { ReducerTemplate } from './helpers/reducerHelpers';
import { SoundService } from '../services/SoundService';

enum ActionTypes {
  setSubscription
}

let soundSubscriptionTemplate = new ReducerTemplate({
  subscriptions: {} as {[id: string]: number}
});
export type SoundSubscriptionState = typeof soundSubscriptionTemplate.defaultState;

interface SetSubscriptionDispatchType { type: number; subscription: number; id: string }
soundSubscriptionTemplate.addReducer((state, action: SetSubscriptionDispatchType) => {
  return soundSubscriptionTemplate.assign(state, {
    subscriptions: Object.assign(state.subscriptions, { [action.id]: action.subscription })
  });
}, ActionTypes.setSubscription)


export const setSubscription = (canvasId: string, prevSubscription: number, cb: (volume: number) => void): SetSubscriptionDispatchType => {
  if (prevSubscription) { SoundService.unsubscribe(prevSubscription); }
  let newSub = SoundService.subscribeToVolumeChange(cb);
  return {
    type: ActionTypes.setSubscription,
    subscription: newSub,
    id: canvasId
  }
}

export const SoundSubscriptionReducer = soundSubscriptionTemplate.rootReducer;