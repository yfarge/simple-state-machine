---

# Simple Finite State Machine in TypeScript

This repository implements a simple Finite State Machine (FSM) in TypeScript. It serves as a practical exercise to better understand the concepts of state machines rather than as a production-ready solution.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Testing](#testing)
- [License](#license)

## Installation

To run this project, you can clone the repository and install the dependencies:

```bash
git clone https://github.com/yfarge/simple-state-machine.git
cd simple-state-machine
pnpm install
```

## Usage

The finite state machine can be created by defining a configuration object that outlines the initial state, states, transitions, and any actions that occur during state changes.

Here’s a simple example to demonstrate how to create and use the FSM:

```typescript
import { createMachine } from 'machine.js';

const fsm = createMachine({
  initialState: 'idle',
  states: {
    idle: {
      transitions: {
        start: {
          target: 'running',
          actions: [() => console.log('Started!')],
        },
      },
      actions: {
        onEnter: () => console.log('Entering idle'),
        onExit: () => console.log('Exiting idle'),
      },
    },
    running: {
      transitions: {
        stop: {
          target: 'idle',
          actions: [() => console.log('Stopped!')],
        },
      },
      actions: {
        onEnter: () => console.log('Entering running'),
        onExit: () => console.log('Exiting running'),
      },
    },
  },
});

// Transition to the running state
fsm.transition(fsm.state, 'start'); // Output: Exiting idle, Started!

// Transition back to the idle state
fsm.transition(fsm.state, 'stop'); // Output: Exiting running, Stopped!
```

## API

### `createMachine(config: TMachineConfig<TState, TEvent>): TMachine<TState, TEvent>`

#### Parameters

- `config`: Configuration object for the FSM, including:
  - `initialState`: The starting state of the FSM.
  - `states`: An object defining each state, its transitions, and actions.

#### Returns

- A state machine object with the current state and a `transition` method.

### `transition(state: TState, event: TEvent): TState`

Handles the transition between states based on the current state and event, executing the appropriate enter and exit actions.

#### Parameters

- `state`: The state of the machine
- `event`: An event that will trigger a transition on the machine

#### Returns

- The state of the machine

## Testing

This project includes tests written with [Vitest](https://vitest.dev/) to ensure the functionality of the finite state machine.

To run the tests, use the following command:

```bash
pnpm test
```

The tests cover various scenarios, including:

- Verifying the initial state of the machine
- Ensuring the correct exit actions are called before state transitions
- Checking that transition actions are executed correctly
- Handling cases where an unknown event is triggered

Feel free to review the test cases in `src/machine.test.ts` for more details on how the FSM behaves under different conditions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
