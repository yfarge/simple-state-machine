import { describe, it, expect, vi } from 'vitest';
import { createMachine } from './machine.js';

function createSwitchMachine() {
  const config = {
    initialState: 'off',
    states: {
      on: {
        actions: {
          onEnter: vi.fn(),
          onExit: vi.fn(),
        },
        transitions: {
          switch: {
            target: 'off',
            actions: [vi.fn(), vi.fn()],
          },
        },
      },
      off: {
        actions: {
          onEnter: vi.fn(),
          onExit: vi.fn(),
        },
        transitions: {
          switch: {
            target: 'on',
            actions: [vi.fn(), vi.fn()],
          },
        },
      },
    },
  } as const;

  // @ts-expect-error
  const machine = createMachine(config);
  return { machine, config };
}

describe('createMachine', () => {
  it('should create a machine with the state set to the initial state', () => {
    const { machine } = createSwitchMachine();
    expect(machine.state).toBe('off');
  });

  describe('transition', () => {
    it('should call the `onExit` action of the current state before entering the target state', () => {
      const { machine, config } = createSwitchMachine();
      const state = machine.state;
      expect(config.states[state]?.actions.onExit).not.toHaveBeenCalled();
      machine.transition(machine.state, 'switch');
      expect(config.states[state]?.actions.onExit).toHaveBeenCalledOnce();
    });

    it('should call the `transition` actions before entering the target state', () => {
      const { machine, config } = createSwitchMachine();
      const state = machine.state;
      config.states[state]?.transitions['switch']?.actions.forEach((action) =>
        expect(action).not.toHaveBeenCalled(),
      );
      machine.transition(machine.state, 'switch');
      config.states[state]?.transitions['switch']?.actions.forEach((action) =>
        expect(action).toHaveBeenCalledOnce(),
      );
    });

    it('should call the `onEnter` action of the target state after exiting the current state', () => {
      const { machine, config } = createSwitchMachine();
      expect(config.states['on']?.actions.onEnter).not.toHaveBeenCalled();
      machine.transition(machine.state, 'switch');
      expect(config.states['on']?.actions.onEnter).toHaveBeenCalledOnce();
    });

    it('should return the current machine state if the event does not have an associated transition', () => {
      const { machine, config } = createSwitchMachine();
      expect(config.states['on']?.actions.onEnter).not.toHaveBeenCalled();
      machine.transition(machine.state, 'switch');
      expect(config.states['on']?.actions.onEnter).toHaveBeenCalledOnce();
    });

    it('should remain in the current state if the event does not have an associated transition', () => {
      const { machine } = createSwitchMachine();
      const state = machine.state;
      // @ts-expect-error
      expect(machine.transition(machine.state, 'unknown')).toBe(state);
      expect(machine.state).toBe(state);
    });

    it('should not call any actions if the the event does not have an associated transition', () => {
      const { machine, config } = createSwitchMachine();
      const state = machine.state;
      // @ts-expect-error
      machine.transition(machine.state, 'unknown');
      expect(config.states[state]?.actions.onExit).not.toHaveBeenCalled();
    });

    it('should remain in the current state if the transition target state does not exist', () => {
      const config = {
        initialState: 'on',
        states: {
          on: {
            actions: {
              onEnter: vi.fn(),
              onExit: vi.fn(),
            },
            transitions: {
              switch: {
                target: 'unknown',
                actions: [vi.fn(), vi.fn()],
              },
            },
          },
          off: {
            actions: {
              onEnter: vi.fn(),
              onExit: vi.fn(),
            },
            transitions: {
              switch: {
                target: 'on',
                actions: [vi.fn(), vi.fn()],
              },
            },
          },
        },
      };
      const machine = createMachine(config);
      const initialState = machine.state;
      expect(machine.transition(machine.state, 'switch')).toBe(initialState);
    });

    it('should handle repeated transitions correctly', () => {
      const { machine, config } = createSwitchMachine();
      expect(machine.state).toBe('off');
      machine.transition(machine.state, 'switch');
      expect(machine.state).toBe('on');
      machine.transition(machine.state, 'switch');
      expect(machine.state).toBe('off');

      expect(config.states['off']!.actions.onExit).toHaveBeenCalledOnce();
      config.states['off']!.transitions['switch']?.actions.forEach((action) =>
        expect(action).toHaveBeenCalledOnce(),
      );
      expect(config.states['on']!.actions.onEnter).toHaveBeenCalledOnce();
      config.states['on']!.transitions['switch']!.actions.forEach((action) =>
        expect(action).toHaveBeenCalledOnce(),
      );
      expect(config.states['on']!.actions.onExit).toHaveBeenCalledOnce();
      expect(config.states['off']!.actions.onEnter).toHaveBeenCalledOnce();
    });
  });
});
