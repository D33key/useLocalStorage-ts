import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';
import {
	removeKeyFromLocalStorage,
	setValueForLocalStorage,
	useLocalStorage,
} from './useLocalStorage';
import { mockStorage } from '../test/mock';

mockStorage('localStorage');

describe('useLocalStorage()', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	afterEach(() => {
		vitest.clearAllMocks();
	});

	it('should return initial value', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));

		const value = result.current;

		expect(value).toBe('bar');
	});

	it('should return setted value and update state', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
		act(() => {
			setValueForLocalStorage('foo', 'doe');
		});

		expect(result.current).toBe('doe');
	});

	it('should return setted value and update window.localStorage', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
		act(() => {
			setValueForLocalStorage('foo', 'doe');
		});

		expect(window.localStorage.getItem('foo')).toBe(JSON.stringify('doe'));
	});

	it('should return value with func', () => {
		const { result } = renderHook(() => useLocalStorage('key', () => 'value'));

		expect(result.current).toBe('value');
	});

	it('update state with undefined', () => {
		const { result } = renderHook(() => useLocalStorage('key', 'value'));

		act(() => {
			setValueForLocalStorage('key', undefined);
		});

		expect(result.current).toBeUndefined();
	});

	it('update state with undefined', () => {
		const { result } = renderHook(() => useLocalStorage('key', 'value'));

		act(() => {
			setValueForLocalStorage('key', null);
		});

		expect(result.current).toBeNull();
	});

	it('Remove state => Reset state value to init => remove localStorage key', () => {
		const { result } = renderHook(() => useLocalStorage('key', 'value'));

		act(() => {
			setValueForLocalStorage('key', 'updated');
		});

		expect(result.current).toBe('updated');
		expect(window.localStorage.getItem('key')).toBe(JSON.stringify('updated'));

		act(() => {
			removeKeyFromLocalStorage('key');
		});

		expect(window.localStorage.getItem('key')).toBeNull();
		expect(result.current).toBe('value');
	});

	it('should return initial value from localstorage.get FOR THE FIRST CALL', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));

		expect(result.current).toBe('bar');
		expect(window.localStorage.getItem('foo')).toBe(JSON.stringify('bar'));
	});

	it('update state with callback function with args', () => {
		const { result } = renderHook(() => useLocalStorage('key', 1));

		act(() => {
			setValueForLocalStorage('key', (prev: number) => prev + 1);
		});

		expect(result.current).toBe(2);
		expect(window.localStorage.getItem('key')).toBe(JSON.stringify(2));
	});

	it('update state with multi callback function with args', () => {
		const { result } = renderHook(() => useLocalStorage('key', 1));

		act(() => {
			setValueForLocalStorage('key', (prev: number) => prev + 1);
			setValueForLocalStorage('key', (prev: number) => prev + 1);
			setValueForLocalStorage('key', (prev: number) => prev + 1);
		});

		expect(result.current).toBe(4);
		expect(window.localStorage.getItem('key')).toBe(JSON.stringify(4));
	});

	it('Update one hook updates the others (with similar key in localStorage)', () => {
		const initValue: [string, string] = ['key', 'value'];
		const { result: A } = renderHook(() => useLocalStorage(...initValue));
		const { result: B } = renderHook(() => useLocalStorage(...initValue));
		const { result: C } = renderHook(() =>
			useLocalStorage('other-key', 'value'),
		);

		act(() => {
			setValueForLocalStorage('key', 'updated');
		});

		expect(A.current).toBe('updated');
		expect(B.current).toBe('updated');
		expect(C.current).toBe('value');
	});

	it('Update one hook does not update the others (with different key in localStorage)', () => {
		let render = 0;
		const { result: A } = renderHook(() => {
			render++;
			return useLocalStorage('key', 'value');
		});

		const { result: B } = renderHook(() => useLocalStorage('key2', 'value'));

		expect(render).toBe(1);

		act(() => {
			setValueForLocalStorage('key', 'updated');
		});

		expect(render).toBe(2);

		act(() => {
			setValueForLocalStorage('key2', 'updated');
		});

		expect(render).toBe(2);
	});
});
