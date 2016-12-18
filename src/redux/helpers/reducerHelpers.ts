export interface BaseAction { type: number }
export type BCAction<T> = BaseAction & T;

export class ReducerTemplate<StateType> {
  constructor(public defaultState: StateType) { }
  public reducers: { [action: number]: <T extends BaseAction>(state: StateType, action: T) => StateType } = {};
  public rootReducer = (state: StateType, action: BaseAction): StateType => {
    return action && this.reducers[action.type]
      ? this.reducers[action.type](state, action)
      : state || this.defaultState;
  }
  public addReducer = <A extends number, T extends { type: A }>(f: (state: StateType, action: { type: A } & T) => StateType, t: A): void => {
    this.reducers[t as number] = f;
  }
  public assign(state: StateType, partial: Partial<StateType>): StateType {
    return Object.assign({}, state, partial);
  }
}
