
enum ActionTypes {
  setSubscription
}

export interface SoundBarState {
  subscription: number
}

const SoundBarState: SoundBarState = {
  subscription: null
};

function RegisterReduction<T>(reducerList: { [type: number]: (state: T, action) => T }, type: number) {
  return function (f: <Y>(state: T, action: Y) => T) {
    reducerList[type] = f;
  }
}

const SoundBarReducers: { [actionType: number]: <Y>(state: SoundBarState, action: Y) => SoundBarState; } = [];
export const DefaultRootReducer = (state: SoundBarState, action) => {
  return action && SoundBarReducers[action.type]
    ? SoundBarReducers[action.type](state, action)
    : state || SoundBarState;
};

interface SetSubscriptionDispatchType { type: number; count: number }
const SetSubscriptionReduction = (state: SoundBarState, action: SetSubscriptionDispatchType): SoundBarState => {
  return Object.assign({}, state, {
    subscription: state.subscription
  });
}
RegisterReduction(SoundBarReducers, ActionTypes.setSubscription)(SetSubscriptionReduction);

export const incrementCount = (count: number): SetSubscriptionDispatchType => {
  return {
    type: ActionTypes.setSubscription,
    count
  }
}
