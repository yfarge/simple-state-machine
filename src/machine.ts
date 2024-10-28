import type { TConfig } from './machine.types.js';

export function createMachine<TState extends string, TEvent extends string>(
  config: TConfig<TState, TEvent>,
) {
  const machine = {
    state: config.initialState,
    transition<S extends TState>(
      state: S,
      event: Extract<keyof (typeof config)['states'][S]['transitions'], TEvent>,
    ) {
      const currentStateConfig = config.states[state];
      const transition = currentStateConfig.transitions[event];

      if (!transition) return machine.state;

      const targetState = transition.target;
      const targetStateConfig = config.states[targetState];

      if (!targetStateConfig) return machine.state;

      currentStateConfig.actions.onExit();
      transition.actions.forEach((action) => action());
      targetStateConfig.actions.onEnter();

      machine.state = targetState;
      return machine.state;
    },
  };
  return machine;
}
