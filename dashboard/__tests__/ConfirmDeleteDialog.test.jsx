/**
 * ConfirmDeleteDialog Component Tests
 * 
 * Tests for the confirmation dialog component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

describe('ConfirmDeleteDialog', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const testProjectName = 'Test Project';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDeleteDialog
        isOpen={false}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('should render dialog when isOpen is true', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('¿Eliminar Proyecto?')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(testProjectName))).toBeInTheDocument();
  });

  test('should display project name in dialog', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(new RegExp(testProjectName))).toBeInTheDocument();
  });

  test('should display warning message', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/no se puede deshacer/i)).toBeInTheDocument();
  });

  test('should display list of items to be deleted', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/eventos de tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/datos de analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/configuración del proyecto/i)).toBeInTheDocument();
  });

  test('should call onCancel when Cancel button is clicked', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test('should call onConfirm when Delete button is clicked', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    const deleteButton = screen.getByText('Eliminar Proyecto');
    fireEvent.click(deleteButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test('should disable buttons when isLoading is true', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );
    
    const cancelButton = screen.getByText('Cancelar');
    const deleteButton = screen.getByText('Eliminando...');
    
    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  test('should show loading text when isLoading is true', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('Eliminando...')).toBeInTheDocument();
    expect(screen.queryByText('Eliminar Proyecto')).not.toBeInTheDocument();
  });

  test('should call onCancel when clicking overlay', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );
    
    const overlay = screen.getByRole('dialog').previousSibling;
    fireEvent.click(overlay);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('should not call onCancel when clicking overlay while loading', () => {
    render(
      <ConfirmDeleteDialog
        isOpen={true}
        projectName={testProjectName}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );
    
    const overlay = screen.getByRole('dialog').previousSibling;
    fireEvent.click(overlay);
    
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});
