import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';
import { useLocalStorage } from './useLocalStorage';
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

		const { value } = result.current;

		expect(value).toBe('bar');
	});

	it('should return setted value and update state', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
		act(() => {
			result.current.setValueForLocalStorage('doe');
		});

		expect(result.current.value).toBe('doe');
	});

	it('should return setted value and update window.localStorage', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
		act(() => {
			result.current.setValueForLocalStorage('doe');
		});

		expect(window.localStorage.getItem('foo')).toBe(JSON.stringify('doe'));
	});

	it('should return value with func', () => {
		const { result } = renderHook(() => useLocalStorage('key', () => 'value'));

		expect(result.current.value).toBe('value');
	});

	it('update state with undefined', () => {
		const { result } = renderHook(() => useLocalStorage('key', 'value'));

		act(() => {
			result.current.setValueForLocalStorage(undefined);
		});

		expect(result.current.value).toBeUndefined();
	});

	it('update state with undefined', () => {
		const { result } = renderHook(() => useLocalStorage('key', 'value'));

		act(() => {
			result.current.setValueForLocalStorage(null);
		});

		expect(result.current.value).toBeNull();
	});

	it('Remove state => Reset state value to init => remove localStorage key', () => {
		const { result } = renderHook(() => useLocalStorage('key', 'value'));

		act(() => {
			result.current.setValueForLocalStorage('updated');
		});

		expect(result.current.value).toBe('updated');
		expect(window.localStorage.getItem('key')).toBe(JSON.stringify('updated'));

		act(() => {
			result.current.removeKeyFromLocalStorage();
		});

		expect(window.localStorage.getItem('key')).toBeNull();
		expect(result.current.value).toBe('value');
	});

	it('should return initial value from localstorage.get FOR THE FIRST CALL', () => {
		const { result } = renderHook(() => useLocalStorage('foo', 'bar'));

		const { value } = result.current;

		expect(value).toBe('bar');
		expect(window.localStorage.getItem('foo')).toBe(JSON.stringify('bar'));
	});

	it('update state with callback function with args', () => {
		const { result } = renderHook(() => useLocalStorage('key', 1));

		act(() => {
			result.current.setValueForLocalStorage((prev: number) => prev + 1);
		});

		expect(result.current.value).toBe(2);
		expect(window.localStorage.getItem('key')).toBe(JSON.stringify(2));
	});

	it('update state with multi callback function with args', () => {
		const { result } = renderHook(() => useLocalStorage('key', 1));

		act(() => {
			result.current.setValueForLocalStorage((prev: number) => prev + 1);
			result.current.setValueForLocalStorage((prev: number) => prev + 1);
			result.current.setValueForLocalStorage((prev: number) => prev + 1);
		});

		expect(result.current.value).toBe(4);
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
			A.current.setValueForLocalStorage('updated');
		});

		expect(B.current.value).toBe('updated');
		expect(C.current.value).toBe('value');
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
			A.current.setValueForLocalStorage('updated');
		});

		expect(render).toBe(2);

		act(() => {
			B.current.setValueForLocalStorage('updated');
		});

		expect(render).toBe(2);
	});
});
