import { combineReducers, ReducersMapObject, createStore } from 'redux';
import * as React from 'react';
import {connect as reduxConnect} from 'react-redux';

export interface DefaultStoreState {

}

const DefaultStoreState: DefaultStoreState = {

};

const DefaultReducer = (state: DefaultStoreState, action) => {
  switch(action.type) {
    default: return state || DefaultStoreState;
  }
};

export interface GlobalState {
  default: DefaultStoreState;
}

const reducers: ReducersMapObject = {
  default: DefaultReducer
};

export const store = createStore(combineReducers(reducers));

type ComponentConstructor<P> = React.ComponentClass<P> | React.StatelessComponent<P>;
export function connect<P>(mapProps: (globalState: GlobalState, ownProps: P) => P, mapDispatch: (dispatch: typeof store.dispatch, ownProps: P) => P) {
  return function<T extends ComponentConstructor<P>>(c: T) {
    return reduxConnect(mapProps, mapDispatch)(c);
  }
};