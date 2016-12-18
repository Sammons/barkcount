import { ReducerTemplate } from './helpers/reducerHelpers';

enum ActionTypes {
  setThreshold,
  setMaxRecordings,
}

const template = new ReducerTemplate(/** default state */{
  barkcounts: []
})

export type ConfigWidgetState = typeof template.defaultState;
export const ConfigWidgetReducer = template.rootReducer;
