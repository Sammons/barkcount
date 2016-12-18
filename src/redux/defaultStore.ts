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
  maxVolume: number;
}

const defaultTemplate = new ReducerTemplate(/** default state */{
  barkcounts: [] as BarkCount[],
  maxVolume: 0 as number
})

interface IncrementCountDispatchType { type: number; count: BarkCount }
defaultTemplate.addReducer((state, action: IncrementCountDispatchType) => {
  return defaultTemplate.assign(state, {
    barkcounts: state.barkcounts.concat(action.count),
  });
}, ActionTypes.increment);

export const incrementCount = (count: BarkCount): IncrementCountDispatchType => {
  return {
    type: ActionTypes.increment,
    count
  }
}

export const DefaultRootReducer = defaultTemplate.rootReducer;
