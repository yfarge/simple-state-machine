export type TAction = () => void;

export type TTransition = {
  target: string;
  actions: Array<TAction>;
};

export type TStateConfig = Record<
  string,
  {
    actions: { onEnter: TAction; onExit: TAction };
    transitions: Record<string, TTransition>;
  }
>;

export type TConfig = {
  initialState: string;
  states: TStateConfig;
};
