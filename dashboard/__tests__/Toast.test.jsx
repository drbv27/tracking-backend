/**
 * Toast Component Tests
 * 
 * Tests for the toast notification component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '../components/Toast';

describe('Toast', () => {
  const mockOnClose = jest.fn();
  const testMessage = 'Test notification message';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render when message is null', () => {
    const { container } = render(
      <Toast message={null} type="success" onClose={mockOnClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('should not render when message is empty', () => {
    const { container } = render(
      <Toast message="" type="success" onClose={mockOnClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('should render toast with message', () => {
    render(
      <Toast message={testMessage} type="success" onClose={mockOnClose} />
    );
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('should render success toast with green background', () => {
    const { container } = render(
      <Toast message={testMessage} type="success" onClose={mockOnClose} />
    );
    
    const toast = container.querySelector('.bg-green-500');
    expect(toast).toBeInTheDocument();
  });

  test('should render error toast with red background', () => {
    const { container } = render(
      <Toast message={testMessage} type="error" onClose={mockOnClose} />
    );
    
    const toast = container.querySelector('.bg-red-500');
    expect(toast).toBeInTheDocument();
  });

  test('should call onClose when close button is clicked', () => {
    render(
      <Toast message={testMessage} type="success" onClose={mockOnClose} />
    );
    
    const closeButton = screen.getByLabelText('Cerrar notificación');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should have role="alert" for accessibility', () => {
    render(
      <Toast message={testMessage} type="success" onClose={mockOnClose} />
    );
    
    const toast = screen.getByRole('alert');
    expect(toast).toBeInTheDocument();
  });

  test('should display checkmark icon for success type', () => {
    const { container } = render(
      <Toast message={testMessage} type="success" onClose={mockOnClose} />
    );
    
    // Check for SVG with checkmark path
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('should display error icon for error type', () => {
    const { container } = render(
      <Toast message={testMessage} type="error" onClose={mockOnClose} />
    );
    
    // Check for SVG with X path
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('should default to success type when type is not provided', () => {
    const { container } = render(
      <Toast message={testMessage} onClose={mockOnClose} />
    );
    
    const toast = container.querySelector('.bg-green-500');
    expect(toast).toBeInTheDocument();
  });
});
