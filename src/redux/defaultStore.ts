import { Snippet } from '../latent/InterleavingRecorder';
import { ReducerTemplate } from './helpers/reducerHelpers';

enum ActionTypes {
  increment,
  updateCount
}

export interface DefaultStoreState {
  barks: Snippet[];
  maxVolume: number;
}

const defaultTemplate = new ReducerTemplate(/** default state */{
  barks: [] as Snippet[],
  maxVolume: 0 as number
})

interface IncrementCountDispatchType { type: number; snip: Snippet }
defaultTemplate.addReducer((state, action: IncrementCountDispatchType) => {
  return defaultTemplate.assign(state, {
    barks: state.barks.concat(action.snip),
  });
}, ActionTypes.increment);

export const addRecording = (snip: Snippet): IncrementCountDispatchType => {
  return {
    type: ActionTypes.increment,
    snip
  }
}

export const DefaultRootReducer = defaultTemplate.rootReducer;
