import { combineReducers, ReducersMapObject, createStore } from 'redux';
import * as React from 'react';
import {connect as reduxConnect} from 'react-redux';

enum ActionTypes {
  increment
}

export interface BarkCount {
  volume: number;
  timestamp: Date;
  data: string;
}

export interface DefaultStoreState {
  barkcounts: BarkCount[];
}

const DefaultStoreState: DefaultStoreState = {
  barkcounts: []
};

const DefaultReducer = (state: DefaultStoreState, action) => {
  switch(action.type) {
    case ActionTypes.increment: return Object.assign({}, state, {
      barkcounts: state.barkcounts.concat(action.count)
    });
    default: return state || DefaultStoreState;
  }
};

export const incrementCount = (count: BarkCount) => {
  return {
    type: ActionTypes.increment,
    count
  }
}

/** Global stuff */

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