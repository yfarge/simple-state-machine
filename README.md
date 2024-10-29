# Finite State Machine in TypeScript

This repository implements a simple Finite State Machine (FSM) in TypeScript. It serves as a practical exercise to better understand the concepts of state machines rather than as a production-ready solution.

## Table of Contents

- [What is a Finite State Machine?](#what-is-a-finite-state-machine)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [createMachine](#createmachine)
- [Type Inference for Transitions](#type-inference-for-transitions)
- [Testing](#testing)
- [License](#license)

## What is a Finite State Machine?

A finite state machine is a computational model used to represent and manage states and transitions within a system. It consists of a finite number of states, a set of inputs (events), and rules that dictate how to transition from one state to another based on those inputs. FSMs are widely used in various software engineering applications, including:

- User interface state management
- Protocol design
- Game development
- Workflow systems

## Features

- Define states and transitions easily with a simple configuration.
- Supports entry and exit actions for each state.
- Type-safe implementation using TypeScript.

## Installation

To install the package:

```bash
pnpm install simple-state-machine-ts
```

## Usage

Here's a basic example of how to create and use a finite state machine:

```typescript
import { createMachine } from 'simple-state-machine-ts';

const config = {
  initialState: 'off',
  states: {
    on: {
      actions: {
        onEnter: () => console.log('Entered ON state'),
        onExit: () => console.log('Exited ON state'),
      },
      transitions: {
        switch: {
          target: 'off',
          actions: [() => console.log('Switching to OFF')],
        },
      },
    },
    off: {
      actions: {
        onEnter: () => console.log('Entered OFF state'),
        onExit: () => console.log('Exited OFF state'),
      },
      transitions: {
        switch: {
          target: 'on',
          actions: [() => console.log('Switching to ON')],
        },
      },
    },
  },
};

const machine = createMachine(config);

// Transition between states
machine.transition(machine.state, 'switch'); // Switch to ON
machine.transition(machine.state, 'switch'); // Switch to OFF
```

## API

### `createMachine<C extends TConfig>(config: C)`

Creates a finite state machine with the given configuration.

#### Parameters

- `config`: An object that defines the machine's initial state and the states themselves, which include:

  - `initialState`: A string representing the name of the initial state.
  - `states`: A record of states, where each state has:
    - `actions`: An object containing `onEnter` and `onExit` functions that execute upon entering or exiting the state.
    - `transitions`: A record of possible transitions, where each transition specifies:
      - `target`: The name of the state to transition to.
      - `actions`: An array of functions to execute during the transition.

#### Returns

An object representing the finite state machine with a `transition` method to change states.

## Type Inference for Transitions

The `transition` method benefits from TypeScript's type inference, ensuring that the provided event matches a valid transition for the current state. Here's how it works:

```typescript
const config = {
  initialState: 'off',
  states: {
    on: {
      actions: { onEnter: () => {}, onExit: () => {} },
      transitions: {
        switch: {
          target: 'off',
          actions: [],
        },
      },
    },
    off: {
      actions: { onEnter: () => {}, onExit: () => {} },
      transitions: {
        switch: {
          target: 'on',
          actions: [],
        },
      },
    },
  },
};

const machine = createMachine(config);

// Type inference ensures only valid events can be passed
machine.transition('off', 'switch'); // Valid
// @ts-expect-error
machine.transition('off', 'unknown'); // Error: Argument of type '"unknown"' is not assignable
```

This feature enhances type safety, making it clear what events are valid for each state.

## Testing

The implementation includes tests using Vitest. To run the tests, ensure you have Vitest installed and run:

```bash
pnpm test
```

The tests cover various scenarios, such as:

- State transitions
- Calling entry and exit actions
- Handling unknown transitions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
