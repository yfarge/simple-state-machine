export type TAction = () => void;

export type TTransition<TState extends string = string> = {
  target: TState;
  actions: Array<TAction>;
};

export type TStateConfig<
  TState extends string = string,
  TEvent extends string = string,
> = {
  actions: {
    onEnter: TAction;
    onExit: TAction;
  };
  transitions: Record<TEvent, TTransition<TState>>;
};

export type TMachineConfig<
  TState extends string = string,
  TEvent extends string = string,
> = {
  initialState: TState;
  states: Record<TState, TStateConfig<TState, TEvent>>;
};

export type TMachine<
  TState extends string = string,
  TEvent extends string = string,
> = {
  state: TState;
  transition(state: TState, event: TEvent): TState;
};
