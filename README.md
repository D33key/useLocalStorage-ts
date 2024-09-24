# useLocalStorage
[![npm downloads](https://img.shields.io/npm/dm/uselocalstorage-ts)](https://www.npmjs.com/package/uselocalstorage-ts)
[![bundle size](https://img.shields.io/bundlephobia/min/uselocalstorage-ts)](https://bundlephobia.com/result?p=uselocalstorage-ts)


A React hook for managing local storage with built-in synchronization across tabs.

## Installation

You can install the `uselocalstorage-ts` package via npm (or whatever):

```bash
npm install uselocalstorage-ts
```

## Usage

The `useLocalStorage` hook allows you to easily read and write values from local storage. It also automatically synchronizes changes across different components of your application.
Function `setValueForLocalStorage` allows you to change value wherever you want.

### Example

```javascript
import { useLocalStorage } from 'uselocalstorage-ts';

const MyComponent = () => {
	const { value: inputValue, setValueForLocalStorage: setValue } =
		useLocalStorage('myKey', 'defaultValue');

	return (
		<div>
			<input
				type='text'
				value={inputValue}
				onChange={(e) => setValue(e.target.value)}
			/>
			<p>Current Value: {value}</p>
		</div>
	);
};

// AnotherComponent.tsx
import { setValueForLocalStorage } from 'uselocalstorage-ts';

const AnotherMyComponent = () => {
	return (
		<button onClick={() => setValueForLocalStorage('myKey', 'AnotherValue')}>
			Change localStorage!{' '}
		</button>
	);
};
```

## API

### useLocalStorage

`useLocalStorage(key: string, initialValue: InitialValue): {
    readonly value: Value | InitialValue;
    readonly setValueForLocalStorage: <NewValue>(newValue: NewValue) => void;
    readonly removeKeyFromLocalStorage: () => void;
    readonly clearLocalStorage: () => void;
}`

- key: A string representing the key in local storage.
- initialValue: The initial value to use if there is no value in local storage.
- Returns: An object containing:
  - The current value from local storage (or the initial value),
  - A function to update the value in local storage,
  - A function to remove the key from local storage,
  - A function to clear ALL local storage keys.

### setValueForLocalStorage

You can update local storage globally using the setValueForLocalStorage function:

```javascript
import { setValueForLocalStorage } from 'uselocalstorage-ts';

setValueForLocalStorage('myKey', 'newValue');
```

This function updates the value and dispatches a storage event, allowing all components to react to the change.
