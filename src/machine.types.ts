export type TAction = () => void;

export type TTransition = {
  target: string;
  actions: Array<TAction>;
};

export type TStateConfig = Record<
  string,
  {
    actions: { onEnter: () => void; onExit: () => void };
    transitions: Record<string, TTransition>;
  }
>;

export type TConfig = {
  initialState: string;
  states: TStateConfig;
};
