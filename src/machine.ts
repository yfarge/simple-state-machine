import type { TMachineConfig, TMachine } from './machine.types.js';

export function createMachine<
  TState extends string = string,
  TEvent extends string = string,
>(config: TMachineConfig<TState, TEvent>) {
  const machine: TMachine<TState, TEvent> = {
    state: config.initialState,
    transition(state, event) {
      const currentStateConfig = config.states[state];
      const transition = currentStateConfig?.transitions[event];

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
