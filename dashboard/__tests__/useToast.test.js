/**
 * useToast Hook Tests
 * 
 * Tests for the custom toast hook
 */

import { renderHook, act } from '@testing-library/react';
import { useToast } from '../hooks/useToast';

// Mock timers
jest.useFakeTimers();

describe('useToast', () => {
  
  test('should initialize with null toast', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toast).toBeNull();
  });

  test('should show success toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    expect(result.current.toast).toEqual({
      message: 'Success message',
      type: 'success'
    });
  });

  test('should show error toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showError('Error message');
    });
    
    expect(result.current.toast).toEqual({
      message: 'Error message',
      type: 'error'
    });
  });

  test('should show toast with custom type', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showToast('Custom message', 'warning');
    });
    
    expect(result.current.toast).toEqual({
      message: 'Custom message',
      type: 'warning'
    });
  });

  test('should hide toast manually', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    expect(result.current.toast).not.toBeNull();
    
    act(() => {
      result.current.hideToast();
    });
    
    expect(result.current.toast).toBeNull();
  });

  test('should auto-dismiss toast after 5 seconds', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    expect(result.current.toast).not.toBeNull();
    
    // Fast-forward time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(result.current.toast).toBeNull();
  });

  test('should not auto-dismiss before 5 seconds', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('Success message');
    });
    
    expect(result.current.toast).not.toBeNull();
    
    // Fast-forward time by 4 seconds (less than 5)
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    
    expect(result.current.toast).not.toBeNull();
  });

  test('should clear previous timer when showing new toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.showSuccess('First message');
    });
    
    // Fast-forward 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Show new toast
    act(() => {
      result.current.showError('Second message');
    });
    
    expect(result.current.toast).toEqual({
      message: 'Second message',
      type: 'error'
    });
    
    // Fast-forward 3 more seconds (6 total, but timer should have reset)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Toast should still be visible (only 3 seconds since second toast)
    expect(result.current.toast).not.toBeNull();
    
    // Fast-forward 2 more seconds (5 seconds since second toast)
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Now toast should be dismissed
    expect(result.current.toast).toBeNull();
  });
});

// Restore real timers after tests
afterAll(() => {
  jest.useRealTimers();
});
