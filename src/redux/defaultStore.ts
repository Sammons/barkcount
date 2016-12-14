import { ReducerTemplate } from './helpers/reducerHelpers';

enum ActionTypes {
  increment,
  updateCount
}

export interface BarkCount {
  volume: number;
  timestamp: Date;
  data: string;
}

export interface DefaultStoreState {
  barkcounts: BarkCount[];
  _v: number
}

const defaultTemplate = new ReducerTemplate(/** default state */{
  _v: 0 as number,
  barkcounts: []
})

interface IncrementCountDispatchType { type: number; count: BarkCount }
const IncrementCountReduction = (state: DefaultStoreState, action: IncrementCountDispatchType) => {
  return Object.assign({}, state, {
    barkcounts: state.barkcounts.concat(action.count),
    temp: 2
  });
}
defaultTemplate.addReducer(IncrementCountReduction, ActionTypes.increment);

defaultTemplate.addReducer((state) => {
  return Object.assign({}, state, { _v: state._v + 1});
}, ActionTypes.updateCount)

export const incrementCount = (count: BarkCount): IncrementCountDispatchType => {
  return {
    type: ActionTypes.increment,
    count
  }
}

export const updateCounts = () => {
  return {
    type: ActionTypes.updateCount
  }
}

export const DefaultRootReducer = defaultTemplate.rootReducer;
