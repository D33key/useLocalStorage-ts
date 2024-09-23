import { useSyncExternalStore } from 'react';

export const setValueForLocalStorage = <NewValue>(
	key: string,
	newValue: NewValue,
) => {
	try {
		const value = JSON.stringify(newValue);

		localStorage.setItem(key, value);
		window.dispatchEvent(
			new StorageEvent('storage', {
				key,
				newValue: value,
			}),
		);
	} catch (error) {
		console.error((error as Error).message);
		throw new Error('Failed to set value in localStorage');
	}
};

export const removeKeyFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error((error as Error).message);
	}
};

export const removeKeysFromLocalStorage = (keys: string[]) => {
	try {
		keys.forEach((key) => {
			localStorage.removeItem(key);
		});
	} catch (error) {
		console.error((error as Error).message);
	}
};

export const clearLocalStorage = () => {
	try {
		localStorage.clear();
	} catch (error) {
		console.error((error as Error).message);
		throw new Error('Cannot clear local storage!');
	}
};

export function useLocalStorage<Value, InitialValue>(
	key: string,
	initialValue: InitialValue,
) {
	const getSnapshot = () => {
		try {
			const storedValue = localStorage.getItem(key);
			return storedValue ? JSON.parse(storedValue) : initialValue;
		} catch (error) {
			console.error(
				`Failed to parse stored value for key "${key}": ${
					(error as Error).message
				}`,
			);

			return initialValue;
		}
	};

	const subscribe = (callback: () => void) => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === key) {
				callback();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	};

	const value: Value | InitialValue = useSyncExternalStore(
		subscribe,
		getSnapshot,
	);

	return {
		value: value ?? initialValue,
		setValueForLocalStorage: <NewValue>(newValue: NewValue) =>
			setValueForLocalStorage(key, newValue),
		removeKeyFromLocalStorage: () => removeKeyFromLocalStorage(key),
		clearLocalStorage: clearLocalStorage,
	} as const;
}
