import { useCallback, useEffect, useSyncExternalStore } from 'react';

export const setValueForLocalStorage = <NewValue>(
	key: string,
	newValue: NewValue,
) => {
	try {
		if (newValue instanceof Function) {
			const oldValue = localStorage.getItem(key);
			if (oldValue) {
				const parsedOldValue = JSON.parse(oldValue);
				const value = newValue(parsedOldValue);

				localStorage.setItem(key, JSON.stringify(value));
				window.dispatchEvent(
					new StorageEvent('storage', {
						key,
					}),
				);
			} else {
				throw new Error('Cannot get prev value for function to apply');
			}
		} else {
			const value = JSON.stringify(newValue);
			localStorage.setItem(key, value);
			window.dispatchEvent(
				new StorageEvent('storage', {
					key,
				}),
			);
		}
	} catch (error) {
		console.error((error as Error).message);
		throw new Error(
			'Failed to set value in localStorage, because its key is empty',
		);
	}
};

export const removeKeyFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
		window.dispatchEvent(
			new StorageEvent('storage', {
				key,
			}),
		);
	} catch (error) {
		console.error((error as Error).message);
	}
};

export const removeKeysFromLocalStorage = (keys: string[]) => {
	try {
		keys.forEach((key) => {
			localStorage.removeItem(key);
			window.dispatchEvent(
				new StorageEvent('storage', {
					key,
				}),
			);
		});
	} catch (error) {
		console.error((error as Error).message);
	}
};

export const clearLocalStorage = () => {
	try {
		Object.keys(localStorage).forEach((key) => {
			localStorage.removeItem(key);
			window.dispatchEvent(
				new StorageEvent('storage', {
					key,
				}),
			);
		});
	} catch (error) {
		console.error((error as Error).message);
		throw new Error('Cannot clear local storage!');
	}
};

export function useLocalStorage<Value, InitialValue>(
	key: string,
	initValue: InitialValue,
) {
	const initialValue = initValue instanceof Function ? initValue() : initValue;

	useEffect(() => {
		setValueForLocalStorage(key, initialValue);
	}, []);

	const subscribe = useCallback(
		(callback: () => void) => {
			const handleStorageChange = (event: StorageEvent) => {
				if (event.key === key) {
					callback();
				}
			};

			window.addEventListener('storage', handleStorageChange);

			return () => {
				window.removeEventListener('storage', handleStorageChange);
			};
		},
		[key],
	);

	const getSnapshot = () => {
		const storedValue = localStorage.getItem(key);

		try {
			if (storedValue) {
				return JSON.parse(storedValue);
			} else {
				return initialValue;
			}
		} catch (error) {
			console.error(
				`Failed to parse stored value for key "${key}": ${
					(error as Error).message
				}`,
			);

			if (storedValue === 'undefined') {
				return undefined;
			} else if (storedValue === null) {
				return null;
			}

			return initialValue;
		}
	};

	const value: Value | InitialValue = useSyncExternalStore(
		subscribe,
		getSnapshot,
	);

	return {
		value: value,
		setValueForLocalStorage: <NewValue>(newValue: NewValue) =>
			setValueForLocalStorage(key, newValue),
		removeKeyFromLocalStorage: () => removeKeyFromLocalStorage(key),
		clearLocalStorage: clearLocalStorage,
	} as const;
}
