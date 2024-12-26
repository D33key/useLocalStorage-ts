# useLocalStorage

[![npm downloads](https://img.shields.io/npm/dm/uselocalstorage-ts)](https://www.npmjs.com/package/uselocalstorage-ts)
[![bundle size](https://img.shields.io/bundlephobia/min/uselocalstorage-ts)](https://bundlephobia.com/result?p=uselocalstorage-ts)

A React hook for managing local storage with built-in synchronization across tabs.

## Installation

You can install the `uselocalstorage-ts` package via npm (or whatever):

```bash
npm install uselocalstorage-ts
```

## Hook Description

The useLocalStorage stores values in localStorage, which allows data to persist across sessions. The hook also listens for changes in localStorage and updates the component when the relevant data changes.

## Function Signature

```typescript
useLocalStorage<Value, InitialValue>(key: string, initValue: InitialValue): Value | InitialValue
```

- **key: string**: The key under which the data will be stored in localStorage.
- **initValue**: InitialValue: The initial value. It can either be a value or a function that returns the initial value.

The hook returns the value stored in localStorage or the initial value if no data is found.

## Hook Behavior

1. **Initialization**: On the first render, the hook attempts to retrieve data from localStorage using the provided key.
2. **Subscription to Changes**: The hook subscribes to the storage event, which is triggered when data in localStorage changes. When the data for the same key changes, the component will re-render.
3. **Changing Values**: The hook uses a helper function setValueForLocalStorage to store new values in localStorage and sync them across different windows or tabs.

## Helper Functions

In addition to the main hook, the library provides several helper functions for working with localStorage:

### setValueForLocalStorage

```typescript
export const setValueForLocalStorage<NewValue>(key: string, newValue: NewValue): void
```

This function sets a value in localStorage for the specified key. If the value is a function, it is applied to the current value in localStorage (if available), and the result is saved.

- Parameters:
  - key: string: The key to store the value under.
  - newValue: NewValue: The new value to store, or a function that will be applied to the current value.
- Returns: Does not return anything.

### removeKeyFromLocalStorage

```typescript
export const removeKeyFromLocalStorage(key: string): void
```

Removes an item from localStorage by key and triggers the storage event to synchronize with other windows/tabs.

- Parameters:
  - key: string: The key for the item to remove.
- Returns: Does not return anything.

### removeKeysFromLocalStorage

```typescript
export const removeKeysFromLocalStorage(keys: string[]): void
```

Removes multiple keys from localStorage and triggers the storage event for each change.

- Parameters:
  - keys: string[]: An array of keys to remove.
  - Returns: Does not return anything.

### clearLocalStorage

```typescript
export const clearLocalStorage(): void
```

Removes all data from localStorage and triggers the storage event for each change.

- Parameters: None.
- Returns: Does not return anything.

## Usage

The `useLocalStorage` hook allows you to easily read and write values from local storage. It also automatically synchronizes changes across different components of your application.
Function `setValueForLocalStorage` allows you to change value wherever you want.

### Example

```javascript
import { useLocalStorage, setValueForLocalStorage } from 'uselocalstorage-ts';

const MyComponent = () => {
	const inputValue = useLocalStorage('myKey', 'defaultValue');

	return (
		<div>
			<input
				type='text'
				value={inputValue}
				onChange={(e) => setValueForLocalStorage(e.target.value)}
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
