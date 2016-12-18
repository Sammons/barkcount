import { BaseAction } from './helpers/reducerHelpers';
import { ConfigWidgetReducer, ConfigWidgetState } from './configWidgetStore';
import {
  Action,
  ActionCreatorsMapObject,
  combineReducers,
  createStore,
  Dispatch,
  ReducersMapObject,
  compose
} from 'redux';
import * as React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { DefaultRootReducer, DefaultStoreState } from './defaultStore';
import { SoundSubscriptionReducer, SoundSubscriptionState } from './soundSubscriptionStore';
// import {persistState} from 'redux-devtools';
/** Global stuff */

export interface GlobalState {
  default: DefaultStoreState;
  soundSubscriptions: SoundSubscriptionState;
  configWidget: ConfigWidgetState;
}

type MapState<S> = {
  [T in keyof S]: (state: S[T], action: BaseAction) => S[T] 
}

const reducers: MapState<GlobalState> = {
  default: DefaultRootReducer,
  soundSubscriptions: SoundSubscriptionReducer,
  configWidget: ConfigWidgetReducer
};

export const store = createStore(combineReducers(reducers));

if (module['hot']) {
  module['hot'].accept('../store', () => {
    store.replaceReducer(combineReducers(reducers));
  });
}

type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;
export function connect<P>(
  mapProps: (globalState: GlobalState, ownProps: P) => Partial<P> & Object,
  mapDispatch: (dispatch: typeof store.dispatch, ownProps: P) => P) {
  return function <T extends ComponentConstructor<P>>(c: T) {
    return reduxConnect(mapProps, mapDispatch)(c);
  }
};

