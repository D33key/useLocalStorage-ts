# useLocalStorage

A React hook for managing local storage with built-in synchronization across tabs.

## Installation

You can install the `uselocalstorage-ts` package via npm (or whatever):

```bash
npm install uselocalstorage-ts
```

## Usage

The `useLocalStorage` hook allows you to easily read and write values from local storage. It also automatically synchronizes changes across different components of your application.
Function `setLocalStorageValueGlobally` allows you to change value wherever you want.

### Example

```javascript
import { useLocalStorage } from 'uselocalstorage-ts';

const MyComponent = () => {
	const [value, setValue] = useLocalStorage('myKey', 'defaultValue');

	return (
		<div>
			<input
				type='text'
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<p>Current Value: {value}</p>
		</div>
	);
};

// AnotherComponent.tsx
import { setLocalStorageValueGlobally } from 'uselocalstorage-ts';

const AnotherMyComponent = () => {
	return (
		<button
			onClick={() => setLocalStorageValueGlobally('myKey', 'AnotherValue')}
		>
			Change localStorage!{' '}
		</button>
	);
};
```

## API

### useLocalStorage

`useLocalStorage(key: string, initialValue: InitialValue): [Value, (newValue: NewValue) => void]`

- key: A string representing the key in local storage.
- initialValue: The initial value to use if there is no value in local storage.
- Returns: An array containing:
  - The current value from local storage (or the initial value).
  - A function to update the value in local storage.

### setLocalStorageValueGlobally

You can update local storage globally using the setLocalStorageValueGlobally function:

```javascript
import { setLocalStorageValueGlobally } from 'uselocalstorage-ts';

setLocalStorageValueGlobally('myKey', 'newValue');
```

This function updates the value and dispatches a storage event, allowing all components to react to the change.
