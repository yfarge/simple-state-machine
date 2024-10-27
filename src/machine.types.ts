export type TMachineStateConfig = {
  actions: {
    onEnter: () => void;
    onExit: () => void;
  };
  transitions: Record<string, { target: string; actions: Array<() => void> }>;
};

export type TMachineConfig = {
  initialState: keyof TMachineConfig['states'];
  states: Record<string, TMachineStateConfig>;
};

export type TMachine = {
  state: keyof TMachineConfig['states'];
  transition<
    TState extends keyof TMachineConfig['states'],
    TEvent extends keyof TMachineConfig['states'][TState]['transitions'],
  >(
    state: TState,
    event: TEvent,
  ): keyof TMachineConfig['states'];
};
