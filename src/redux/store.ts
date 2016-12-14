import { DefaultRootReducer, DefaultStoreState } from './defaultStore';
import { combineReducers, ReducersMapObject, createStore } from 'redux';
import * as React from 'react';
import { connect as reduxConnect } from 'react-redux';

/** Global stuff */

export interface GlobalState {
  default: DefaultStoreState;
}

const reducers: ReducersMapObject = {
  default: DefaultRootReducer
};

export const store = createStore(combineReducers(reducers));

type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;
export function connect<P>(mapProps: (globalState: GlobalState, ownProps: P) => P, mapDispatch: (dispatch: typeof store.dispatch, ownProps: P) => P) {
  return function <T extends ComponentConstructor<P>>(c: T) {
    return reduxConnect(mapProps, mapDispatch)(c);
  }
};