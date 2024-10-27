import type { TMachineConfig, TMachine } from './machine.types.js';

export function createMachine(config: TMachineConfig): TMachine {
  const machine: TMachine = {
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
