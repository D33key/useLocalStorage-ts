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

	it('Remove state => remove localStorage key', () => {
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
});
