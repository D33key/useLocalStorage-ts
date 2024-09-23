import { useSyncExternalStore } from 'react';

export const setLocalStorageValueGlobally = <NewValue>(
	key: string,
	newValue: NewValue,
) => {
	const value = JSON.stringify(newValue);

	localStorage.setItem(key, value);
	window.dispatchEvent(
		new StorageEvent('storage', {
			key,
			newValue: value,
		}),
	);
};

export function useLocalStorage<Value, InitialValue>(
	key: string,
	initialValue: InitialValue,
) {
	const getSnapshot = () => {
		const storedValue = localStorage.getItem(key);

		return storedValue ? JSON.parse(storedValue) : initialValue;
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

	const value: Value = useSyncExternalStore(subscribe, getSnapshot);

	const setValue = <NewValue>(newValue: NewValue) => {
		setLocalStorageValueGlobally(key, newValue);
	};

	return [value, setValue] as const;
}
