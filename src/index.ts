import type { TConfig } from './machine.types.js';

export function createMachine<C extends TConfig>(config: C) {
  const machine = {
    state: config.initialState as keyof C['states'],
    transition<
      S extends keyof C['states'],
      E extends keyof C['states'][S]['transitions'],
    >(state: S, event: E) {
      const currentStateConfig = config.states[state as string];
      if (!currentStateConfig) return machine.state;

      const transition = currentStateConfig.transitions[event as string];
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
